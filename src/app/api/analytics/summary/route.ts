import { data } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
  const summary = await data.getAnalyticsSummary();
  return NextResponse.json({ summary });
}
