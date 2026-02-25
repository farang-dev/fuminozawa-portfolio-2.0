import { NextResponse } from 'next/server';
import type { InstagramMedia, InstagramChildMedia } from '@/lib/instagram';

interface RawInstagramMedia {
  id: string;
  caption?: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

interface InstagramResponse {
  data: RawInstagramMedia[];
  paging?: {
    cursors: { before: string; after: string };
    next: string;
  };
}

const ACCESS_TOKEN = 'IGAAPjGZANahIxBZAGFfNnA5UndXRDdXZAU41MXdaeDRjT1Vac3pzNk1hMXA0NFlxNmNTS1FjMGZAMV1lsYzNYN2x1LTQ1bFRFdkRfWlRob0ZAMOFhBSzBPTThUS2tfbXEwRmpxRndOdkFOYk1jZAk5WQ0E5elFkUDVJSVhITW41dy1VYwZDZD';
const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';

async function fetchCarouselChildren(albumId: string): Promise<InstagramChildMedia[]> {
  try {
    const url = `https://graph.instagram.com/${albumId}/children?fields=id,media_url,media_type&access_token=${ACCESS_TOKEN}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data ?? []).filter((c: InstagramChildMedia) => c.media_type === 'IMAGE');
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    // Fetch all posts with pagination (up to 5 pages × 100)
    let allMedia: RawInstagramMedia[] = [];
    let nextUrl: string = `https://graph.instagram.com/me/media?fields=${FIELDS}&limit=100&access_token=${ACCESS_TOKEN}`;
    let pageCount = 0;

    while (nextUrl && pageCount < 5) {
      const res = await fetch(nextUrl);
      if (!res.ok) throw new Error(`Instagram API error: ${res.status}`);
      const data: InstagramResponse = await res.json();

      // Keep images and carousels only
      const filtered = data.data.filter(
        (item) => item.media_type === 'IMAGE' || item.media_type === 'CAROUSEL_ALBUM'
      );
      allMedia = [...allMedia, ...filtered];

      nextUrl = data.paging?.next ?? '';
      pageCount++;
    }

    // Fetch children for all carousel albums in parallel
    const enriched: InstagramMedia[] = await Promise.all(
      allMedia.map(async (item): Promise<InstagramMedia> => {
        if (item.media_type === 'CAROUSEL_ALBUM') {
          const children = await fetchCarouselChildren(item.id);
          return {
            ...item,
            caption: item.caption ?? '',
            children,
          };
        }
        return { ...item, caption: item.caption ?? '' };
      })
    );

    return NextResponse.json(enriched);
  } catch (error) {
    console.error('Error fetching Instagram media:', error);
    return NextResponse.json({ error: 'Failed to fetch Instagram media' }, { status: 500 });
  }
}