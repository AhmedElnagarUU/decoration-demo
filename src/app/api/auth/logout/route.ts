import { auth } from "@/lib/auth/auth";
import { demoAuth } from "@/lib/auth/demo";
import { IS_DEMO } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (IS_DEMO) {
    const token = request.cookies.get(demoAuth.cookieName)?.value;
    if (token) {
      demoAuth.logout(token);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete(demoAuth.cookieName);
    return response;
  }

  await auth.api.signOut({ headers: request.headers });
  return NextResponse.json({ success: true });
}
