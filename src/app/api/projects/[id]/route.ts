import { data } from "@/lib/data";
import { deleteS3Image, extractS3Key } from "@/lib/s3/upload";
import { IS_PRODUCTION } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  title: z.object({ en: z.string(), ar: z.string() }).optional(),
  slug: z.string().optional(),
  description: z.object({ en: z.string(), ar: z.string() }).optional(),
  category: z
    .enum(["Living Room", "Kitchen", "Bedroom", "Office", "Full Villa", "Other"])
    .optional(),
  location: z.string().optional(),
  year: z.number().optional(),
  area: z.number().optional(),
  status: z.enum(["draft", "published"]).optional(),
  coverImage: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const project = await data.getProjectById(id);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ project });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.parse(body);
    const project = await data.updateProject(id, parsed);
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ project });
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
  const project = await data.getProjectById(id);

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (IS_PRODUCTION) {
    const allImages = [project.coverImage, ...project.gallery];
    for (const url of allImages) {
      const key = extractS3Key(url);
      if (key) {
        try {
          await deleteS3Image(key);
        } catch {
          // continue deletion
        }
      }
    }
  }

  await data.deleteProject(id);
  return NextResponse.json({ success: true });
}
