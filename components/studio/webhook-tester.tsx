"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send, Repeat, ShieldAlert, Loader2 } from "lucide-react";
import { buildSignedTestEvent } from "@/lib/studio-actions";

type Entry = { kind: string; httpStatus: number; status: string; hash: string; at: string };

const badgeClass: Record<string, string> = {
  processed: "pill--success",
  duplicate: "pill--warning",
  "invalid signature": "pill--danger",
};

export function WebhookTester() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [lastNonce, setLastNonce] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [log, setLog] = useState<Entry[]>([]);

  async function fire(kind: "new" | "replay" | "tamper") {
    setBusy(kind);
    try {
      const signed = await buildSignedTestEvent({
        nonce: kind === "replay" ? lastNonce ?? undefined : undefined,
        tamper: kind === "tamper",
      });
      const res = await fetch("/api/webhooks/crm", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-crm-event": "lead.status_changed",
          "x-crm-signature": signed.signature,
        },
        body: signed.body,
      });
      const json = await res.json().catch(() => ({}));
      const status: string = json.status || json.error || String(res.status);
      setLog((l) => [
        { kind, httpStatus: res.status, status, hash: (json.payloadHash || "").slice(0, 10), at: new Date().toLocaleTimeString() },
        ...l,
      ].slice(0, 8));
      if (kind === "new" && res.ok) setLastNonce(signed.nonce);
      startTransition(() => router.refresh());
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="panel p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="serif text-[1.25rem] font-semibold tracking-[-0.01em]">Webhook tester</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Signs a CRM event server-side, then posts it to the live <span className="font-mono text-xs">/api/webhooks/crm</span> endpoint.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5">
        <button onClick={() => fire("new")} disabled={!!busy} className="btn btn--primary btn--sm">
          {busy === "new" ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />} Send test event
        </button>
        <button onClick={() => fire("replay")} disabled={!!busy || !lastNonce} className="btn btn--secondary btn--sm">
          {busy === "replay" ? <Loader2 size={15} className="animate-spin" /> : <Repeat size={15} />} Replay last event
        </button>
        <button onClick={() => fire("tamper")} disabled={!!busy} className="btn btn--secondary btn--sm">
          {busy === "tamper" ? <Loader2 size={15} className="animate-spin" /> : <ShieldAlert size={15} />} Tampered signature
        </button>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        First send is <span className="text-success">processed</span>. Replay reuses the same payload_hash and is absorbed as a{" "}
        <span className="text-warning">duplicate</span>. A tampered signature is <span className="text-destructive">rejected</span> with 401.
      </p>

      {log.length > 0 && (
        <ul className="mt-5 space-y-2">
          {log.map((e, i) => (
            <li key={i} className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-card px-3.5 py-2.5 text-sm">
              <span className="flex items-center gap-2.5">
                <span className={`pill ${badgeClass[e.status] ?? "pill--neutral"}`}>{e.status}</span>
                <span className="font-mono text-xs text-muted-foreground">HTTP {e.httpStatus}{e.hash ? ` · ${e.hash}…` : ""}</span>
              </span>
              <span className="font-mono text-xs text-muted-foreground">{e.at}</span>
            </li>
          ))}
        </ul>
      )}
      {pending && <p className="mt-2 text-xs text-muted-foreground">Refreshing…</p>}
    </div>
  );
}
