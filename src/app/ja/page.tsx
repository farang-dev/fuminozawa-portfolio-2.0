import { getBlogPosts } from '@/lib/prismic-blog';
import HomeClient from '../HomeClient';
import type { Metadata } from 'next';
import { generateWebsiteJSONLD, generateSEOMetadata } from '@/lib/seo';
import { getAlternateUrls } from '@/lib/locales';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const params = await searchParams;
    const tab = params.tab as string | undefined;

    const tabTitles: Record<string, string> = {
        services: "提供サービス",
        works: "制作実績・プロジェクト",
        writing: "ブログ記事",
        links: "リンク・お問合せ",
    };

    const baseTitle = "Fumi Nozawa (野澤眞史) | フリーランス デジタルマーケター & Webエンジニア";
    const title = tab && tabTitles[tab] ? `${tabTitles[tab]} | ${baseTitle}` : baseTitle;
    const canonical = tab ? `https://fuminozawa-info.site/ja?tab=${tab}` : 'https://fuminozawa-info.site/ja';
    const alternateUrlPath = tab ? `?tab=${tab}` : '/';
    const alternateUrls = getAlternateUrls(alternateUrlPath);

    return generateSEOMetadata({
        title,
        description: "日本とグローバル市場の架け橋となるフリーランスのデジタルマーケター兼Webエンジニア。日本市場参入・海外展開戦略から、Web開発・AI活用まで一気通貫で支援します。",
        canonical,
        locale: 'ja-jp',
        alternateUrls,
    });
}

export default async function HomeJa() {
    const posts = await getBlogPosts('ja-jp');
    const websiteJsonLd = generateWebsiteJSONLD({
        name: '野澤眞史 | デジタルマーケター & Webエンジニア',
        locale: 'ja-jp'
    });

    // Person Schema for E-E-A-T (Localized)
    const personJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Fumi Nozawa',
        url: 'https://fuminozawa-info.site',
        jobTitle: 'Software Engineer & Marketer',
        sameAs: [
            'https://www.linkedin.com/in/masafumi-nozawa/',
            'https://github.com/farang-dev',
            'https://x.com/fuminozawa_',
            'https://instagram.com/fumi_fumar/'
        ],
        description: 'Next.js、SEO、デジタルマーケティング戦略の専門家'
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
            />
            <HomeClient initialWritings={posts} initialLocale="ja" />
        </>
    );
}
