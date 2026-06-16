import { socialLinks } from "@/lib/social-links/service";
import { revalidateContentPaths } from "@/lib/revalidate-content";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  platform: z
    .enum([
      "instagram",
      "pinterest",
      "linkedin",
      "facebook",
      "tiktok",
      "youtube",
      "x",
      "whatsapp",
    ])
    .optional(),
  label: z.string().min(1).optional(),
  url: z.string().url().optional(),
  enabled: z.boolean().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.parse(body);
    const link = await socialLinks.updateSocialLink(id, parsed);
    if (!link) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    revalidateContentPaths();
    return NextResponse.json({ socialLink: link });
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
  const success = await socialLinks.deleteSocialLink(id);
  if (!success) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  revalidateContentPaths();
  return NextResponse.json({ success: true });
}
