'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/prismic-blog';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface BlogListProps {
    posts: BlogPost[];
    locale: 'en' | 'ja';
}

type SortOption = 'newest' | 'oldest';

export default function BlogList({ posts, locale }: BlogListProps) {
    const [selectedCategory, setSelectedCategory] = useState(locale === 'ja' ? 'すべて' : 'All');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [displayCount, setDisplayCount] = useState(6);
    const [isLoading, setIsLoading] = useState(false);
    const observerTarget = useRef<HTMLDivElement>(null);
    const sortMenuRef = useRef<HTMLDivElement>(null);

    const categories = locale === 'ja'
        ? ['すべて', 'Web', 'Product', 'Marketing', 'SEO・GEO', 'AI']
        : ['All', 'Web', 'Product', 'Marketing', 'SEO・GEO', 'AI'];

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

    // Filter and Sort logic
    const filteredAndSortedPosts = posts
        .filter(post => {
            if (selectedCategory === 'All' || selectedCategory === 'すべて') return true;

            const cat = selectedCategory.toLowerCase();
            return post.tags?.some(tag => {
                const t = tag.toLowerCase();
                if (cat === 'web') return t.includes('web');
                if (cat === 'product') return t.includes('product') || t.includes('software');
                if (cat === 'marketing') return t.includes('marketing');
                if (cat === 'seo・geo') return t.includes('seo') || t.includes('geo');
                if (cat === 'ai') return t.includes('ai') || t.includes('llm') || t.includes('generative');
                return t === cat;
            });
        })
        .sort((a, b) => {
            const dateA = new Date(a.publishedDate || 0).getTime();
            const dateB = new Date(b.publishedDate || 0).getTime();
            return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
        });

    const displayedPosts = filteredAndSortedPosts.slice(0, displayCount);
    const hasMore = displayCount < filteredAndSortedPosts.length;

    const loadMore = useCallback(() => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
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

    // Reset display count when filter changes
    useEffect(() => {
        setDisplayCount(6);
    }, [selectedCategory, sortBy]);

    return (
        <div className="space-y-12">
            {/* Filter & Sort Bar (Sticky) */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-gray-100 -mx-4 px-4 sm:-mx-6 sm:px-6 mb-12">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between py-6 gap-6">
                    <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === category
                                    ? 'bg-gray-900 text-white shadow-lg'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
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

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedCategory + sortBy}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="contents"
                    >
                        {displayedPosts.map((post, index) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.05,
                                    ease: "easeOut"
                                }}
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
                            </motion.article>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            {displayedPosts.length === 0 && (
                <div className="text-center py-24 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">
                        {locale === 'ja' ? '選択されたカテゴリーに一致する記事はありません。' : 'No articles found in this category.'}
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

            {!hasMore && filteredAndSortedPosts.length > 6 && (
                <div className="text-center py-10 opacity-30 text-sm font-medium uppercase tracking-widest">
                    {locale === 'ja' ? 'すべての記事を表示しました' : 'End of articles'}
                </div>
            )}
        </div>
    );
}
