import { JWT } from 'google-auth-library';

const CLIENT_EMAIL = process.env.GOOGLE_INDEXING_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_INDEXING_PRIVATE_KEY?.replace(/\\n/g, '\n');

/**
 * Notifies Google that a URL has been updated or newly created.
 * 
 * @param url The full absolute URL of the page (e.g. https://fuminozawa-info.site/blog/my-post)
 */
export async function notifyGoogleIndexing(url: string) {
    if (!CLIENT_EMAIL || !PRIVATE_KEY) {
        console.warn('[Indexing API] Missing credentials, skipping...');
        return;
    }

    try {
        const client = new JWT({
            email: CLIENT_EMAIL,
            key: PRIVATE_KEY,
            scopes: ['https://www.googleapis.com/auth/indexing'],
        });

        const response = await client.request({
            url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
            method: 'POST',
            data: {
                url: url,
                type: 'URL_UPDATED',
            },
        });

        console.log(`[Indexing API] Successfully notified Google: ${url}`, response.data);
        return response.data;
    } catch (error) {
        console.error(`[Indexing API] Error notifying Google for ${url}:`, error);
        throw error;
    }
}
