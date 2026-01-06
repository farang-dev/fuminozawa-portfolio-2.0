import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/notion';
import { generateSEOMetadata, generateArticleJSONLD } from '@/lib/seo';
import { BlockObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedPosts from '@/components/RelatedPosts';
import { slugify } from '@/lib/utils';

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  let post;
  try {
    post = await getBlogPostBySlug(slug);
  } catch (error) {
    return generateSEOMetadata({
      title: 'Post Not Found | Fumi Nozawa',
      description: 'The requested blog post could not be found.',
      noindex: true,
    });
  }

  if (!post) {
    return generateSEOMetadata({
      title: 'Post Not Found | Fumi Nozawa',
      description: 'The requested blog post could not be found.',
      noindex: true,
    });
  }

  const description = post.description || `Read ${post.title} on Fumi Nozawa's portfolio.`;
  const url = `https://fuminozawa-info.site/blog/${post.slug}`;

  return generateSEOMetadata({
    title: `${post.title} | Fumi Nozawa`,
    description,
    canonical: url,
    ogType: 'article',
    publishedTime: post.publishedDate,
    modifiedTime: post.publishedDate,
  });
}

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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post;
  try {
    post = await getBlogPostBySlug(slug);
  } catch (error) {
    notFound();
  }

  if (!post) {
    notFound();
  }

  // Generate JSON-LD structured data for the article
  const jsonLd = generateArticleJSONLD({
    title: post.title,
    description: post.description || `Read ${post.title} on Fumi Nozawa's portfolio.`,
    url: `https://fuminozawa-info.site/blog/${post.slug}`,
    datePublished: post.publishedDate,
    dateModified: post.publishedDate,
  });

  const allPosts = await getBlogPosts();

  // Generate Table of Contents from headings
  const headings = post.content
    ?.filter(block => ['heading_1', 'heading_2', 'heading_3'].includes(block.type))
    .map(block => {
      const type = block.type as 'heading_1' | 'heading_2' | 'heading_3';
      const text = (block as any)[type].rich_text.map((t: any) => t.plain_text).join('');
      return { text, level: parseInt(type.split('_')[1]) };
    });

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-full sm:max-w-3xl mx-auto px-3 sm:px-6 py-10 sm:py-16">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: post.title, href: post.slug, active: true },
            ]}
          />

          {/* Article */}
          <article className="bg-white shadow-sm rounded-2xl p-6 sm:p-10 border border-gray-100">
            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
                {post.title}
              </h1>

              <div className="flex items-center text-gray-500 text-sm space-x-4 mb-8">
                {post.publishedDate && (
                  <time dateTime={post.publishedDate} className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-semibold">
                    {new Date(post.publishedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                )}
                <span className="text-gray-300">|</span>
                <span className="text-gray-700 font-medium">Fumi Nozawa</span>
              </div>

              {post.description && (
                <p className="text-gray-600 text-xl leading-relaxed font-light italic border-l-4 border-blue-200 pl-6 my-8">
                  {post.description}
                </p>
              )}
            </header>

            {/* Table of Contents */}
            {headings && headings.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-6 mb-10 border border-gray-100">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Table of Contents</h2>
                <ul className="space-y-2">
                  {headings.map((heading, i) => (
                    <li key={i} style={{ paddingLeft: `${(heading.level - 1) * 1.5}rem` }}>
                      <a href={`#${slugify(heading.text)}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg prose-blue max-w-none">
              {post.content?.map((block) => (
                <div key={block.id} id={['heading_1', 'heading_2', 'heading_3'].includes(block.type) ? slugify((block as any)[block.type].rich_text.map((t: any) => t.plain_text).join('')) : undefined}>
                  {renderBlock(block)}
                </div>
              ))}
            </div>

            {/* Related Posts */}
            <RelatedPosts currentPostId={post.id} posts={allPosts} />
          </article>

          {/* Footer Navigation */}
          <div className="mt-12 flex items-center justify-between px-2">
            <Link href="/blog" className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-bold flex items-center">
              <span className="mr-2">←</span> Back to All Articles
            </Link>
            <div className="flex space-x-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://fuminozawa-info.site/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                title="Share on X"
              >
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://fuminozawa-info.site/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-700 transition-colors"
                title="Share on LinkedIn"
              >
                <i className="fab fa-linkedin text-xl"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}