const STORAGE_TTL_MS = 5 * 60 * 60 * 1000;

interface StoredEntry {
  v: string;
  e: number;
}

const APP_KEY_PREFIXES = ["dc_", "dashboard-tour-"];

function isAppStorageKey(key: string): boolean {
  return APP_KEY_PREFIXES.some((prefix) => key.startsWith(prefix));
}

function parseEntry(raw: string): StoredEntry | null {
  try {
    const parsed = JSON.parse(raw) as Partial<StoredEntry>;
    if (typeof parsed.v === "string" && typeof parsed.e === "number") {
      return { v: parsed.v, e: parsed.e };
    }
  } catch {
    // Legacy or invalid format
  }
  return null;
}

export function setLocalStorageItem(key: string, value: string): void {
  if (typeof window === "undefined") return;
  const entry: StoredEntry = { v: value, e: Date.now() + STORAGE_TTL_MS };
  localStorage.setItem(key, JSON.stringify(entry));
}

let cleanupDone = false;

export function getLocalStorageItem(key: string): string | null {
  if (typeof window === "undefined") return null;

  if (!cleanupDone) {
    cleanupDone = true;
    cleanupExpiredLocalStorage();
  }

  const raw = localStorage.getItem(key);
  if (!raw) return null;

  const entry = parseEntry(raw);
  if (!entry) {
    localStorage.removeItem(key);
    return null;
  }

  if (Date.now() > entry.e) {
    localStorage.removeItem(key);
    return null;
  }

  return entry.v;
}

export function removeLocalStorageItem(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}

export function cleanupExpiredLocalStorage(): void {
  if (typeof window === "undefined") return;

  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && isAppStorageKey(key)) keys.push(key);
  }

  for (const key of keys) {
    getLocalStorageItem(key);
  }
}
