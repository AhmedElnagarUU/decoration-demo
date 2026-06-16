import { data } from "@/lib/data";
import { fireMetaConversionsForSite } from "@/lib/pixels/meta-conversion-api";
import { revalidateContentPaths } from "@/lib/revalidate-content";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = newsletterSchema.parse(body);

    const existing = await data.getInquiries();
    const alreadySubscribed = existing.some(
      (inquiry) =>
        inquiry.source === "newsletter" &&
        inquiry.email.toLowerCase() === parsed.email.toLowerCase() &&
        inquiry.status !== "archived",
    );

    if (alreadySubscribed) {
      return NextResponse.json(
        { error: "This email is already subscribed." },
        { status: 409 },
      );
    }

    await data.createInquiry({
      name: "Newsletter subscriber",
      email: parsed.email,
      message: "Subscribed to newsletter for latest updates.",
      source: "newsletter",
    });

    revalidateContentPaths();

    await fireMetaConversionsForSite("Lead", {
      email: parsed.email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
