export interface InstagramMedia {
  id: string;
  caption: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

export interface InstagramResponse {
  data: InstagramMedia[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next: string;
  };
}

export const getInstagramMedia = async (): Promise<InstagramMedia[]> => {
  try {
    const response = await fetch('/api/instagram');
    if (!response.ok) {
      throw new Error('Failed to fetch Instagram media');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Instagram media:', error);
    throw error;
  }
};