interface AttemptRecord {
  count: number;
  windowStart: number;
  lockedUntil?: number;
}

const store = new Map<string, AttemptRecord>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

function getKey(ip: string, email?: string): string {
  return email ? `${ip}:${email.toLowerCase().trim()}` : ip;
}

export function checkLoginAllowed(
  ip: string,
  email?: string,
): { allowed: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const key = getKey(ip, email);
  const record = store.get(key);

  if (record?.lockedUntil && record.lockedUntil > now) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((record.lockedUntil - now) / 1000),
    };
  }

  if (record?.lockedUntil && record.lockedUntil <= now) {
    store.delete(key);
  }

  return { allowed: true };
}

export function recordFailedLogin(ip: string, email?: string): void {
  const now = Date.now();
  const key = getKey(ip, email);
  const record = store.get(key);

  if (!record || now - record.windowStart > WINDOW_MS) {
    store.set(key, { count: 1, windowStart: now });
    return;
  }

  record.count += 1;
  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
  }
}

export function clearLoginAttempts(ip: string, email?: string): void {
  store.delete(getKey(ip, email));
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}
