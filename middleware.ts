import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const userAgent = request.headers.get('user-agent') || '';
    console.log(userAgent);


    // Exclude the "/not-allowed" page from middleware processing
    if (url.pathname.startsWith('/non-mobile')) {
        return NextResponse.next();
    }

    // Check if the User-Agent contains "iPhone"
    if (!/iPhone/i.test(userAgent)) {
        // Redirect non-iPhone users to the "/not-allowed" page
        return NextResponse.redirect(new URL('/non-mobile', url));
    }

    // Allow iPhone users to proceed
    return NextResponse.next();
}

export const config = {
    matcher: '/:path*', // Apply this middleware to all paths
};
