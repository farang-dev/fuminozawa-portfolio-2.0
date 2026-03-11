import { NextRequest, NextResponse } from 'next/server';
import { detectUserLocale, AI_NEWS_DOMAIN } from './src/lib/locales';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const host = request.headers.get('host');

    // Skip middleware for static files, API routes, and Next.js internals
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') // files with extensions
    ) {
        return NextResponse.next();
    }

    // 1. Subdomain Handling for AI News
    const isAiSubdomain = host === AI_NEWS_DOMAIN || (host && host.startsWith('ai.'));

    if (isAiSubdomain) {
        // 1. Root handling: Rewrite top to AI news listing
        if (pathname === '/' || pathname === '/ja') {
            const localeSuffix = pathname.startsWith('/ja') ? '/ja' : '';
            return NextResponse.rewrite(new URL(`${localeSuffix}/blog/ai-news`, request.url));
        }

        // 2. Redirect /blog/[slug] to /news/[slug] on the AI subdomain
        const blogPostRegex = /^\/(ja\/)?blog\/((?!ai-news$).+)$/;
        if (blogPostRegex.test(pathname)) {
            const newPath = pathname.replace('/blog/', '/news/');
            return NextResponse.redirect(new URL(newPath, request.url), 301);
        }

        // 3. Block non-AI-news paths on the subdomain
        // We allow /news/ patterns and the internal /blog/ai-news rewrite
        const allowedPaths = ['/blog/ai-news', '/ja/blog/ai-news', '/news/', '/ja/news/'];
        const isAllowed = allowedPaths.some(p => pathname.startsWith(p));

        if (!isAllowed) {
            return NextResponse.redirect(new URL(pathname, 'https://fuminozawa-info.site'));
        }

        return NextResponse.next();
    }

    // 2. Main Domain Handling
    // Redirect AI News patterns from main domain to subdomain with /news/ path
    if (pathname.startsWith('/blog/ai-news') || pathname.startsWith('/ja/blog/ai-news')) {
        const url = new URL(pathname, `https://${AI_NEWS_DOMAIN}`);
        return NextResponse.redirect(url, 301);
    }

    // Individual AI news posts from main domain to subdomain /news/
    // This is also handled in the BlogPostPage but doing it here is faster for SEO
    // We'll let BlogPostPage handle the logic for determining if a slug is AI news or not
    // since middleware doesn't have easy access to Prismic tags.

    // 2a. Consolidation Redirects: /writing -> /blog
    if (pathname === '/writing') {
        return NextResponse.redirect(new URL('/blog', request.url), 301);
    }
    if (pathname === '/ja/writing') {
        return NextResponse.redirect(new URL('/ja/blog', request.url), 301);
    }

    // 3. Existing Locale Handling
    const pathnameHasLocale = pathname.startsWith('/ja');

    // Only redirect on blog pages if no locale is present
    if (pathname.startsWith('/blog') && !pathnameHasLocale) {
        const acceptLanguage = request.headers.get('accept-language');
        const detectedLocale = detectUserLocale(acceptLanguage);

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
