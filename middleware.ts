import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Keep in sync with goLive.hiddenPaths in lib/site.ts */
const HIDDEN_PATHS = new Set(["/program", "/mentors"]);

export function middleware(request: NextRequest) {
  if (HIDDEN_PATHS.has(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", request.url), 308);
  }
}

export const config = {
  matcher: ["/program", "/mentors"],
};
