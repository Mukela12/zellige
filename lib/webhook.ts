import { createHmac, timingSafeEqual, createHash } from "node:crypto";

/** sha256 hex of the raw request body — used as the idempotency key. */
export function sha256Hex(body: string): string {
  return createHash("sha256").update(body, "utf8").digest("hex");
}

/** HMAC-SHA256 signature over the raw body, formatted `sha256=<hex>`. */
export function signHmac(body: string, secret: string): string {
  return "sha256=" + createHmac("sha256", secret).update(body, "utf8").digest("hex");
}

/**
 * Constant-time verification of an inbound `sha256=<hex>` signature against the
 * HMAC of the RAW body. Length-checks first so timingSafeEqual never throws.
 */
export function verifyHmac(rawBody: string, signature: string | null | undefined, secret: string): boolean {
  if (!signature || !secret) return false;
  const expected = signHmac(rawBody, secret);
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
