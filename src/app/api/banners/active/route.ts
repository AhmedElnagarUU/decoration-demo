import { data } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
  const banner = await data.getActiveBanner();
  return NextResponse.json({ banner });
}
