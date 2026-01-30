import { revalidateTag, revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Prismic Webhook handler for cache revalidation.
 * Called when content is published/updated in Prismic.
 */
export async function POST(request: NextRequest) {
    try {
        const timestamp = new Date().toISOString();
        console.log(`[Revalidate] [${timestamp}] Webhook received`);

        // Log the body for debugging but don't fail if it's not valid JSON
        try {
            const body = await request.json();
            console.log(`[Revalidate] [${timestamp}] Body:`, JSON.stringify(body).slice(0, 500));
        } catch (e) {
            console.log(`[Revalidate] [${timestamp}] No valid JSON body received, proceeding with fallback revalidation.`);
        }

        // 1. Revalidate data cache via tags
        // @ts-ignore - Next.js 16 revalidateTag expects a second argument 'profile' in some environments
        revalidateTag('prismic');
        console.log(`[Revalidate] [${timestamp}] Tag "prismic" invalidated.`);

        // 2. Revalidate key listing pages to ensure they show new content
        revalidatePath('/blog', 'page');
        revalidatePath('/ja/blog', 'page');
        console.log(`[Revalidate] [${timestamp}] Blog listing paths invalidated.`);

        // 3. Revalidate everything to be 100% sure the Page Cache (ISR) is updated
        // This is safe and ensures no 404s for new posts
        revalidatePath('/', 'layout');
        console.log(`[Revalidate] [${timestamp}] Full layout revalidation triggered.`);

        return NextResponse.json({
            revalidated: true,
            now: Date.now(),
            message: 'All caches cleared successfully'
        });
    } catch (err) {
        console.error('[Revalidate] Unexpected error during revalidation:', err);
        return NextResponse.json({
            message: 'Error during revalidation process',
            error: err instanceof Error ? err.message : String(err)
        }, { status: 500 });
    }
}

/**
 * GET handler to allow manual testing and prevent 405 errors if accessed via browser.
 */
export async function GET() {
    return NextResponse.json({
        status: 'active',
        message: 'Revalidation endpoint is ready. Use POST to trigger a cache refresh.',
        timestamp: new Date().toISOString()
    });
}
