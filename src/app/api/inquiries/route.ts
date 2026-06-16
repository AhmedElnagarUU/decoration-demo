import { data } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const inquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
  source: z.enum(["contact", "newsletter"]).optional(),
});

export async function GET() {
  const inquiries = await data.getInquiries();
  return NextResponse.json({ inquiries });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = inquirySchema.parse(body);
    const inquiry = await data.createInquiry(parsed);
    return NextResponse.json({ inquiry }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create inquiry" }, { status: 500 });
  }
}
