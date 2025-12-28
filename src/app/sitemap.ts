import { getBlogPosts } from '@/lib/notion';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ブログ記事を取得
  const posts = await getBlogPosts();

  // ブログ記事のサイトマップエントリを作成
  const blogEntries = posts.map((post) => ({
    url: `https://fuminozawa-info.site/blog/${post.id}`,
    lastModified: post.publishedDate ? new Date(post.publishedDate) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // 静的ページのエントリ
  const staticPages = [
    {
      url: 'https://fuminozawa-info.site',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1.0,
    },
    {
      url: 'https://fuminozawa-info.site/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: 'https://fuminozawa-info.site/gallery',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];

  return [...staticPages, ...blogEntries];
}