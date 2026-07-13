import { cookies } from "next/headers";
import { createHash } from "node:crypto";

export const OP_COOKIE = "zellige_op";

export function operatorToken(): string {
  return createHash("sha256").update(`operator:${process.env.OPERATOR_PASSWORD || ""}`).digest("hex");
}

export async function isOperator(): Promise<boolean> {
  if (!process.env.OPERATOR_PASSWORD) return false;
  const c = await cookies();
  return c.get(OP_COOKIE)?.value === operatorToken();
}
