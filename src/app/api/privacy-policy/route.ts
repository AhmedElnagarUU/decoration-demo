import { privacyPolicy } from "@/lib/privacy-policy/service";
import { revalidateContentPaths } from "@/lib/revalidate-content";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const localizedStringSchema = z.object({
  en: z.string(),
  ar: z.string(),
});

const updateSchema = z.object({
  content: localizedStringSchema.optional(),
  published: z.boolean().optional(),
});

export async function GET() {
  const policy = await privacyPolicy.getPrivacyPolicy();
  return NextResponse.json({ privacyPolicy: policy });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = updateSchema.parse(body);
    const updated = await privacyPolicy.updatePrivacyPolicy(parsed);
    revalidateContentPaths();
    return NextResponse.json({ privacyPolicy: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update privacy policy" },
      { status: 500 },
    );
  }
}
