import Link from 'next/link';
import type { Metadata } from 'next';
import { getBlogPosts } from '@/lib/notion';

export const metadata: Metadata = {
  title: 'Blog | Fumi Nozawa',
  description: 'Read articles and insights from Fumi Nozawa on software engineering, web development, and technology.',
  openGraph: {
    title: 'Blog | Fumi Nozawa',
    description: 'Read articles and insights from Fumi Nozawa on software engineering, web development, and technology.',
    type: 'website',
    url: 'https://fuminozawa-info.site/blog',
    siteName: 'Fumi Nozawa - Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Fumi Nozawa',
    description: 'Read articles and insights from Fumi Nozawa on software engineering, web development, and technology.',
  },
  alternates: {
    canonical: 'https://fuminozawa-info.site/blog',
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium">
              ← Back to fuminozawa Page
            </Link>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog</h1>

        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.id} className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
              <Link href={`/blog/${post.id}`} className="block group">
                <div className="flex flex-col h-full">
                  {post.publishedDate && (
                    <time dateTime={post.publishedDate} className="text-blue-600 text-sm font-medium mb-2">
                      {new Date(post.publishedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                  )}

                  <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-3">
                    {post.title}
                  </h2>

                  {post.description && (
                    <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
                      {post.description}
                    </p>
                  )}

                  <div className="mt-auto">
                    <span className="inline-flex items-center text-blue-600 text-sm font-medium">
                      Read more →
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12 bg-white shadow-sm rounded-lg">
            <p className="text-gray-500">No posts found.</p>
          </div>
        )}
      </div>
    </div>
  );
}