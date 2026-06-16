import { data } from "@/lib/data";
import { revalidateContentPaths } from "@/lib/revalidate-content";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bannerSchema = z.object({
  message: z.object({ en: z.string().min(1), ar: z.string().min(1) }),
  link: z.string().optional(),
  active: z.boolean(),
  expiresAt: z.string().optional(),
});

export async function GET() {
  const banners = await data.getBanners();
  return NextResponse.json({ banners });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = bannerSchema.parse(body);
    const banner = await data.createBanner(parsed);
    revalidateContentPaths();
    return NextResponse.json({ banner }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}
