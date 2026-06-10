import { auth } from "@/lib/auth/auth";
import { demoAuth } from "@/lib/auth/demo";
import { IS_DEMO } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = schema.parse(body);

    if (IS_DEMO) {
      const session = await demoAuth.register({ email, password, name });
      const users = demoAuth.getAllUsers();

      const response = NextResponse.json({ session, users });
      response.cookies.set(demoAuth.cookieName, session.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(session.expiresAt),
      });
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
