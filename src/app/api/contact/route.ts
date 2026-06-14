import { fireMetaConversionsForSite } from "@/lib/pixels/meta-conversion-api";
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

    // In production, send email or store in DB
    console.log("Contact form submission:", parsed);

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
