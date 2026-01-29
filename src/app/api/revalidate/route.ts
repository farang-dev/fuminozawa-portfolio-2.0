import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        // Log the body for debugging but don't fail if it's not valid JSON
        try {
            const body = await request.json();
            console.log('[Revalidate] Webhook received:', body);
        } catch (e) {
            console.log('[Revalidate] No valid JSON body received, proceeding with revalidation anyway.');
        }

        revalidateTag('prismic');
        return NextResponse.json({ revalidated: true, now: Date.now() });
    } catch (err) {
        console.error('[Revalidate] Unexpected error:', err);
        return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
    }
}
