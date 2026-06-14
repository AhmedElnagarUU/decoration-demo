import { data } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const trackSchema = z.object({
  page: z.string().min(1),
  referrer: z.string(),
  visitorId: z.string().min(1),
  timestamp: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = trackSchema.parse(body);
    const event = await data.trackAnalytics(parsed);
    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}
