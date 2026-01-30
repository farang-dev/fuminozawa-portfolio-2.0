'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/prismic-blog';

interface BlogListProps {
    posts: BlogPost[];
    locale: 'en' | 'ja';
}

export default function BlogList({ posts, locale }: BlogListProps) {
    const [displayCount, setDisplayCount] = useState(6);
    const [isLoading, setIsLoading] = useState(false);
    const observerTarget = useRef<HTMLDivElement>(null);

    const displayedPosts = posts.slice(0, displayCount);
    const hasMore = displayCount < posts.length;

    const loadMore = useCallback(() => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        // Simulate a small delay for better feel, though data is already local
        setTimeout(() => {
            setDisplayCount(prev => prev + 6);
            setIsLoading(false);
        }, 400);
    }, [isLoading, hasMore]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasMore, loadMore]);

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedPosts.map((post) => (
                    <article
                        key={post.id}
                        className="group flex flex-col bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2"
                    >
                        {post.featuredImage && (
                            <div className="relative w-full h-48 overflow-hidden">
                                <Image
                                    src={post.featuredImage.url}
                                    alt={post.featuredImage.alt}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        )}

                        <Link href={`${locale === 'ja' ? '/ja/blog/' : '/blog/'}${post.slug}`} className="flex flex-col flex-grow p-8">
                            <div className="flex items-center gap-3 mb-6 flex-wrap">
                                {post.publishedDate && (
                                    <time
                                        dateTime={post.publishedDate}
                                        className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
                                    >
                                        {new Date(post.publishedDate).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </time>
                                )}

                                {post.tags && post.tags.length > 0 && (
                                    <div className="flex gap-2">
                                        {post.tags.slice(0, 2).map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
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
                                {locale === 'ja' ? '記事を読む' : 'Read Article'}
                                <span className="ml-2 opacity-0 group-hover:opacity-100 transition-all">→</span>
                            </div>
                        </Link>
                    </article>
                ))}
            </div>

            {/* Infinite Scroll Target & Loader */}
            {hasMore && (
                <div ref={observerTarget} className="flex justify-center py-10">
                    {isLoading && (
                        <div className="flex items-center gap-2 text-blue-600 font-medium">
                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span>{locale === 'ja' ? '読み込み中...' : 'Loading more...'}</span>
                        </div>
                    )}
                </div>
            )}

            {!hasMore && posts.length > 6 && (
                <div className="text-center py-10 opacity-30 text-sm font-medium uppercase tracking-widest">
                    {locale === 'ja' ? 'すべての記事を表示しました' : 'End of articles'}
                </div>
            )}
        </div>
    );
}
