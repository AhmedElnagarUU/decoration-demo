import { IS_DEMO } from "@/lib/config";
import { getPresignedUploadUrl } from "@/lib/s3/upload";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const uploadSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
  slug: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename, contentType, slug } = uploadSchema.parse(body);

    if (IS_DEMO) {
      return NextResponse.json({
        demo: true,
        message: "In demo mode, upload images directly as base64 in the form.",
      });
    }

    const result = await getPresignedUploadUrl(filename, contentType, slug);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
