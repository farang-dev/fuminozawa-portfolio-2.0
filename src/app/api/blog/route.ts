import { NextResponse } from 'next/server';
import { getBlogPosts } from '@/lib/prismic-blog';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en-us';
    const excludeAiNews = searchParams.get('excludeAiNews') === 'true';

    // Validate lang or map if needed
    const locale = lang === 'ja' ? 'ja-jp' : (lang === 'ja-jp' ? 'ja-jp' : 'en-us');

    const posts = await getBlogPosts(locale as any, { excludeAiNews });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}