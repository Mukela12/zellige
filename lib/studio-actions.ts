"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sql } from "@/db";
import { signHmac } from "@/lib/webhook";
import { OP_COOKIE, operatorToken } from "@/lib/studio-auth";

export async function studioLogin(_prev: unknown, formData: FormData): Promise<{ error?: string }> {
  const password = String(formData.get("password") ?? "");
  if (!process.env.OPERATOR_PASSWORD || password !== process.env.OPERATOR_PASSWORD) {
    return { error: "Incorrect password" };
  }
  const c = await cookies();
  c.set(OP_COOKIE, operatorToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  redirect("/studio");
}

export async function studioLogout(): Promise<void> {
  const c = await cookies();
  c.delete(OP_COOKIE);
  redirect("/studio/login");
}

/**
 * Server-signs a CRM webhook payload so the browser can POST it to the real
 * public endpoint. The secret never leaves the server; only the HMAC for this
 * exact payload is returned. Reusing `nonce` reproduces the same body (same
 * payload_hash) to demonstrate idempotency; `tamper` returns a broken signature.
 */
export async function buildSignedTestEvent(opts: { nonce?: string; tamper?: boolean }): Promise<{
  body: string;
  signature: string;
  nonce: string;
  leadRef: string | null;
}> {
  const secret = process.env.CRM_WEBHOOK_SECRET || "";
  const nonce = opts.nonce || Math.random().toString(36).slice(2, 10);

  const latest = await sql<{ ref: string }[]>`SELECT ref FROM leads ORDER BY created_at DESC LIMIT 1`;
  const leadRef = latest[0]?.ref ?? null;

  const body = JSON.stringify({
    id: `evt_${nonce}`,
    event: "lead.status_changed",
    ref: leadRef,
    status: "contacted",
    source: "operator-console-test",
    nonce,
  });

  const signature = opts.tamper ? "sha256=deadbeef" : signHmac(body, secret);
  return { body, signature, nonce, leadRef };
}
