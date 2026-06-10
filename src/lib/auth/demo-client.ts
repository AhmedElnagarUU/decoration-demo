import type { AuthSession, AuthUser } from "./types";

const KEYS = {
  users: "dc_users",
  session: "dc_session",
} as const;

export function syncUsersToClient(users: AuthUser[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.users, JSON.stringify(users));
}

export function syncSessionToClient(session: AuthSession | null): void {
  if (typeof window === "undefined") return;
  if (session) {
    localStorage.setItem(KEYS.session, JSON.stringify(session));
  } else {
    localStorage.removeItem(KEYS.session);
  }
}

export function getClientSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEYS.session);
  if (!raw) return null;
  const session: AuthSession = JSON.parse(raw);
  if (new Date(session.expiresAt) < new Date()) {
    localStorage.removeItem(KEYS.session);
    return null;
  }
  return session;
}

export function getClientUsers(): AuthUser[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEYS.users);
  return raw ? JSON.parse(raw) : [];
}
