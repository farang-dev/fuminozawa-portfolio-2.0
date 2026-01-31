import { NextResponse } from 'next/server';

interface InstagramMedia {
  id: string;
  caption: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

interface InstagramResponse {
  data: InstagramMedia[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next: string;
  };
}

export async function GET() {
  try {
    // Instagram Graph API access token
    const accessToken = 'IGAAPjGZANahIxBZAGFfNnA5UndXRDdXZAU41MXdaeDRjT1Vac3pzNk1hMXA0NFlxNmNTS1FjMGZAMV1lsYzNYN2x1LTQ1bFRFdkRfWlRob0ZAMOFhBSzBPTThUS2tfbXEwRmpxRndOdkFOYk1jZAk5WQ0E5elFkUDVJSVhITW41dy1VYwZDZD';

    // Fields to request from the Instagram Graph API
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';

    // Set a higher limit to get more images (maximum allowed by Instagram API is 100)
    const limit = 100;

    // Instagram Graph API endpoint with limit parameter
    const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`;

    // Function to fetch Instagram media with pagination support
    async function fetchAllMedia() {
      let allMedia: InstagramMedia[] = [];
      let nextUrl = url;
      let pageCount = 0;
      const MAX_PAGES = 5; // Limit to 5 pages to avoid excessive API calls

      while (nextUrl && pageCount < MAX_PAGES) {
        const response = await fetch(nextUrl);

        if (!response.ok) {
          throw new Error(`Instagram API responded with status: ${response.status}`);
        }

        const data: InstagramResponse = await response.json();

        // Filter out videos and only return images
        const imagesOnly = data.data.filter(item =>
          item.media_type === 'IMAGE' ||
          (item.media_type === 'CAROUSEL_ALBUM' && item.media_url)
        );

        allMedia = [...allMedia, ...imagesOnly];

        // Check if there's a next page
        const nextPageUrl = data.paging?.next;
        nextUrl = nextPageUrl ? nextPageUrl : '';

        // If there's no next page URL, break the loop
        if (!nextPageUrl) {
          break;
        }

        pageCount++;
      }

      return allMedia;
    }

    const allMedia = await fetchAllMedia();

    return NextResponse.json(allMedia);
  } catch (error) {
    console.error('Error fetching Instagram media:', error);
    return NextResponse.json({ error: 'Failed to fetch Instagram media' }, { status: 500 });
  }
}