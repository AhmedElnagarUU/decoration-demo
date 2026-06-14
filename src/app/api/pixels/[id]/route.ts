import { pixels } from "@/lib/pixels/service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  platform: z
    .enum(["meta", "google_ga4", "google_ads", "tiktok", "snapchat", "gtm"])
    .optional(),
  label: z.string().min(1).optional(),
  pixelId: z.string().min(1).optional(),
  enabled: z.boolean().optional(),
  accessToken: z.string().optional(),
  testEventCode: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.parse(body);
    const pixel = await pixels.updatePixel(id, parsed);
    if (!pixel) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ pixel });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const success = await pixels.deletePixel(id);
  if (!success) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
