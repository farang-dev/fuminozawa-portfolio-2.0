// Instagram API client for fetching media from Instagram Graph API

export interface InstagramMedia {
  id: string;
  caption: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

/**
 * Fetches Instagram media from the API
 * @returns Promise<InstagramMedia[]> Array of Instagram media objects
 */
export async function getInstagramMedia(): Promise<InstagramMedia[]> {
  try {
    const response = await fetch('/api/instagram');
    
    if (!response.ok) {
      throw new Error(`Instagram API responded with status: ${response.status}`);
    }
    
    const data: InstagramMedia[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Instagram media:', error);
    throw error;
  }
}