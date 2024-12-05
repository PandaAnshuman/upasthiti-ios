import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const token = request.cookies.get('token')?.value;

  // Exclude static assets from middleware processing
  if (url.pathname.startsWith('/_next') || url.pathname.startsWith('/static')) {
    return NextResponse.next();
  }

  // Allow '/not-allowed' without restrictions
  if (url.pathname === '/not-allowed') {
    return NextResponse.next();
  }

  // Block laptops, desktops, and iPads
  if (/Macintosh|Windows|iPad/i.test(userAgent)) {
    return NextResponse.redirect(new URL('/not-allowed', request.url));
  }

  // Redirect to '/auth' if no token and not already on '/auth'
  if (!token && url.pathname !== '/auth') {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Allow the user to proceed
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*', // Apply this middleware to all paths except static assets
};
