import { auth } from "@/lib/auth/auth";
import { demoAuth } from "@/lib/auth/demo";
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

    return NextResponse.json({ session });
  }

  const session = await auth.api.getSession({ headers: request.headers });
  return NextResponse.json({ session });
}
