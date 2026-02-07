import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getBlogPostByUid, getAllBlogPostUids, getAlternateLocalePosts, getBlogPosts } from '@/lib/prismic-blog';
import { generateSEOMetadata, generateArticleJSONLD } from '@/lib/seo';
import { getAlternateUrls } from '@/lib/locales';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedPosts from '@/components/RelatedPosts';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import PrismicContent from '@/components/PrismicContent';
import ProfileSnippet from '@/components/ProfileSnippet';
import SocialShare from '@/components/SocialShare';

// Generate static params for all blog posts
export async function generateStaticParams() {
  const allPosts = await getAllBlogPostUids();
  return allPosts
    .filter(p => p.locale === 'en-us')
    .map((post) => ({
      slug: post.uid,
    }));
}

import { redirect } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostByUid(slug, 'en-us');

  if (!post) {
    // Check if it exists in Japanese to avoid returning bad metadata if we're about to redirect
    const jaPost = await getBlogPostByUid(slug, 'ja-jp');
    if (jaPost) {
      return generateSEOMetadata({
        title: jaPost.title,
        description: jaPost.description || '',
        noindex: true, // Don't index the "wrong" language URL
        locale: 'ja-jp',
      });
    }

    return generateSEOMetadata({
      title: 'Post Not Found | Fumi Nozawa',
      description: 'The requested blog post could not be found.',
      noindex: true,
      locale: 'en-us',
    });
  }

  // Ensure description is at least 100 characters for LinkedIn/SEO
  let description = post.description || `Read "${post.title}" on Fumi Nozawa's portfolio. Deep dive into web engineering, digital marketing, and the future of technology curated by Fumi Nozawa.`;

  if (description.length < 100) {
    description = `${description} Explore more insights on web development and digital marketing strategy by Fumi Nozawa.`;
  }

  const url = `https://fuminozawa-info.site/blog/${post.slug}`;
  const alternateUrls = getAlternateUrls(`blog/${post.slug}`);

  return generateSEOMetadata({
    title: `${post.title} | Digital Marketer & Developer | Fumi Nozawa`,
    description,
    canonical: url,
    ogType: 'article',
    publishedTime: post.publishedDate,
    modifiedTime: post.updatedDate,
    locale: 'en-us',
    alternateUrls,
    ogImage: post.featuredImage?.url,
    tags: post.tags,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostByUid(slug, 'en-us');

  if (!post) {
    // Check if the post exists in Japanese
    const jaPost = await getBlogPostByUid(slug, 'ja-jp');
    if (jaPost) {
      redirect(`/ja/blog/${slug}`);
    }
    notFound();
  }

  // Ensure description is at least 100 characters for JSON-LD
  let description = post.description || `Read "${post.title}" on Fumi Nozawa's portfolio. Deep dive into web engineering, digital marketing, and the future of technology curated by Fumi Nozawa.`;
  if (description.length < 100) {
    description = `${description} Explore more insights on web development and digital marketing strategy by Fumi Nozawa.`;
  }

  // Get all posts for related posts section
  const allPosts = await getBlogPosts('en-us');

  // Get alternate locale posts to show available languages
  const alternatePosts = await getAlternateLocalePosts(slug, 'en-us');
  const availableLocales = Object.entries(alternatePosts)
    .filter(([_, p]) => p !== null)
    .map(([locale]) => locale as any);

  // Generate JSON-LD structured data
  const jsonLd = generateArticleJSONLD({
    title: post.title,
    description: description,
    url: `https://fuminozawa-info.site/blog/${post.slug}`,
    datePublished: post.publishedDate,
    dateModified: post.updatedDate,
    locale: 'en-us',
  });

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          {/* Breadcrumbs & Language Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Blog', href: '/blog' },
                { label: post.title, href: post.slug, active: true },
              ]}
            />
            <LanguageSwitcher availableLocales={availableLocales} />
          </div>

          {/* Article */}
          <article className="bg-white shadow-lg rounded-3xl overflow-hidden border border-gray-100">
            {/* Featured Image */}
            {post.featuredImage && (
              <div className="relative w-full h-64 sm:h-96">
                <Image
                  src={post.featuredImage.url}
                  alt={post.featuredImage.alt}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="p-6 sm:p-12">
              {/* Article Header */}
              <header className="mb-10">
                <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mb-8">
                  {post.publishedDate && (
                    <time
                      dateTime={post.publishedDate}
                      className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold"
                    >
                      {new Date(post.publishedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  )}

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <span className="text-gray-300">|</span>
                  <Link
                    href="/?tab=services&lang=en"
                    className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
                  >
                    Fumi Nozawa
                  </Link>
                </div>

                {post.description && (
                  <p className="text-gray-600 text-xl leading-relaxed font-light italic border-l-4 border-blue-200 pl-6 my-8">
                    {post.description}
                  </p>
                )}
              </header>

              {/* Article Content */}
              <PrismicContent field={post.content} />

              {/* Social Share */}
              <SocialShare url={`https://fuminozawa-info.site/blog/${post.slug}`} title={post.title} locale="en" />

              {/* Profile Snippet */}
              <ProfileSnippet locale="en" />

              {/* Related Posts */}
              <RelatedPosts currentPostId={post.id} posts={allPosts} locale="en" />
            </div>
          </article>

          {/* Footer Navigation */}
          <div className="mt-12 flex items-center justify-between px-2">
            <Link
              href="/blog"
              className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-bold flex items-center group"
            >
              <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
              Back to All Articles
            </Link>

            <div className="flex space-x-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://fuminozawa-info.site/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-gray-100"
                title="Share on X"
                aria-label="Share on X"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://fuminozawa-info.site/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-700 transition-colors p-2 rounded-lg hover:bg-gray-100"
                title="Share on LinkedIn"
                aria-label="Share on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}