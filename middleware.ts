import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import { NextURL } from "next/dist/server/web/next-url";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = (req.auth?.user as any)?.role;

  // Check if it's a dashboard route
  if (nextUrl.pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", nextUrl));
    }

    // Role-based access control
    if (
      nextUrl.pathname.startsWith("/dashboard/admin") &&
      userRole !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    if (
      nextUrl.pathname.startsWith("/dashboard/hotel") &&
      userRole !== "HOTEL"
    ) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    if (
      nextUrl.pathname.startsWith("/dashboard/client") &&
      userRole !== "CLIENT"
    ) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
