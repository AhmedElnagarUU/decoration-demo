"use client";

import { IS_PHONE_OTP_AVAILABLE } from "@/lib/config";
import type { AuthSession } from "@/lib/auth/types";
import { createAuthClient } from "better-auth/react";
import { phoneNumberClient } from "better-auth/client/plugins";
import { useCallback, useEffect, useState } from "react";

const IS_DEMO = process.env.NEXT_PUBLIC_APP_MODE === "demo";

const productionClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ,
  plugins: IS_PHONE_OTP_AVAILABLE ? [phoneNumberClient()] : [],
});

interface AuthRequestOptions {
  csrfToken: string;
  website?: string;
}

function mapSessionUser(user: {
  id: string;
  email: string;
  name: string;
  createdAt: Date | string;
  phoneNumber?: string | null;
  phoneNumberVerified?: boolean;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt:
      typeof user.createdAt === "string"
        ? user.createdAt
        : user.createdAt.toISOString(),
    phoneNumber: user.phoneNumber ?? undefined,
    phoneNumberVerified: user.phoneNumberVerified,
  };
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
          user: mapSessionUser(data.session.user),
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

export async function sendPhoneOtp(phoneNumber: string) {
  if (!IS_PHONE_OTP_AVAILABLE) {
    return { error: { message: "Phone OTP is not enabled" } };
  }

  return productionClient.phoneNumber.sendOtp({ phoneNumber });
}

export async function verifyPhoneOtp(
  phoneNumber: string,
  code: string,
  options?: { updatePhoneNumber?: boolean; disableSession?: boolean },
) {
  if (!IS_PHONE_OTP_AVAILABLE) {
    return { error: { message: "Phone OTP is not enabled" } };
  }

  return productionClient.phoneNumber.verify({
    phoneNumber,
    code,
    updatePhoneNumber: options?.updatePhoneNumber ?? false,
    disableSession: options?.disableSession ?? false,
  });
}

export async function removePhoneNumber() {
  if (!IS_PHONE_OTP_AVAILABLE) {
    return { error: { message: "Phone OTP is not enabled" } };
  }

  return productionClient.updateUser({ phoneNumber: null });
}
