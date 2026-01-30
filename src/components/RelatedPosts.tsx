import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/prismic-blog';

interface RelatedPostsProps {
    currentPostId: string;
    posts: BlogPost[];
    locale: 'en' | 'ja';
}

export default function RelatedPosts({ currentPostId, posts, locale }: RelatedPostsProps) {
    const relatedPosts = posts
        .filter(post => post.id !== currentPostId)
        .slice(0, 2);

    if (relatedPosts.length === 0) return null;

    const title = locale === 'ja' ? '他の記事も読む' : 'Continue Reading';
    const baseUrl = locale === 'ja' ? '/ja/blog' : '/blog';

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <span className="w-8 h-1 bg-blue-600 rounded-full" />
                {title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map((post) => (
                    <article key={post.id} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                        <Link href={`${baseUrl}/${post.slug}`} className="flex flex-col h-full">
                            {post.featuredImage && (
                                <div className="relative aspect-[16/9] overflow-hidden">
                                    <Image
                                        src={post.featuredImage.url}
                                        alt={post.featuredImage.alt}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            )}
                            <div className="p-6 flex flex-col flex-1">
                                {post.publishedDate && (
                                    <time className="text-sm font-semibold text-blue-600 mb-3 block">
                                        {new Date(post.publishedDate).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </time>
                                )}
                                <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3 line-clamp-2 leading-snug">
                                    {post.title}
                                </h4>
                                {post.description && (
                                    <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed mb-4">
                                        {post.description}
                                    </p>
                                )}
                                <div className="mt-auto flex items-center text-sm font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                                    {locale === 'ja' ? '記事を読む' : 'Read Article'}
                                    <span className="ml-2">→</span>
                                </div>
                            </div>
                        </Link>
                    </article>
                ))}
            </div>
        </div>
    );
}
