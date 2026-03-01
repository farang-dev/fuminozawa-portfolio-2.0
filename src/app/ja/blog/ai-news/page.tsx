import Link from 'next/link';
import type { Metadata } from 'next';
import { getAiNewsPosts } from '@/lib/prismic-blog';
import { generateSEOMetadata } from '@/lib/seo';
import { getAlternateUrls } from '@/lib/locales';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AiNewsList from '@/components/AiNewsList';

export async function generateMetadata(): Promise<Metadata> {
    const alternateUrls = getAlternateUrls('blog/ai-news');

    return generateSEOMetadata({
        title: 'AIニュース - 最新AI・生成AIトレンド | Fumi Nozawa (野澤眞史)',
        description: 'AIの進化を、実務の視点で読み解く。最新のAIニュース、生成AIの動向、LLMの技術的アップデートから、マーケターや開発者がいま知るべき重要トピックを厳選して発信。',
        canonical: 'https://fuminozawa-info.site/ja/blog/ai-news',
        locale: 'ja-jp',
        alternateUrls,
    });
}

export default async function AiNewsPageJa() {
    const posts = await getAiNewsPosts('ja-jp');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8 sm:pt-16 sm:pb-12">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div>
                        <Link
                            href="/ja/blog"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-all font-bold group mb-6"
                        >
                            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
                            ブログに戻る
                        </Link>

                        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                            AIニュース <span className="text-blue-600">.</span>
                        </h1>
                        <p className="text-lg text-gray-600 font-light max-w-2xl">
                            AIの進化を、実務の視点で読み解く。最新のAIニュースから実務への応用まで、マーケターや開発者がいま知るべきトピックを厳選してお届けします。
                        </p>
                    </div>

                    <LanguageSwitcher className="sm:self-start" />
                </div>

                {/* AI News Grid */}
                {posts.length > 0 ? (
                    <AiNewsList posts={posts} locale="ja" />
                ) : (
                    <div className="text-center py-20 bg-white/50 backdrop-blur-sm border border-dashed border-gray-300 rounded-3xl">
                        <p className="text-gray-500 text-lg">まだAIニュース記事がありません。</p>
                        <p className="text-gray-400 text-sm mt-2">新しいコンテンツをお楽しみに！</p>
                    </div>
                )}
            </div>
        </div>
    );
}
