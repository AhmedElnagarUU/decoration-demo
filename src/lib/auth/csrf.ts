import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const SECRET =
  process.env.CSRF_SECRET ?? process.env.BETTER_AUTH_SECRET ?? "dev-csrf-secret";

export function generateCsrfToken(): string {
  const nonce = randomBytes(16).toString("hex");
  const sig = createHmac("sha256", SECRET).update(nonce).digest("hex");
  return `${nonce}.${sig}`;
}

export function validateCsrfToken(token: string | null | undefined): boolean {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;

  const nonce = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", SECRET).update(nonce).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}
