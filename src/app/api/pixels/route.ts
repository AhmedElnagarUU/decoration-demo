import { pixels } from "@/lib/pixels/service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const pixelPlatformSchema = z.enum([
  "meta",
  "google_ga4",
  "google_ads",
  "tiktok",
  "snapchat",
  "gtm",
]);

const createSchema = z.object({
  platform: pixelPlatformSchema,
  label: z.string().min(1),
  pixelId: z.string().min(1),
  enabled: z.boolean(),
  accessToken: z.string().optional(),
  testEventCode: z.string().optional(),
});

export async function GET() {
  const pixelList = await pixels.getPixels();
  return NextResponse.json({ pixels: pixelList });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createSchema.parse(body);
    const pixel = await pixels.createPixel(parsed);
    return NextResponse.json({ pixel }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create pixel" }, { status: 500 });
  }
}
