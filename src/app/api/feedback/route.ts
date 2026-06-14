import { getRequestSession } from "@/lib/auth/get-request-session";
import { sendFeedbackEmail } from "@/lib/email/send-feedback-email";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const feedbackSchema = z.object({
  message: z.string().trim().min(1, "Message is required").max(5000),
  page: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getRequestSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = feedbackSchema.parse(body);

    await sendFeedbackEmail({
      message: parsed.message,
      page: parsed.page,
      userEmail: session.user.email,
      userName: session.user.name,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Failed to send feedback:", error);
    return NextResponse.json({ error: "Failed to send feedback" }, { status: 500 });
  }
}
