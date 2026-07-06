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

const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';

async function refreshAccessToken(token: string): Promise<string | null> {
  try {
    const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Token refresh failed: ${res.status}`);
      return null;
    }
    const data = await res.json();
    return data.access_token ?? null;
  } catch (err) {
    console.warn('Token refresh error:', err);
    return null;
  }
}

async function fetchCarouselChildren(albumId: string, accessToken: string): Promise<InstagramChildMedia[]> {
  try {
    const url = `https://graph.instagram.com/${albumId}/children?fields=id,media_url,media_type&access_token=${accessToken}`;
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
    const baseToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!baseToken) {
      return NextResponse.json({ error: 'Instagram access token not configured' }, { status: 500 });
    }

    // トークンをリフレッシュして寿命を延ばす（有効期限内なら＋60日）
    const refreshedToken = await refreshAccessToken(baseToken);
    const accessToken = refreshedToken ?? baseToken;

    // Fetch all posts with pagination (up to 5 pages × 100)
    let allMedia: RawInstagramMedia[] = [];
    let nextUrl: string = `https://graph.instagram.com/me/media?fields=${FIELDS}&limit=100&access_token=${accessToken}`;
    let pageCount = 0;

    while (nextUrl && pageCount < 5) {
      const res = await fetch(nextUrl);
      if (!res.ok) throw new Error(`Instagram API error: ${res.status}`);
      const data: InstagramResponse = await res.json();

      const filtered = data.data.filter(
        (item) => item.media_type === 'IMAGE' || item.media_type === 'CAROUSEL_ALBUM'
      );
      allMedia = [...allMedia, ...filtered];

      nextUrl = data.paging?.next ?? '';
      pageCount++;
    }

    const enriched: InstagramMedia[] = await Promise.all(
      allMedia.map(async (item): Promise<InstagramMedia> => {
        if (item.media_type === 'CAROUSEL_ALBUM') {
          const children = await fetchCarouselChildren(item.id, accessToken);
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