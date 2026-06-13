import { generateCsrfToken } from "@/lib/auth/csrf";
import { NextResponse } from "next/server";

export async function GET() {
  const token = generateCsrfToken();
  const response = NextResponse.json({ csrfToken: token });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
