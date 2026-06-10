import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const DASHBOARD_PUBLIC = ["/dashboard/login", "/dashboard/register"];

function hasAuthSession(request: NextRequest): boolean {
  return !!(
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("demo-auth-token")?.value
  );
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const isPublic = DASHBOARD_PUBLIC.some((p) => pathname.startsWith(p));

    if (!isPublic && !hasAuthSession(request)) {
      return NextResponse.redirect(new URL("/dashboard/login", request.url));
    }

    if (isPublic && hasAuthSession(request)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
