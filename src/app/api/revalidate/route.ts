import { revalidateTag, revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { notifyGoogleIndexing } from '@/lib/google-indexing';
import { createClient } from '@/../prismicio';

export const dynamic = 'force-dynamic';

const SITE_URL = 'https://fuminozawa-info.site'; // Replace with your actual production URL

/**
 * Prismic Webhook handler for cache revalidation and Google Indexing notification.
 * Called when content is published/updated in Prismic.
 */
export async function POST(request: NextRequest) {
    try {
        const timestamp = new Date().toISOString();
        console.log(`[Revalidate] [${timestamp}] Webhook received`);

        let body: any;
        try {
            body = await request.json();
            console.log(`[Revalidate] [${timestamp}] Body:`, JSON.stringify(body).slice(0, 500));
        } catch (e) {
            console.log(`[Revalidate] [${timestamp}] No valid JSON body received, proceeding with fallback.`);
        }

        // 1. Revalidate data cache via tags
        // @ts-ignore
        revalidateTag('prismic', 'max');
        console.log(`[Revalidate] [${timestamp}] Tag "prismic" invalidated.`);

        // 2. Revalidate key listing pages
        revalidatePath('/blog', 'page');
        revalidatePath('/ja/blog', 'page');
        revalidatePath('/', 'layout');
        console.log(`[Revalidate] [${timestamp}] Paths revalidated (blog listing and full layout).`);

        // 3. Google Indexing API Notification
        let urlsToIndix: string[] = [
            `${SITE_URL}/blog`,
            `${SITE_URL}/ja/blog`,
            `${SITE_URL}/`,
        ];

        // If it's a Prismic webhook, try to find the actual documents that changed
        if (body && Array.isArray(body.documents) && body.documents.length > 0) {
            const client = createClient();
            try {
                // Fetch the documents by IDs to get their URLs
                const docs = await client.getAllByIDs(body.documents);
                for (const doc of docs) {
                    let docUrl = doc.url;

                    // Fallback: If doc.url is null (resolver mismatch), construct it manually
                    if (!docUrl && doc.type === 'blog_post' && doc.uid) {
                        const isJa = doc.lang === 'ja-jp';
                        docUrl = isJa ? `/ja/blog/${doc.uid}` : `/blog/${doc.uid}`;
                    }

                    if (docUrl) {
                        urlsToIndix.push(`${SITE_URL}${docUrl}`);
                        console.log(`[Revalidate] [${timestamp}] Resolved document URL: ${docUrl}`);
                    } else {
                        console.log(`[Revalidate] [${timestamp}] Could not resolve URL for document ID: ${doc.id}`);
                    }
                }
            } catch (err) {
                console.warn(`[Revalidate] Failed to resolve URLs for documents: ${body.documents}`, err);
            }
        }

        // Notify Google (Unique URLs only)
        const uniqueUrls = [...new Set(urlsToIndix)];
        console.log(`[Revalidate] [${timestamp}] Notifying Google Indexing for URLs:`, uniqueUrls);

        // We use Promise.allSettled so that one bad URL doesn't break the whole revalidation
        const results = await Promise.allSettled(
            uniqueUrls.map(url => notifyGoogleIndexing(url))
        );

        const successes = results.filter(r => r.status === 'fulfilled').length;
        console.log(`[Revalidate] [${timestamp}] Indexing notifications complete. Successes: ${successes}/${uniqueUrls.length}`);

        return NextResponse.json({
            revalidated: true,
            indexing_notified: successes,
            urls: uniqueUrls,
            now: Date.now(),
            message: `Cache revalidated and ${successes} URLs notified for indexing.`
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
 * GET handler for manual testing.
 */
export async function GET() {
    return NextResponse.json({
        status: 'active',
        message: 'Revalidation endpoint is ready. Use POST to trigger a cache refresh and Google Indexing notify.',
        timestamp: new Date().toISOString()
    });
}
