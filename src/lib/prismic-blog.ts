import { createClient } from '../../prismicio';
import * as prismic from '@prismicio/client';
import { LocaleCode, localeCodeToPrismicLocale } from './locales';

export interface BlogPost {
    id: string;
    uid: string;
    slug: string;
    title: string;
    publishedDate?: string;
    updatedDate?: string;
    description?: string;
    content?: any;
    locale: LocaleCode;
    tags?: string[];
    featuredImage?: {
        url: string;
        alt: string;
        dimensions: {
            width: number;
            height: number;
        };
    };
}

/**
 * Get all blog posts for a specific locale
 */
export async function getBlogPosts(locale: LocaleCode = 'en-us'): Promise<BlogPost[]> {
    const client = createClient();

    try {
        const prismicLocale = localeCodeToPrismicLocale(locale);
        console.log(`[Prismic] Fetching all posts for locale: ${prismicLocale}`);

        const posts = await client.getAllByType('blog_post', {
            lang: prismicLocale,
            orderings: [
                { field: 'my.blog_post.published_date', direction: 'desc' },
                { field: 'document.first_publication_date', direction: 'desc' },
            ],
        });

        console.log(`[Prismic] Found ${posts.length} posts for ${prismicLocale}`);

        return posts
            .filter(post => post.uid !== null)
            .map(post => ({
                id: post.id,
                uid: post.uid!,
                slug: post.uid!,
                title: prismic.asText(post.data.title) || 'Untitled',
                publishedDate: post.data.published_date || post.first_publication_date,
                updatedDate: post.last_publication_date,
                description: post.data.description || undefined,
                content: post.data.content,
                locale,
                tags: post.tags || [],
                featuredImage: post.data.featured_image?.url ? {
                    url: post.data.featured_image.url,
                    alt: post.data.featured_image.alt || '',
                    dimensions: post.data.featured_image.dimensions,
                } : undefined,
            }));
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }
}

/**
 * Get a single blog post by UID and locale
 */
export async function getBlogPostByUid(
    uid: string,
    locale: LocaleCode = 'en-us'
): Promise<BlogPost | null> {
    const client = createClient();

    try {
        const prismicLocale = localeCodeToPrismicLocale(locale);
        console.log(`[Prismic] Fetching post by UID: "${uid}" for locale: "${prismicLocale}"`);

        const post = await client.getByUID('blog_post', uid, {
            lang: prismicLocale,
        });

        console.log(`[Prismic] Successfully found post: ${post.uid}`);

        if (!post.uid) {
            throw new Error(`Post ${uid} has no UID`);
        }

        return {
            id: post.id,
            uid: post.uid,
            slug: post.uid,
            title: prismic.asText(post.data.title) || 'Untitled',
            publishedDate: post.data.published_date || post.first_publication_date,
            updatedDate: post.last_publication_date,
            description: post.data.description || undefined,
            content: post.data.content,
            locale,
            tags: post.tags || [],
            featuredImage: post.data.featured_image?.url ? {
                url: post.data.featured_image.url,
                alt: post.data.featured_image.alt || '',
                dimensions: post.data.featured_image.dimensions,
            } : undefined,
        };
    } catch (error) {
        console.error(`Error fetching blog post ${uid}:`, error);
        return null;
    }
}

/**
 * Get all UIDs for static generation
 */
export async function getAllBlogPostUids(): Promise<Array<{ uid: string; locale: LocaleCode }>> {
    const client = createClient();

    try {
        const [enPosts, jaPosts] = await Promise.all([
            client.getAllByType('blog_post', { lang: 'en-us' }),
            client.getAllByType('blog_post', { lang: 'ja-jp' }),
        ]);

        return [
            ...enPosts.filter(post => post.uid !== null).map(post => ({ uid: post.uid!, locale: 'en-us' as LocaleCode })),
            ...jaPosts.filter(post => post.uid !== null).map(post => ({ uid: post.uid!, locale: 'ja-jp' as LocaleCode })),
        ];
    } catch (error) {
        console.error('Error fetching all blog post UIDs:', error);
        return [];
    }
}

/**
 * Check if a post exists in another locale
 */
export async function getAlternateLocalePosts(
    uid: string,
    currentLocale: LocaleCode
): Promise<Record<LocaleCode, BlogPost | null>> {
    const alternateLocale: LocaleCode = currentLocale === 'en-us' ? 'ja-jp' : 'en-us';

    const [currentPost, alternatePost] = await Promise.all([
        getBlogPostByUid(uid, currentLocale),
        getBlogPostByUid(uid, alternateLocale),
    ]);

    return {
        [currentLocale]: currentPost,
        [alternateLocale]: alternatePost,
    } as Record<LocaleCode, BlogPost | null>;
}
