import { redirect } from "next/navigation";
import { LogOut, Users, Webhook, CheckCircle2, ShieldX, ExternalLink } from "lucide-react";
import { isOperator } from "@/lib/studio-auth";
import { studioLogout } from "@/lib/studio-actions";
import { sql } from "@/db";
import { ZelligeWordmark } from "@/components/site/brand";
import { WebhookTester } from "@/components/studio/webhook-tester";

export const dynamic = "force-dynamic";

const leadStatusPill: Record<string, string> = {
  new: "pill--brand", contacted: "pill--warning", qualified: "pill--accent", converted: "pill--success", archived: "pill--neutral",
};
const eventStatusPill: Record<string, string> = {
  processed: "pill--success", received: "pill--brand", duplicate: "pill--warning", invalid: "pill--danger",
};
const crmPill: Record<string, string> = { sent: "pill--success", pending: "pill--neutral", failed: "pill--danger", skipped: "pill--outline" };

function fmt(d: Date | string | null) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default async function StudioDashboard() {
  if (!(await isOperator())) redirect("/studio/login");

  const [counts] = await sql<{ leads: number; leads_new: number; events: number; processed: number; invalid: number }[]>`
    SELECT
      (SELECT count(*) FROM leads)::int AS leads,
      (SELECT count(*) FROM leads WHERE status = 'new')::int AS leads_new,
      (SELECT count(*) FROM webhook_events)::int AS events,
      (SELECT count(*) FROM webhook_events WHERE status = 'processed')::int AS processed,
      (SELECT count(*) FROM webhook_events WHERE status = 'invalid')::int AS invalid`;

  const leads = await sql`
    SELECT ref, full_name, email, trip_type, region_slug, itinerary_slug, adults, children, infants,
           budget_band, status, crm_status, created_at
    FROM leads ORDER BY created_at DESC LIMIT 25`;
  const events = await sql`
    SELECT event_type, status, payload_hash, related_lead_ref, received_at
    FROM webhook_events ORDER BY received_at DESC LIMIT 15`;
  const deliveries = await sql`
    SELECT lead_ref, endpoint, status, response_code, created_at
    FROM outbound_deliveries ORDER BY created_at DESC LIMIT 8`;
  const audit = await sql`
    SELECT entity_id, action, meta, created_at FROM audit_log ORDER BY created_at DESC LIMIT 10`;

  const stats = [
    { label: "Leads captured", value: counts.leads, Icon: Users, sub: `${counts.leads_new} new` },
    { label: "Webhook events", value: counts.events, Icon: Webhook, sub: "inbound CRM" },
    { label: "Processed", value: counts.processed, Icon: CheckCircle2, sub: "signature valid" },
    { label: "Rejected", value: counts.invalid, Icon: ShieldX, sub: "bad signature" },
  ];

  return (
    <div className="min-h-dvh bg-background">
      {/* topbar */}
      <header className="topbar justify-between">
        <div className="flex items-center gap-3">
          <ZelligeWordmark size={20} />
          <span className="pill pill--outline">Operator console</span>
        </div>
        <div className="flex items-center gap-2">
          <a href="/en" target="_blank" className="btn btn--ghost btn--sm">
            View site <ExternalLink size={14} />
          </a>
          <form action={studioLogout}>
            <button type="submit" className="btn btn--ghost btn--sm"><LogOut size={15} /> Sign out</button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        {/* stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, Icon, sub }) => (
            <div key={label} className="stat-card">
              <div className="flex items-center justify-between">
                <span className="eyebrow">{label}</span>
                <Icon size={16} className="text-muted-foreground" />
              </div>
              <p className="stat-num mt-2 text-3xl font-semibold">{value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        {/* webhook tester */}
        <div className="mt-6">
          <WebhookTester />
        </div>

        {/* leads */}
        <section className="mt-8">
          <h2 className="serif text-[1.4rem] font-semibold tracking-[-0.01em]">Recent leads</h2>
          <div className="panel mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-[0.06em] text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Reference</th>
                  <th className="px-4 py-3 font-medium">Traveller</th>
                  <th className="px-4 py-3 font-medium">Trip</th>
                  <th className="px-4 py-3 font-medium">Party</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">CRM</th>
                  <th className="px-4 py-3 font-medium">Received</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l: Record<string, unknown>) => (
                  <tr key={l.ref as string} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 font-mono text-xs">{l.ref as string}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{l.full_name as string}</div>
                      <div className="text-xs text-muted-foreground">{l.email as string}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="capitalize">{(l.trip_type as string).replace("-", " ")}</div>
                      <div className="text-xs text-muted-foreground">{(l.itinerary_slug as string) || (l.region_slug as string) || "—"}</div>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-xs">
                      {l.adults as number}a · {l.children as number}c · {l.infants as number}i
                    </td>
                    <td className="px-4 py-3"><span className={`pill ${leadStatusPill[l.status as string] ?? "pill--neutral"}`}>{l.status as string}</span></td>
                    <td className="px-4 py-3"><span className={`pill ${crmPill[l.crm_status as string] ?? "pill--neutral"}`}>{l.crm_status as string}</span></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{fmt(l.created_at as string)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* webhook events + audit */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section>
            <h2 className="serif text-[1.4rem] font-semibold tracking-[-0.01em]">Webhook event log</h2>
            <div className="panel mt-4 divide-y divide-border/60">
              {events.length === 0 && <div className="empty-state m-3">No events yet.</div>}
              {events.map((e: Record<string, unknown>, i: number) => (
                <div key={i} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`pill ${eventStatusPill[e.status as string] ?? "pill--neutral"}`}>{e.status as string}</span>
                      <span className="truncate text-sm">{(e.event_type as string) || "—"}</span>
                    </div>
                    <div className="mt-1 font-mono text-[11px] text-muted-foreground">
                      {(e.payload_hash as string).slice(0, 16)}… {e.related_lead_ref ? `· ${e.related_lead_ref}` : ""}
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{fmt(e.received_at as string)}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="serif text-[1.4rem] font-semibold tracking-[-0.01em]">Audit log</h2>
            <div className="panel mt-4 divide-y divide-border/60">
              {audit.length === 0 && <div className="empty-state m-3">No audit entries yet.</div>}
              {audit.map((a: Record<string, unknown>, i: number) => (
                <div key={i} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <div className="text-sm">{a.action as string}</div>
                    <div className="mt-1 font-mono text-[11px] text-muted-foreground">
                      {a.entity_id as string} {a.meta ? `· ${JSON.stringify(a.meta)}` : ""}
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{fmt(a.created_at as string)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* outbound deliveries */}
        <section className="mt-8">
          <h2 className="serif text-[1.4rem] font-semibold tracking-[-0.01em]">Outbound CRM deliveries</h2>
          <div className="panel mt-4 divide-y divide-border/60">
            {deliveries.length === 0 && <div className="empty-state m-3">No deliveries yet.</div>}
            {deliveries.map((d: Record<string, unknown>, i: number) => (
              <div key={i} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <div className="flex items-center gap-2.5">
                  <span className={`pill ${crmPill[d.status as string] ?? "pill--neutral"}`}>{d.status as string}</span>
                  <span className="font-mono text-xs">{d.lead_ref as string}</span>
                  <span className="truncate text-xs text-muted-foreground">{d.endpoint as string}</span>
                </div>
                <span className="text-xs text-muted-foreground">{d.response_code ? `HTTP ${d.response_code} · ` : ""}{fmt(d.created_at as string)}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
