import { NextResponse } from 'next/server';
import { getWorks } from '@/lib/prismic-works';
import { LocaleCode } from '@/lib/locales';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const lang = searchParams.get('lang') || 'en-us';

        // Validate lang or map if needed
        // Map 'ja' -> 'ja-jp', 'en' -> 'en-us'
        const locale: LocaleCode = lang === 'ja' || lang === 'ja-jp' ? 'ja-jp' : 'en-us';

        const works = await getWorks(locale);
        return NextResponse.json(works);
    } catch (error) {
        console.error('Error fetching works:', error);
        return NextResponse.json({ error: 'Failed to fetch works' }, { status: 500 });
    }
}
