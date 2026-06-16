import { data } from "@/lib/data";
import { fireMetaConversionsForSite } from "@/lib/pixels/meta-conversion-api";
import { revalidateContentPaths } from "@/lib/revalidate-content";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.parse(body);

    await data.createInquiry({
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      message: parsed.message,
      source: "contact",
    });

    revalidateContentPaths();

    await fireMetaConversionsForSite("Lead", {
      email: parsed.email,
      phone: parsed.phone,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
