import { NextRequest, NextResponse } from "next/server";

/**
 * Custom handler for NextAuth error redirects.
 * Intercepts /api/auth/error?error=... and redirects to the /auth page
 * with the same error param, displaying a user-friendly message instead
 * of the default NextAuth "Server error" page.
 */
export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get("error") || "Default";
  const redirectUrl = new URL("/auth", request.url);
  redirectUrl.searchParams.set("error", error);
  return NextResponse.redirect(redirectUrl);
}
