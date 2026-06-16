import { socialLinks } from "@/lib/social-links/service";
import { revalidateContentPaths } from "@/lib/revalidate-content";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const socialLinkSchema = z.object({
  platform: z.enum([
    "instagram",
    "pinterest",
    "linkedin",
    "facebook",
    "tiktok",
    "youtube",
    "x",
    "whatsapp",
  ]),
  label: z.string().min(1),
  url: z.string().url(),
  enabled: z.boolean(),
});

export async function GET() {
  const links = await socialLinks.getSocialLinks();
  return NextResponse.json({ socialLinks: links });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = socialLinkSchema.parse(body);
    const link = await socialLinks.createSocialLink(parsed);
    revalidateContentPaths();
    return NextResponse.json({ socialLink: link }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create social link" }, { status: 500 });
  }
}
