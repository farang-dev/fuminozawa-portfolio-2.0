import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('[Revalidate] Webhook received:', body);

        revalidateTag('prismic');
        return NextResponse.json({ revalidated: true, now: Date.now() });
    } catch (err) {
        console.error('[Revalidate] Error parsing body or revalidating:', err);
        return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
    }
}
