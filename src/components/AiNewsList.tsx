'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/prismic-blog';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import ContributionHeatmap from './ContributionHeatmap';

interface AiNewsListProps {
    posts: BlogPost[];
    locale: 'en' | 'ja';
}

type SortOption = 'newest' | 'oldest';

export default function AiNewsList({ posts, locale }: AiNewsListProps) {
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [displayCount, setDisplayCount] = useState(12);
    const [isLoading, setIsLoading] = useState(false);
    const observerTarget = useRef<HTMLDivElement>(null);
    const sortMenuRef = useRef<HTMLDivElement>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Filter posts by selected date
    const filteredPosts = posts.filter(post => {
        if (!selectedDate) return true;
        const postDate = new Date(post.publishedDate || 0).toISOString().split('T')[0];
        return postDate === selectedDate;
    });

    // Calculate contribution stats
    const contributions = useMemo(() => {
        const stats: Record<string, number> = {};
        posts.forEach(post => {
            const dateStr = new Date(post.publishedDate || 0).toISOString().split('T')[0];
            stats[dateStr] = (stats[dateStr] || 0) + 1;
        });
        return stats;
    }, [posts]);

    const categories = locale === 'ja'
        ? ['すべて', 'Web', 'Product', 'Marketing', 'SEO・GEO', 'AI', 'AIニュース']
        : ['All', 'Web', 'Product', 'Marketing', 'SEO・GEO', 'AI', 'AI News'];

    // Close sort menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sort logic
    const sortedPosts = [...filteredPosts].sort((a, b) => {
        const dateA = new Date(a.publishedDate || 0).getTime();
        const dateB = new Date(b.publishedDate || 0).getTime();
        return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    const displayedPosts = sortedPosts.slice(0, displayCount);
    const hasMore = displayCount < sortedPosts.length;

    const loadMore = useCallback(() => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        setTimeout(() => {
            setDisplayCount(prev => prev + 12);
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

    // Reset display count when sort changes
    useEffect(() => {
        setDisplayCount(12);
    }, [sortBy]);

    return (
        <div className="space-y-12">
            {/* Contribution Heatmap */}

            {/* Filter & Sort Bar (Sticky) */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-gray-100 -mx-4 px-4 sm:-mx-6 sm:px-6 mb-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between py-4 gap-6">
                    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                        {categories.map((category) => {
                            const isAiNews = category === 'AI News' || category === 'AIニュース';
                            if (isAiNews) {
                                return (
                                    <button
                                        key={category}
                                        className="px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap bg-gray-900 text-white shadow-lg flex items-center gap-2"
                                    >
                                        <span>{category}</span>
                                        <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                                    </button>
                                );
                            }
                            // Branding categories link back to the main blog
                            return (
                                <Link
                                    key={category}
                                    href={`${locale === 'ja' ? '/ja/blog' : '/blog'}?category=${category}`}
                                    className="px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                >
                                    {category}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="relative self-end md:self-center" ref={sortMenuRef}>
                        <button
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="flex items-center gap-2 text-sm font-bold text-gray-900 px-4 py-2 rounded-xl hover:bg-white transition-colors border border-gray-100 bg-gray-50/50 min-w-[140px] justify-between shadow-sm"
                        >
                            <span>{sortBy === 'newest' ? (locale === 'ja' ? '新着順' : 'Newest') : (locale === 'ja' ? '古い順' : 'Oldest')}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isSortOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-20"
                                >
                                    <button
                                        onClick={() => { setSortBy('newest'); setIsSortOpen(false); }}
                                        className={`w-full text-left px-5 py-4 text-sm font-bold hover:bg-gray-50 transition-colors ${sortBy === 'newest' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-700'}`}
                                    >
                                        {locale === 'ja' ? '最新の記事' : 'Newest First'}
                                    </button>
                                    <button
                                        onClick={() => { setSortBy('oldest'); setIsSortOpen(false); }}
                                        className={`w-full text-left px-5 py-4 text-sm font-bold hover:bg-gray-50 transition-colors ${sortBy === 'oldest' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-700'}`}
                                    >
                                        {locale === 'ja' ? '古い順' : 'Oldest First'}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Contribution Heatmap (Moved below tags) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                <ContributionHeatmap
                    contributions={contributions}
                    onDateClick={setSelectedDate}
                    selectedDate={selectedDate}
                    locale={locale}
                />
            </div>


            {/* News Bar (Total count) */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 font-medium px-2">
                    {sortedPosts.length} {locale === 'ja' ? '件のニュース' : 'articles'}
                </p>
            </div>

            {/* News List — compact, timeline-style layout */}
            <div className="space-y-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={sortBy}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                    >
                        {displayedPosts.map((post, index) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.03,
                                    ease: "easeOut"
                                }}
                            >
                                <Link
                                    href={`${locale === 'ja' ? '/ja/blog/' : '/blog/'}${post.slug}`}
                                    className="group flex gap-4 sm:gap-6 items-start bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-4 sm:p-5 hover:shadow-lg hover:shadow-blue-500/5 hover:border-blue-100 transition-all duration-300"
                                >
                                    {/* Thumbnail */}
                                    {post.featuredImage && (
                                        <div className="relative w-20 h-20 sm:w-28 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden">
                                            <Image
                                                src={post.featuredImage.url}
                                                alt={post.featuredImage.alt}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="112px"
                                            />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                            {post.publishedDate && (
                                                <time
                                                    dateTime={post.publishedDate}
                                                    className="text-xs font-semibold text-gray-400 uppercase tracking-wider"
                                                >
                                                    {new Date(post.publishedDate).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </time>
                                            )}

                                            {post.tags && post.tags.filter(t => t.toLowerCase() !== 'ai news').length > 0 && (
                                                <div className="flex gap-1.5">
                                                    {post.tags.filter(t => t.toLowerCase() !== 'ai news').slice(0, 2).map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <h2 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                                            {post.title}
                                        </h2>

                                        {post.description && (
                                            <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-1 hidden sm:block">
                                                {post.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Arrow */}
                                    <div className="flex-shrink-0 self-center text-gray-300 group-hover:text-blue-500 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            {displayedPosts.length === 0 && (
                <div className="text-center py-24 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">
                        {locale === 'ja' ? 'AIニュースが見つかりません。' : 'No AI news articles found.'}
                    </p>
                </div>
            )}

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

            {!hasMore && sortedPosts.length > 12 && (
                <div className="text-center py-10 opacity-30 text-sm font-medium uppercase tracking-widest">
                    {locale === 'ja' ? 'すべてのニュースを表示しました' : 'End of news'}
                </div>
            )}
        </div>
    );
}
