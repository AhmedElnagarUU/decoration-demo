import { auth } from "@/lib/auth/auth";
import { demoAuth } from "@/lib/auth/demo";
import { IS_DEMO } from "@/lib/config";
import type { NextRequest } from "next/server";

export interface RequestSessionUser {
  id: string;
  email: string;
  name: string;
}

export async function getRequestSession(
  request: NextRequest,
): Promise<{ user: RequestSessionUser } | null> {
  if (IS_DEMO) {
    const token = request.cookies.get(demoAuth.cookieName)?.value;
    if (!token) return null;

    const session = demoAuth.getSession(token);
    if (!session) return null;

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
    };
  }

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return null;

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
  };
}
