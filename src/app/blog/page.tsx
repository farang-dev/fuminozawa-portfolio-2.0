'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/notion';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError('Error loading posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-5xl font-black text-blue-500 animate-pulse">
          F
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/" className="inline-block px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

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
                    <time className="text-blue-600 text-sm font-medium mb-2">
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