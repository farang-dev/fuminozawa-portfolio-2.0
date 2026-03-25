import { getBlogPosts } from '@/lib/prismic-blog';
import HomeClient from '../../HomeClient';
import type { Metadata } from 'next';
import { generateWebsiteJSONLD, generateSEOMetadata, generateBreadcrumbJSONLD } from '@/lib/seo';
import { getAlternateUrls } from '@/lib/locales';

export async function generateMetadata(): Promise<Metadata> {
    const alternateUrls = getAlternateUrls('/links');

    return generateSEOMetadata({
        title: "リンク・お問い合わせ | 野澤眞史",
        description: "SNSアカウントやお問い合わせ用メールフォームなど、野澤眞史への連絡先一覧。デジタルマーケティングやWeb開発のご相談はこちらから。",
        canonical: 'https://fuminozawa-info.site/ja/links',
        locale: 'ja-jp',
        alternateUrls,
    });
}

export default async function LinksPageJa() {
    const posts = await getBlogPosts('ja-jp');
    const websiteJsonLd = generateWebsiteJSONLD({
        name: '野澤眞史 | リンク集',
        locale: 'ja-jp'
    });

    const breadcrumbJsonLd = generateBreadcrumbJSONLD([
        { name: "ホーム", item: "https://fuminozawa-info.site/ja" },
        { name: "リンク", item: "https://fuminozawa-info.site/ja/links" }
    ]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <HomeClient initialWritings={posts} initialLocale="ja" initialTab="links" />
        </>
    );
}
