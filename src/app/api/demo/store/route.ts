import { IS_DEMO } from "@/lib/config";
import type { Banner, Inquiry, Pixel, PrivacyPolicy, Project, SocialLink } from "@/lib/data/types";
import {
  getDemoStoreSnapshot,
  hydrateDemoStore,
  type DemoStore,
} from "@/lib/data/demo";
import {
  getDemoPixelsSnapshot,
  hydrateDemoPixels,
} from "@/lib/pixels/demo";
import {
  getDemoPrivacyPolicySnapshot,
  hydrateDemoPrivacyPolicy,
} from "@/lib/privacy-policy/demo";
import {
  getDemoSocialLinksSnapshot,
  hydrateDemoSocialLinks,
} from "@/lib/social-links/demo";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const hydrateSchema = z.object({
  projects: z.array(z.custom<Project>()).optional(),
  banners: z.array(z.custom<Banner>()).optional(),
  inquiries: z.array(z.custom<Inquiry>()).optional(),
  pixels: z.array(z.custom<Pixel>()).optional(),
  socialLinks: z.array(z.custom<SocialLink>()).optional(),
  privacyPolicy: z.custom<PrivacyPolicy>().optional(),
});

export async function GET() {
  if (!IS_DEMO) {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const store = getDemoStoreSnapshot();
  return NextResponse.json({
    projects: store.projects,
    banners: store.banners,
    inquiries: store.inquiries,
    pixels: getDemoPixelsSnapshot(),
    socialLinks: getDemoSocialLinksSnapshot(),
    privacyPolicy: getDemoPrivacyPolicySnapshot(),
  });
}

export async function POST(request: NextRequest) {
  if (!IS_DEMO) {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const parsed = hydrateSchema.parse(body);

    if (parsed.projects || parsed.banners || parsed.inquiries) {
      const patch: Partial<DemoStore> = {};
      if (parsed.projects) patch.projects = parsed.projects;
      if (parsed.banners) patch.banners = parsed.banners;
      if (parsed.inquiries) patch.inquiries = parsed.inquiries;
      hydrateDemoStore(patch);
    }

    if (parsed.pixels) {
      hydrateDemoPixels(parsed.pixels);
    }

    if (parsed.socialLinks) {
      hydrateDemoSocialLinks(parsed.socialLinks);
    }

    if (parsed.privacyPolicy) {
      hydrateDemoPrivacyPolicy(parsed.privacyPolicy);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
