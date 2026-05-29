import { getBlogPosts } from '@/lib/prismic-blog';
import HomeClient from '../../HomeClient';
import type { Metadata } from 'next';
import { generateWebsiteJSONLD, generateSEOMetadata, generateCollectionJSONLD, generateBreadcrumbJSONLD } from '@/lib/seo';
import { getAlternateUrls } from '@/lib/locales';

export async function generateMetadata(): Promise<Metadata> {
    const alternateUrls = getAlternateUrls('/works');

    return generateSEOMetadata({
        title: "Works | 野澤眞史",
        description: "野澤眞史のこれまでの制作実績。Webサイト構築、デジタルマーケティング施策、クリエイティブディレクションなどのプロジェクトを紹介します。",
        canonical: 'https://fumi-nozawa.space/ja/works',
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

    const collectionJsonLd = generateCollectionJSONLD({
        name: '制作実績ポートフォリオ | 野澤眞史',
        description: 'Webサイト構築、デジタルマーケティング、クリエイティブディレクションなど、野澤眞史のプロジェクト実績一覧。',
        url: 'https://fumi-nozawa.space/ja/works',
        locale: 'ja-jp'
    });

    const breadcrumbJsonLd = generateBreadcrumbJSONLD([
        { name: "ホーム", item: "https://fumi-nozawa.space/ja" },
        { name: "制作実績", item: "https://fumi-nozawa.space/ja/works" }
    ]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <HomeClient initialWritings={posts} initialLocale="ja" initialTab="works" />
        </>
    );
}
