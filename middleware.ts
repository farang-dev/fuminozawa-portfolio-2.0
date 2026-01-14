import { NextRequest, NextResponse } from 'next/server';
import { detectUserLocale, getLocaleFromPath } from './src/lib/locales';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for static files, API routes, and Next.js internals
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') // files with extensions
    ) {
        return NextResponse.next();
    }

    // Check if the pathname already has a locale
    const pathnameHasLocale = pathname.startsWith('/ja');

    // Only redirect on blog pages if no locale is present
    if (pathname.startsWith('/blog') && !pathnameHasLocale) {
        const acceptLanguage = request.headers.get('accept-language');
        const detectedLocale = detectUserLocale(acceptLanguage);

        // If user's language is Japanese, redirect to /ja/blog
        if (detectedLocale === 'ja-jp') {
            const url = request.nextUrl.clone();
            url.pathname = `/ja${pathname}`;
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
