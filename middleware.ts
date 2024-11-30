import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getCookie } from 'cookies-next';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const token =getCookie('token'); // Get the token from cookies

  // Exclude static assets from middleware processing
  // if (url.pathname.startsWith('/_next') || url.pathname.startsWith('/static')) {
  //   return NextResponse.next();
  // }

  // // Exclude the "/not-allowed" page from middleware processing
  // if (url.pathname.startsWith('/not-allowed')) {
  //   return NextResponse.next();
  // }

  // // Check if the User-Agent contains "iPhone"
  // if (!/iPhone/i.test(userAgent)) {
  //   return NextResponse.redirect(new URL('/not-allowed', url));
  // }

  // Check if the user is authenticated
  // if (!token) {
  //   // Redirect the user to /register if token is not found
  //   return NextResponse.redirect(new URL('/register', url));
  // }

  // Allow the user to proceed if the token is valid
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*', // Apply this middleware to all paths except static assets
};
