import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { verifyHmac, sha256Hex } from "@/lib/webhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const { webhookEvents, leads } = schema;
const LEAD_STATUSES = ["new", "contacted", "qualified", "converted", "archived"] as const;

const CAPTURED_HEADERS = ["x-crm-event", "x-crm-signature", "content-type", "user-agent"];

function collectHeaders(req: NextRequest): Record<string, string> {
  const out: Record<string, string> = {};
  for (const h of CAPTURED_HEADERS) {
    const v = req.headers.get(h);
    if (v) out[h] = h === "x-crm-signature" ? v.slice(0, 20) + "…" : v;
  }
  return out;
}

export async function POST(req: NextRequest) {
  const secret = process.env.CRM_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "Webhook secret not configured" }, { status: 500 });
  }

  // 1. RAW body — HMAC must be computed over the exact bytes received, never a
  //    re-serialized parse.
  const raw = await req.text();
  const signature = req.headers.get("x-crm-signature");
  const payloadHash = sha256Hex(raw);
  const headers = collectHeaders(req);

  // best-effort parse (for logging + optional processing)
  let body: Record<string, unknown> | null = null;
  let eventId: string | null = null;
  let eventType: string | null = null;
  let relatedLeadRef: string | null = null;
  try {
    body = JSON.parse(raw);
    eventId = (body?.id ?? body?.eventId ?? null) as string | null;
    eventType = (body?.event ?? body?.type ?? null) as string | null;
    relatedLeadRef = (body?.ref ?? null) as string | null;
  } catch {
    /* non-JSON body is allowed; signature still governs acceptance */
  }

  // 2. Signature verification (constant time, over the raw body).
  if (!verifyHmac(raw, signature, secret)) {
    await db
      .insert(webhookEvents)
      .values({
        source: "crm", eventId, eventType, signature: signature ?? null, payloadHash,
        headers, body, status: "invalid", error: "Invalid or missing signature", relatedLeadRef,
      })
      .onConflictDoNothing({ target: webhookEvents.payloadHash });
    return NextResponse.json({ ok: false, error: "invalid signature" }, { status: 401 });
  }

  // 3. Idempotency — payload_hash is UNIQUE. A duplicate retry conflicts and is
  //    acknowledged with 200 WITHOUT reprocessing.
  const inserted = await db
    .insert(webhookEvents)
    .values({
      source: "crm", eventId, eventType, signature: signature ?? null, payloadHash,
      headers, body, status: "received", relatedLeadRef,
    })
    .onConflictDoNothing({ target: webhookEvents.payloadHash })
    .returning({ id: webhookEvents.id });

  if (inserted.length === 0) {
    return NextResponse.json(
      { ok: true, status: "duplicate", message: "already processed", payloadHash },
      { status: 200 },
    );
  }

  const eventRowId = inserted[0].id;

  // 4. Process. For lead.status_changed we apply the status (which fires the
  //    audit trigger), demonstrating the status/audit-log path end to end.
  try {
    if (
      eventType === "lead.status_changed" &&
      relatedLeadRef &&
      typeof body?.status === "string" &&
      (LEAD_STATUSES as readonly string[]).includes(body.status)
    ) {
      await db.update(leads).set({ status: body.status as (typeof LEAD_STATUSES)[number] }).where(eq(leads.ref, relatedLeadRef));
    }
    await db
      .update(webhookEvents)
      .set({ status: "processed", processedAt: new Date() })
      .where(eq(webhookEvents.id, eventRowId));
  } catch (err) {
    await db
      .update(webhookEvents)
      .set({ status: "invalid", error: String(err).slice(0, 300) })
      .where(eq(webhookEvents.id, eventRowId));
    return NextResponse.json({ ok: false, error: "processing failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, status: "processed", id: eventRowId, payloadHash }, { status: 200 });
}
