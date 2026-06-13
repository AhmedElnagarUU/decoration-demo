import { auth } from "@/lib/auth/auth";
import { demoAuth } from "@/lib/auth/demo";
import { sanitizePublicSession } from "@/lib/auth/secure-auth";
import { IS_DEMO } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  if (IS_DEMO) {
    const token = request.cookies.get(demoAuth.cookieName)?.value;
    if (!token) {
      return NextResponse.json({ session: null });
    }

    const session = demoAuth.getSession(token);
    if (!session) {
      const response = NextResponse.json({ session: null });
      response.cookies.delete(demoAuth.cookieName);
      return response;
    }

    return NextResponse.json({ session: sanitizePublicSession(session) });
  }

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ session: null });
  }

  return NextResponse.json({
    session: {
      user: session.user,
      expiresAt: session.session.expiresAt,
    },
  });
}
