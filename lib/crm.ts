import "server-only";
import { db, schema } from "@/db";
import { signHmac } from "./webhook";

const { outboundDeliveries } = schema;

export interface LeadForCrm {
  id: string;
  ref: string;
  fullName: string;
  email: string;
  phone: string | null;
  tripType: string;
  itinerarySlug: string | null;
  regionSlug: string | null;
  startDate: string | null;
  endDate: string | null;
  flexibleDates: boolean;
  adults: number;
  children: number;
  infants: number;
  budgetBand: string;
  pace: string;
  interests: string[];
  notes: string | null;
  locale: string;
}

export type CrmResult = { status: "sent" | "failed" | "skipped"; code?: number };

/**
 * Outbound CRM submission. Signs the payload with the same HMAC-SHA256 scheme
 * the inbound endpoint validates, POSTs it, and records the attempt in
 * outbound_deliveries. With no CRM_OUTBOUND_URL configured the submission is
 * simulated + logged (so the demo runs without a live CRM).
 */
export async function submitLeadToCrm(lead: LeadForCrm): Promise<CrmResult> {
  const endpoint = process.env.CRM_OUTBOUND_URL?.trim();
  const secret = process.env.CRM_WEBHOOK_SECRET || "";

  const body = JSON.stringify({
    event: "lead.created",
    ref: lead.ref,
    submittedAt: new Date().toISOString(),
    contact: { name: lead.fullName, email: lead.email, phone: lead.phone },
    trip: {
      type: lead.tripType,
      itinerary: lead.itinerarySlug,
      region: lead.regionSlug,
      startDate: lead.startDate,
      endDate: lead.endDate,
      flexibleDates: lead.flexibleDates,
      party: { adults: lead.adults, children: lead.children, infants: lead.infants },
      budgetBand: lead.budgetBand,
      pace: lead.pace,
      interests: lead.interests,
    },
    notes: lead.notes,
    locale: lead.locale,
  });

  if (!endpoint) {
    await db.insert(outboundDeliveries).values({
      leadId: lead.id,
      leadRef: lead.ref,
      endpoint: "(simulated)",
      status: "skipped",
      responseBody: "No CRM_OUTBOUND_URL configured. Payload signed and logged, submission simulated.",
    });
    return { status: "skipped" };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-crm-event": "lead.created",
        "x-crm-signature": signHmac(body, secret),
      },
      body,
    });
    const text = await res.text();
    await db.insert(outboundDeliveries).values({
      leadId: lead.id,
      leadRef: lead.ref,
      endpoint,
      status: res.ok ? "sent" : "failed",
      responseCode: res.status,
      responseBody: text.slice(0, 500),
    });
    return { status: res.ok ? "sent" : "failed", code: res.status };
  } catch (err) {
    await db.insert(outboundDeliveries).values({
      leadId: lead.id,
      leadRef: lead.ref,
      endpoint,
      status: "failed",
      responseBody: String(err).slice(0, 500),
    });
    return { status: "failed" };
  }
}
