import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';

  // Exclude static assets from middleware processing
//   if (url.pathname.startsWith('/_next') || url.pathname.startsWith('/static')) {
//     return NextResponse.next();
//   }

//   // Exclude the "/not-allowed" page from middleware processing
//   if (url.pathname.startsWith('/not-allowed')) {
//     return NextResponse.next();
//   }

//   // Check if the User-Agent contains "iPhone"
//   if (!/iPhone/i.test(userAgent)) {
//     // Redirect non-iPhone users to the "/not-allowed" page
//     return NextResponse.redirect(new URL('/not-allowed', url));
//   }

//   // Allow iPhone users to proceed
//   return NextResponse.next();
}

export const config = {
  matcher: '/:path*', // Apply this middleware to all paths except static assets
};
