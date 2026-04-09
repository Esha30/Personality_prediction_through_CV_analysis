import { handlers } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * Custom GET handler that intercepts /api/auth/error redirects from NextAuth.
 * NextAuth v5 beta has a bug where the error page crashes with 500.
 * We catch it here and redirect to the /auth page with the error param
 * so users see a friendly error message instead of a blank server error page.
 */
async function customGET(request: NextRequest) {
  const url = new URL(request.url);
  if (url.pathname === "/api/auth/error") {
    const error = url.searchParams.get("error") || "Default";
    const redirectUrl = new URL("/auth", request.url);
    redirectUrl.searchParams.set("error", error);
    return NextResponse.redirect(redirectUrl);
  }
  return handlers.GET(request);
}

export { customGET as GET };
export const { POST } = handlers;
