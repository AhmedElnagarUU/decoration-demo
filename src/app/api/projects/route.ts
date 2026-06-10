import { data } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createSchema = z.object({
  title: z.object({ en: z.string().min(1), ar: z.string().min(1) }),
  slug: z.string().min(1),
  description: z.object({ en: z.string(), ar: z.string() }),
  category: z.enum([
    "Living Room",
    "Kitchen",
    "Bedroom",
    "Office",
    "Full Villa",
    "Other",
  ]),
  location: z.string().min(1),
  year: z.number(),
  area: z.number(),
  status: z.enum(["draft", "published"]),
  coverImage: z.string().min(1),
  gallery: z.array(z.string()),
  tags: z.array(z.string()),
});

export async function GET(request: NextRequest) {
  const publishedOnly = request.nextUrl.searchParams.get("published") === "true";
  const projects = await data.getProjects(publishedOnly);
  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createSchema.parse(body);
    const project = await data.createProject(parsed);
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
