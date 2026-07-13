"use server";

import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { leadSchema, type LeadInput } from "./lead-schema";
import { submitLeadToCrm } from "./crm";

function genRef(): string {
  const s = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const pick = (n: number) => Array.from({ length: n }, () => s[Math.floor(Math.random() * s.length)]).join("");
  return `ITN-${pick(4)}-${pick(2)}`;
}

export type SubmitResult = { ok: true; ref: string } | { ok: false; error: string };

export async function submitLead(input: LeadInput): Promise<SubmitResult> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid submission" };
  }
  const d = parsed.data;
  const ref = genRef();

  const startDate = d.startDate || null;
  const endDate = d.endDate || null;

  try {
    const [row] = await db
      .insert(schema.leads)
      .values({
        ref,
        status: "new",
        locale: d.locale,
        tripType: d.tripType,
        itinerarySlug: d.itinerarySlug ?? null,
        regionSlug: d.regionSlug ?? null,
        startDate,
        endDate,
        flexibleDates: d.flexibleDates,
        adults: d.adults,
        children: d.children,
        infants: d.infants,
        budgetBand: d.budgetBand,
        pace: d.pace,
        interests: d.interests,
        fullName: d.fullName,
        email: d.email,
        phone: d.phone ?? null,
        notes: d.notes ?? null,
        source: "web",
        crmStatusVal: "pending",
        payload: d as Record<string, unknown>,
      })
      .returning({ id: schema.leads.id, ref: schema.leads.ref });

    // Outbound CRM submission (runs sequentially; never Promise.all on the pool).
    const crm = await submitLeadToCrm({
      id: row.id,
      ref: row.ref,
      fullName: d.fullName,
      email: d.email,
      phone: d.phone ?? null,
      tripType: d.tripType,
      itinerarySlug: d.itinerarySlug ?? null,
      regionSlug: d.regionSlug ?? null,
      startDate,
      endDate,
      flexibleDates: d.flexibleDates,
      adults: d.adults,
      children: d.children,
      infants: d.infants,
      budgetBand: d.budgetBand,
      pace: d.pace,
      interests: d.interests,
      notes: d.notes ?? null,
      locale: d.locale,
    });

    const crmStatus = crm.status === "sent" ? "sent" : crm.status === "failed" ? "failed" : "skipped";
    await db
      .update(schema.leads)
      .set({ crmStatusVal: crmStatus, crmSyncedAt: crm.status === "sent" ? new Date() : null })
      .where(eq(schema.leads.id, row.id));

    return { ok: true, ref: row.ref };
  } catch (err) {
    console.error("submitLead failed", err);
    return { ok: false, error: "We could not save your request. Please try again." };
  }
}
