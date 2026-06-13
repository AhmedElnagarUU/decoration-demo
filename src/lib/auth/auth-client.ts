"use client";

import type { AuthSession } from "@/lib/auth/types";
import { createAuthClient } from "better-auth/react";
import { useCallback, useEffect, useState } from "react";

const IS_DEMO = process.env.NEXT_PUBLIC_APP_MODE === "demo";

const productionClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
});

interface AuthRequestOptions {
  csrfToken: string;
  website?: string;
}

export async function fetchCsrfToken(): Promise<string> {
  const res = await fetch("/api/auth/csrf", { cache: "no-store" });
  const data = await res.json();
  return data.csrfToken as string;
}

export function useSession() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      const data = await res.json();

      if (data.session?.user) {
        setSession({
          user: {
            id: data.session.user.id,
            email: data.session.user.email,
            name: data.session.user.name,
            createdAt: data.session.user.createdAt,
          },
          token: "",
          expiresAt: data.session.expiresAt,
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

export async function signIn(
  email: string,
  password: string,
  options: AuthRequestOptions,
) {
  if (IS_DEMO) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": options.csrfToken,
      },
      body: JSON.stringify({ email, password, website: options.website ?? "" }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: { message: data.error ?? "Login failed" } };
    }
    return { data: data.user };
  }

  return productionClient.signIn.email({ email, password });
}

export async function signUp(
  email: string,
  password: string,
  name: string,
  options: AuthRequestOptions,
) {
  if (IS_DEMO) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": options.csrfToken,
      },
      body: JSON.stringify({
        email,
        password,
        name,
        website: options.website ?? "",
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: { message: data.error ?? "Registration failed" } };
    }
    return { data: data.user };
  }

  return productionClient.signUp.email({ email, password, name });
}

export async function signOut() {
  if (IS_DEMO) {
    await fetch("/api/auth/logout", { method: "POST" });
    return;
  }

  await productionClient.signOut();
}
