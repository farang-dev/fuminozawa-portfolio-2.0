import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getBlogPosts } from '@/lib/prismic-blog';
import { generateSEOMetadata } from '@/lib/seo';
import { getAlternateUrls } from '@/lib/locales';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export async function generateMetadata(): Promise<Metadata> {
    const alternateUrls = getAlternateUrls('blog');

    return generateSEOMetadata({
        title: 'ブログ - デジタルマーケティングとWeb開発のナレッジ | Fumi Nozawa (野澤眞史)',
        description: 'Web開発・戦略の視点から、UX、エンジニアリング、生成AI、SEO、SNS、マーケティングの最新トレンドまで。テクノロジーとデジタル体験の交差点を考察する野澤眞史のブログ。',
        canonical: 'https://fuminozawa-info.site/ja/blog',
        locale: 'ja-jp',
        alternateUrls,
    });
}

export default async function BlogPageJa() {
    const posts = await getBlogPosts('ja-jp');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
                {/* Header */}
                <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-all font-bold group mb-6"
                        >
                            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
                            ホームに戻る
                        </Link>

                        <h1 className="text-4xl sm:text-6xl font-black text-gray-900 mb-4 tracking-tight">
                            ブログ <span className="text-blue-600">.</span>
                        </h1>
                        <p className="text-xl text-gray-600 font-light max-w-2xl">
                            Web開発・戦略の視点から、Web体験、エンジニアリング、生成AI、SEO/GEO、SNS、マーケティングの最新トレンドまで、テクノロジーとデジタル体験の交差点を考察。
                        </p>
                    </div>

                    <LanguageSwitcher className="sm:self-start" />
                </div>

                {/* Blog Grid */}
                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
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

                                <Link href={`/ja/blog/${post.slug}`} className="flex flex-col flex-grow p-8">
                                    <div className="flex items-center gap-3 mb-6 flex-wrap">
                                        {post.publishedDate && (
                                            <time
                                                dateTime={post.publishedDate}
                                                className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
                                            >
                                                {new Date(post.publishedDate).toLocaleDateString('ja-JP', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
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
                                        記事を読む
                                        <span className="ml-2 opacity-0 group-hover:opacity-100 transition-all">→</span>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/50 backdrop-blur-sm border border-dashed border-gray-300 rounded-3xl">
                        <p className="text-gray-500 text-lg">まだ記事がありません。</p>
                        <p className="text-gray-400 text-sm mt-2">新しいコンテンツをお楽しみに！</p>
                    </div>
                )}
            </div>
        </div>
    );
}
