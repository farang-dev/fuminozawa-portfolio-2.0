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
    <div className="min-h-screen bg-gray-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-all font-bold group">
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
            Back to Home
          </Link>
        </div>

        <div className="mb-16 text-center sm:text-left">
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 mb-4 tracking-tight">
            Journal <span className="text-blue-600">.</span>
          </h1>
          <p className="text-xl text-gray-600 font-light max-w-2xl">
            Thoughts on software engineering, marketing, and the intersection of technology and human experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="group flex flex-col bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2">
              <Link href={`/blog/${post.slug}`} className="flex flex-col h-full p-8">
                <div className="flex items-center mb-6">
                  {post.publishedDate && (
                    <time dateTime={post.publishedDate} className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {new Date(post.publishedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </time>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-4 leading-tight">
                  {post.title}
                </h2>

                {post.description && (
                  <p className="text-gray-600 mb-8 leading-relaxed flex-grow line-clamp-3 font-light">
                    {post.description}
                  </p>
                )}

                <div className="mt-auto flex items-center text-blue-600 font-bold group-hover:gap-2 transition-all">
                  Read Article
                  <span className="ml-2 opacity-0 group-hover:opacity-100 transition-all">→</span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm border border-dashed border-gray-300 rounded-3xl">
            <p className="text-gray-500 text-lg">No pearls of wisdom found yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}