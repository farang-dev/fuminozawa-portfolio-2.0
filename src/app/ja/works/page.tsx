import { getBlogPosts } from '@/lib/prismic-blog';
import HomeClient from '../../HomeClient';
import type { Metadata } from 'next';
import { generateWebsiteJSONLD, generateSEOMetadata } from '@/lib/seo';
import { getAlternateUrls } from '@/lib/locales';

export async function generateMetadata(): Promise<Metadata> {
    const alternateUrls = getAlternateUrls('/works');

    return generateSEOMetadata({
        title: "Works | 野澤眞史",
        description: "野澤眞史のこれまでの制作実績。Webサイト構築、デジタルマーケティング施策、クリエイティブディレクションなどのプロジェクトを紹介します。",
        canonical: 'https://fuminozawa-info.site/ja/works',
        locale: 'ja-jp',
        alternateUrls,
    });
}

export default async function WorksPageJa() {
    const posts = await getBlogPosts('ja-jp');
    const websiteJsonLd = generateWebsiteJSONLD({
        name: '野澤眞史 | 制作実績',
        locale: 'ja-jp'
    });

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
            />
            <HomeClient initialWritings={posts} initialLocale="ja" initialTab="works" />
        </>
    );
}
