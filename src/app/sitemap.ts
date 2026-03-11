import { getBlogPosts, isAiNewsPost } from '@/lib/prismic-blog';
import { AI_NEWS_DOMAIN } from '@/lib/locales';
import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const host = headersList.get('host') || 'fuminozawa-info.site';

  const isAiDomain = host === AI_NEWS_DOMAIN || host.startsWith('ai.');
  const baseUrl = isAiDomain ? `https://${AI_NEWS_DOMAIN}` : 'https://fuminozawa-info.site';

  // Fetch all posts from both locales
  const [enPosts, jaPosts] = await Promise.all([
    getBlogPosts('en-us'),
    getBlogPosts('ja-jp'),
  ]);

  if (isAiDomain) {
    // --- AI News Subdomain Sitemap ---
    // Only include AI News posts
    const enAiPosts = enPosts.filter(post => isAiNewsPost(post.tags));
    const jaAiPosts = jaPosts.filter(post => isAiNewsPost(post.tags));

    const aiEntries = [
      ...enAiPosts.map((post) => ({
        url: `${baseUrl}/news/${post.slug}`,
        lastModified: post.publishedDate ? new Date(post.publishedDate) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      ...jaAiPosts.map((post) => ({
        url: `${baseUrl}/ja/news/${post.slug}`,
        lastModified: post.publishedDate ? new Date(post.publishedDate) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    ];

    const staticAiPages = [
      { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
      { url: `${baseUrl}/ja`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1.0 },
    ];

    return [...staticAiPages, ...aiEntries];
  } else {
    // --- Main Domain Sitemap ---
    // Only include branding posts (exclude AI News)
    const enRegularPosts = enPosts.filter(post => !isAiNewsPost(post.tags));
    const jaRegularPosts = jaPosts.filter(post => !isAiNewsPost(post.tags));

    const blogEntries = [
      ...enRegularPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.publishedDate ? new Date(post.publishedDate) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
      ...jaRegularPosts.map((post) => ({
        url: `${baseUrl}/ja/blog/${post.slug}`,
        lastModified: post.publishedDate ? new Date(post.publishedDate) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    ];

    const staticPages = [
      // Main (English)
      { url: baseUrl, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 1.0 },
      { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
      { url: `${baseUrl}/works`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
      { url: `${baseUrl}/writing`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
      { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
      { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
      { url: `${baseUrl}/links`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },

      // Japanese
      { url: `${baseUrl}/ja`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 1.0 },
      { url: `${baseUrl}/ja/services`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
      { url: `${baseUrl}/ja/works`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
      { url: `${baseUrl}/ja/writing`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
      { url: `${baseUrl}/ja/blog`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
      { url: `${baseUrl}/ja/gallery`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
      { url: `${baseUrl}/ja/links`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    ];

    return [...staticPages, ...blogEntries];
  }
}