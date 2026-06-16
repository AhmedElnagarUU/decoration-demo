import { data } from "@/lib/data";
import { revalidateContentPaths } from "@/lib/revalidate-content";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["new", "read", "archived"]).optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.parse(body);
    const inquiry = await data.updateInquiry(id, parsed);
    if (!inquiry) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    revalidateContentPaths();
    return NextResponse.json({ inquiry });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const success = await data.deleteInquiry(id);
  if (!success) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  revalidateContentPaths();
  return NextResponse.json({ success: true });
}
