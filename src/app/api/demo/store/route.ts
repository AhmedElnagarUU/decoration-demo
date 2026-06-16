import { IS_DEMO } from "@/lib/config";
import { NextResponse } from "next/server";

/** Demo content is stored in the browser only (localStorage), not on the server. */
export async function GET() {
  if (!IS_DEMO) {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  return NextResponse.json(
    { error: "Demo data is stored in your browser only." },
    { status: 404 },
  );
}

export async function POST() {
  if (!IS_DEMO) {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  return NextResponse.json(
    { error: "Demo data is stored in your browser only." },
    { status: 404 },
  );
}
