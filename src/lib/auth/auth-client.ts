"use client";

import {
  getClientSession,
  syncSessionToClient,
  syncUsersToClient,
} from "@/lib/auth/demo-client";
import type { AuthSession } from "@/lib/auth/types";
import { createAuthClient } from "better-auth/react";
import { useCallback, useEffect, useState } from "react";

const IS_DEMO = process.env.NEXT_PUBLIC_APP_MODE === "demo";

const productionClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
});

export function useSession() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (IS_DEMO) {
      const local = getClientSession();
      if (local) {
        setSession(local);
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (IS_DEMO && data.session) {
        syncSessionToClient(data.session);
        setSession(data.session);
      } else if (!IS_DEMO && data.session) {
        setSession({
          user: {
            id: data.session.user.id,
            email: data.session.user.email,
            name: data.session.user.name,
            createdAt: data.session.user.createdAt,
          },
          token: "",
          expiresAt: data.session.session.expiresAt,
        });
      } else {
        setSession(null);
      }
    } catch {
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data: session, isPending: loading, refetch: refresh };
}

export async function signIn(email: string, password: string) {
  if (IS_DEMO) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: { message: data.error ?? "Login failed" } };
    }
    syncSessionToClient(data.session);
    syncUsersToClient(data.users);
    return { data: data.session };
  }

  return productionClient.signIn.email({ email, password });
}

export async function signUp(email: string, password: string, name: string) {
  if (IS_DEMO) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: { message: data.error ?? "Registration failed" } };
    }
    syncSessionToClient(data.session);
    syncUsersToClient(data.users);
    return { data: data.session };
  }

  return productionClient.signUp.email({ email, password, name });
}

export async function signOut() {
  if (IS_DEMO) {
    syncSessionToClient(null);
    await fetch("/api/auth/logout", { method: "POST" });
    return;
  }

  await productionClient.signOut();
}
