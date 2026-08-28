import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { goLive } from "@/lib/site";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if ((goLive.hiddenPaths as readonly string[]).includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/program", "/mentors"],
};
