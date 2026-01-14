import { NextResponse } from 'next/server';
import { getBlogPosts } from '@/lib/prismic-blog';

export async function GET() {
  try {
    // Default to en-us for the homepage API
    const posts = await getBlogPosts('en-us');
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}