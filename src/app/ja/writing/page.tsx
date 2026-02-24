import { getBlogPosts } from '@/lib/prismic-blog';
import HomeClient from '../../HomeClient';
import type { Metadata } from 'next';
import { generateWebsiteJSONLD, generateSEOMetadata } from '@/lib/seo';
import { getAlternateUrls } from '@/lib/locales';

export async function generateMetadata(): Promise<Metadata> {
    const alternateUrls = getAlternateUrls('/writing');

    return generateSEOMetadata({
        title: "ブログ・考察 | 野澤眞史",
        description: "Web開発・戦略の視点から、Web体験、エンジニアリング、生成AI、SEO/GEO、SNS、マーケティングの最新トレンドまで、テクノロジーとデジタル体験の交差点を考察。",
        canonical: 'https://fuminozawa-info.site/ja/writing',
        locale: 'ja-jp',
        alternateUrls,
    });
}

export default async function WritingPageJa() {
    const posts = await getBlogPosts('ja-jp', { excludeAiNews: true });
    const websiteJsonLd = generateWebsiteJSONLD({
        name: '野澤眞史 | 考察ブログ',
        locale: 'ja-jp'
    });

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
            />
            <HomeClient initialWritings={posts} initialLocale="ja" initialTab="writing" />
        </>
    );
}
