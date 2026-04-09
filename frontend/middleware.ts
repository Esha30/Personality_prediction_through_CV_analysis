import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextRequest, NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default async function middleware(request: NextRequest) {
  // Intercept /api/auth/error before NextAuth v5 beta crashes on it
  if (request.nextUrl.pathname === '/api/auth/error') {
    const error = request.nextUrl.searchParams.get('error') || 'Default';
    const redirectUrl = new URL('/auth', request.url);
    redirectUrl.searchParams.set('error', error);
    return NextResponse.redirect(redirectUrl);
  }

  return (auth as any)(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
