import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Token is stored client-side in localStorage, which middleware can't access.
  // Route protection is handled client-side via the AuthGuard in the layout.
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/apply/:path*",
    "/match/:path*",
    "/cover-letter/:path*",
    "/jobs/:path*",
  ],
};
