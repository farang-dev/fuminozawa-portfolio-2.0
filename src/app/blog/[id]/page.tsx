'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/notion';
import { BlockObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

function renderRichText(richText: RichTextItemResponse[]) {
  return richText.map((text, index) => {
    let element: React.ReactNode = text.plain_text;
    
    if (text.annotations.bold) {
      element = <strong key={index} className="font-semibold">{element}</strong>;
    }
    if (text.annotations.italic) {
      element = <em key={index}>{element}</em>;
    }
    if (text.annotations.code) {
      element = <code key={index} className="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono">{element}</code>;
    }
    if (text.annotations.strikethrough) {
      element = <del key={index}>{element}</del>;
    }
    if (text.annotations.underline) {
      element = <u key={index}>{element}</u>;
    }
    if (text.href) {
      element = <a key={index} href={text.href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">{element}</a>;
    }
    
    return element;
  });
}

function renderBlock(block: BlockObjectResponse) {
  switch (block.type) {
    case 'paragraph':
      const paragraphText = renderRichText(block.paragraph.rich_text);
      return paragraphText.length > 0 ? (
        <p className="text-gray-900 leading-relaxed mb-3">{paragraphText}</p>
      ) : (
        <div className="mb-3"></div>
      );
    case 'heading_1':
      return (
        <h1 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          {renderRichText(block.heading_1.rich_text)}
        </h1>
      );
    case 'heading_2':
      return (
        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
          {renderRichText(block.heading_2.rich_text)}
        </h2>
      );
    case 'heading_3':
      return (
        <h3 className="text-lg font-semibold text-gray-900 mt-5 mb-2">
          {renderRichText(block.heading_3.rich_text)}
        </h3>
      );
    case 'bulleted_list_item':
      return (
        <li className="text-gray-900 leading-relaxed mb-1 ml-6 list-disc">
          {renderRichText(block.bulleted_list_item.rich_text)}
        </li>
      );
    case 'numbered_list_item':
      return (
        <li className="text-gray-900 leading-relaxed mb-1 ml-6 list-decimal">
          {renderRichText(block.numbered_list_item.rich_text)}
        </li>
      );
    case 'image':
      const src = block.image.type === 'external' ? block.image.external.url : block.image.file.url;
      const alt = block.image.caption?.map(text => text.plain_text).join('') || '';
      return (
        <div className="my-6 flex flex-col items-center">
          <Image
            src={src}
            alt={alt}
            width={800}
            height={600}
            className="rounded border max-w-full h-auto"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          {alt && (
            <p className="text-gray-500 text-sm text-center mt-2">{alt}</p>
          )}
        </div>
      );
    case 'code':
      const language = block.code.language || 'text';
      return (
        <div className="my-4">
          <pre className="bg-gray-50 border rounded p-4 overflow-x-auto text-sm">
            <code className="text-gray-800 font-mono">
              {block.code.rich_text.map((text) => text.plain_text).join('')}
            </code>
          </pre>
          {language && String(language) !== 'text' && (
            <p className="text-gray-400 text-xs mt-1">{String(language)}</p>
          )}
        </div>
      );
    case 'quote':
      return (
        <blockquote className="border-l-3 border-gray-300 pl-4 py-2 my-4 bg-gray-50">
          <p className="text-gray-700 leading-relaxed">
            {renderRichText(block.quote.rich_text)}
          </p>
        </blockquote>
      );
    case 'divider':
      return <hr className="border-gray-200 my-6" />;
    case 'callout':
      return (
        <div className="bg-blue-50 border border-blue-200 rounded p-4 my-4">
          <div className="flex items-start">
            {block.callout.icon && (
              <span className="text-lg mr-3 mt-0.5">
                {block.callout.icon.type === 'emoji' ? block.callout.icon.emoji : '💡'}
              </span>
            )}
            <div className="text-gray-800">
              {renderRichText(block.callout.rich_text)}
            </div>
          </div>
        </div>
      );
    case 'toggle':
      return (
        <details className="border border-gray-200 rounded p-3 my-3">
          <summary className="text-gray-900 font-medium cursor-pointer hover:text-blue-600">
            {renderRichText(block.toggle.rich_text)}
          </summary>
          <div className="mt-2 text-gray-800">
            {/* Toggle content would need to be fetched separately */}
          </div>
        </details>
      );
    default:
      return null;
  }
}

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError('Error loading post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

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
          <div className="space-x-4">
            <Link href="/blog" className="text-blue-600 hover:text-blue-800 transition-colors">
              ← Back to Blog
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <div className="space-x-4">
            <Link href="/blog" className="text-blue-600 hover:text-blue-800 transition-colors">
              ← Back to Blog
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Top Navigation */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium">
              ← Back to fuminozawa Page
            </Link>
            <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium">
              ← Back to All Posts
            </Link>
          </div>
        </div>

        {/* Article */}
        <article className="bg-white shadow-sm rounded-lg p-8">
          {/* Article Header */}
          <header className="mb-12 border-b pb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center text-gray-500 text-sm space-x-4 mb-6">
              {post.publishedDate && (
                <time className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  {new Date(post.publishedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              )}
            </div>
            
            {post.description && (
              <p className="text-gray-600 text-lg leading-relaxed mt-4">
                {post.description}
              </p>
            )}
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {post.content?.map((block) => (
              <div key={block.id}>{renderBlock(block)}</div>
            ))}
          </div>
        </article>

        {/* Footer Navigation */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium">
              ← Back to fuminozawa Page
            </Link>
            <Link href="/blog" className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium">
              ← Back to All Posts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}