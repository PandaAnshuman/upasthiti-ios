import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCookie } from 'cookies-next';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const token = getCookie('token'); 

  // Exclude static assets from middleware processing
  if (url.pathname.startsWith('/_next') || url.pathname.startsWith('/static')) {
    return NextResponse.next();
  }


  if (url.pathname === '/not-allowed') {
    return NextResponse.next();
  }



  // Check if the User-Agent contains "iPhone"
  if (!/iPhone/i.test(userAgent)) {
    return NextResponse.redirect(new URL('/not-allowed', request.url));
  }

  // Check if the user is authenticated (token exists)
  // If no token and not on the '/auth' page, redirect to '/auth'
  if (!token && url.pathname !== '/auth') {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Allow the user to proceed if they have a valid token or are on the '/auth' page
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*', // Apply this middleware to all paths except static assets
};

