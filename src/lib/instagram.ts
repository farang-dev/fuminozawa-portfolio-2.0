// Instagram API client for fetching media from Instagram Graph API

export interface InstagramChildMedia {
  id: string;
  media_url: string;
  media_type: string;
}

export interface InstagramMedia {
  id: string;
  caption: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  children?: InstagramChildMedia[];
}

/**
 * Fetches Instagram media from the API
 * @returns Promise<InstagramMedia[]> Array of Instagram media objects
 */
export async function getInstagramMedia(): Promise<InstagramMedia[]> {
  try {
    const response = await fetch('/api/instagram');

    if (!response.ok) {
      console.error(`Instagram API responded with status: ${response.status}`);
      return []; // Return empty array instead of throwing
    }

    const data: InstagramMedia[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Instagram media:', error);
    return []; // Return empty array on error
  }
}