import { getSessionCookie } from 'better-auth/cookies';
import { NextResponse, NextRequest } from 'next/server';
import { isReviewAuthBypassEnabled } from '@/lib/review-auth';

const PUBLIC_PATHS = new Set([
  '/',
  '/login',
  '/about-us',
  '/learn',
  '/blog',
  '/error',
]);

const PUBLIC_API_PREFIXES = [
  '/api/auth/',
  '/api/uploadthing',
  '/api/search',
];

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  // Preview/local review only — never production (see lib/review-auth.ts)
  if (isReviewAuthBypassEnabled()) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(req);
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
