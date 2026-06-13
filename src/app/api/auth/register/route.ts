import { auth } from "@/lib/auth/auth";
import { demoAuth } from "@/lib/auth/demo";
import { validateAuthRequest } from "@/lib/auth/secure-auth";
import { IS_DEMO } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
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
    const { email, password, name, website } = schema.parse(body);

    const validation = validateAuthRequest(request, { website });
    if (!validation.ok) {
      return NextResponse.json(
        { error: validation.error },
        { status: validation.status },
      );
    }

    if (IS_DEMO) {
      const session = await demoAuth.register({ email, password, name });

      const response = NextResponse.json({ user: session.user });
      setSessionCookie(response, session.token, session.expiresAt);
      return response;
    }

    const result = await auth.api.signUpEmail({
      body: { email, password, name },
    });

    if (!result) {
      return NextResponse.json({ error: "Registration failed" }, { status: 400 });
    }

    return NextResponse.json({ user: result.user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
