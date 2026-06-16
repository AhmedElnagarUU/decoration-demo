import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "@/lib/local-storage";
import type { AuthSession, AuthUser } from "./types";

const KEYS = {
  users: "dc_users",
  session: "dc_session",
} as const;

export function syncUsersToClient(users: AuthUser[]): void {
  if (typeof window === "undefined") return;
  setLocalStorageItem(KEYS.users, JSON.stringify(users));
}

export function syncSessionToClient(session: AuthSession | null): void {
  if (typeof window === "undefined") return;
  if (session) {
    setLocalStorageItem(KEYS.session, JSON.stringify(session));
  } else {
    removeLocalStorageItem(KEYS.session);
  }
}

export function getClientSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = getLocalStorageItem(KEYS.session);
  if (!raw) return null;
  const session: AuthSession = JSON.parse(raw);
  if (new Date(session.expiresAt) < new Date()) {
    removeLocalStorageItem(KEYS.session);
    return null;
  }
  return session;
}

export function getClientUsers(): AuthUser[] {
  if (typeof window === "undefined") return [];
  const raw = getLocalStorageItem(KEYS.users);
  return raw ? JSON.parse(raw) : [];
}
