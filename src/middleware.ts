import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth(req => {
  if (!req.auth && req.nextUrl.pathname !== "/sign-in") {
    const signInUrl = new URL("/sign-in", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    "/apply/:path*",
    "/match/:path*",
    "/cover-letter/:path*",
    "/jobs/:path*",
  ],
};
