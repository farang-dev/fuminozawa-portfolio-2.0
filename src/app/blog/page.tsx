import Link from 'next/link';
import type { Metadata } from 'next';
import { getBlogPosts } from '@/lib/prismic-blog';
import { generateSEOMetadata } from '@/lib/seo';
import { getAlternateUrls } from '@/lib/locales';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import BlogList from '@/components/BlogList';

export async function generateMetadata(): Promise<Metadata> {
  const alternateUrls = getAlternateUrls('blog');

  return generateSEOMetadata({
    title: 'Blog - Digital Marketing & Web Engineering Insights | Fumi Nozawa',
    description: 'Insights into the intersection of technology and digital experience—from development and strategy to AI, SEO, and marketing trends. Fumi Nozawa\'s official blog.',
    canonical: 'https://fuminozawa-info.site/blog',
    locale: 'en-us',
    alternateUrls,
  });
}

export default async function BlogPage() {
  const posts = await getBlogPosts('en-us', { excludeAiNews: true });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-all font-bold group mb-6"
            >
              <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
              Back to Home
            </Link>

            <h1 className="text-4xl sm:text-6xl font-black text-gray-900 mb-4 tracking-tight">
              Journal <span className="text-blue-600">.</span>
            </h1>
            <p className="text-xl text-gray-600 font-light max-w-2xl">
              Insights into the intersection of technology and digital experience <br /> - from web development and strategy to AI, SEO, and marketing trends.
            </p>
          </div>

          <LanguageSwitcher className="sm:self-start" />
        </div>

        {/* Blog Grid with Infinite Scroll */}
        {posts.length > 0 ? (
          <BlogList posts={posts} locale="en" />
        ) : (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm border border-dashed border-gray-300 rounded-3xl">
            <p className="text-gray-500 text-lg">No articles found yet.</p>
            <p className="text-gray-400 text-sm mt-2">Check back soon for new content!</p>
          </div>
        )}
      </div>
    </div>
  );
}