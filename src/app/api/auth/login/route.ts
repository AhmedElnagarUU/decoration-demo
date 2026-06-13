import { auth } from "@/lib/auth/auth";
import { demoAuth } from "@/lib/auth/demo";
import {
  checkLoginAllowed,
  clearLoginAttempts,
  getClientIp,
  recordFailedLogin,
} from "@/lib/auth/rate-limit";
import { validateAuthRequest } from "@/lib/auth/secure-auth";
import { IS_DEMO } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  website: z.string().optional(),
});

function setSessionCookie(
  response: NextResponse,
  token: string,
  expiresAt: string,
) {
  response.cookies.set(demoAuth.cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.parse(body);
    const { email, password, website } = parsed;

    const validation = validateAuthRequest(request, { website });
    if (!validation.ok) {
      return NextResponse.json(
        { error: validation.error },
        { status: validation.status },
      );
    }

    const ip = getClientIp(request);
    const rateCheck = checkLoginAllowed(ip, email);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed attempts. Try again in ${rateCheck.retryAfterSec} seconds.`,
        },
        { status: 429 },
      );
    }

    if (IS_DEMO) {
      try {
        const session = await demoAuth.login({ email, password });
        clearLoginAttempts(ip, email);

        const response = NextResponse.json({ user: session.user });
        setSessionCookie(response, session.token, session.expiresAt);
        return response;
      } catch {
        recordFailedLogin(ip, email);
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 },
        );
      }
    }

    const result = await auth.api.signInEmail({
      body: { email, password },
    });

    if (!result) {
      recordFailedLogin(ip, email);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    clearLoginAttempts(ip, email);
    return NextResponse.json({ user: result.user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
