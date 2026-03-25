import { getBlogPosts } from '@/lib/prismic-blog';
import HomeClient from '../../HomeClient';
import type { Metadata } from 'next';
import { generateWebsiteJSONLD, generateSEOMetadata, generateServiceJSONLD, generateBreadcrumbJSONLD, generateFAQJSONLD } from '@/lib/seo';
import { getAlternateUrls } from '@/lib/locales';

export async function generateMetadata(): Promise<Metadata> {
    const alternateUrls = getAlternateUrls('/services');

    return generateSEOMetadata({
        title: "提供サービス | 野澤眞史 | デジタルマーケター & Webエンジニア",
        description: "SEO、生成AI活用、マーケティングオートメーション、日本市場参入支援など、テクノロジーを活用したデジタルマーケティングの実務を提供します。",
        canonical: 'https://fuminozawa-info.site/ja/services',
        locale: 'ja-jp',
        alternateUrls,
    });
}

export default async function ServicesPageJa() {
    const posts = await getBlogPosts('ja-jp');
    const websiteJsonLd = generateWebsiteJSONLD({
        name: '野澤眞史 | 提供サービス',
        locale: 'ja-jp'
    });

    const serviceJsonLd = generateServiceJSONLD({
        locale: 'ja-jp'
    });

    const breadcrumbJsonLd = generateBreadcrumbJSONLD([
        { name: "ホーム", item: "https://fuminozawa-info.site/ja" },
        { name: "サービス", item: "https://fuminozawa-info.site/ja/services" }
    ]);

    const faqJsonLd = generateFAQJSONLD([
        {
            question: "提供しているデジタルマーケティングサービスは何ですか？",
            answer: "SEO、GEO（生成AI時代の検索最適化）、有料広告運用（PPC）、日本市場参入戦略およびコンテンツ制作を専門としています。"
        },
        {
            question: "日本市場参入（GTM）の支援では何をしますか？",
            answer: "需要調査、ペルソナ設計、メッセージのローカライズ、UX調整、日本国内向けの広告運用までを一貫して支援します。"
        },
        {
            question: "AIオペレーション設計とは何ですか？",
            answer: "生成AIを日常の業務プロセス（リサーチ、データ分析、コンテンツ制作など）に統合し、生産性と再現性を高めるためのフロー設計とSOP整備を行います。"
        }
    ]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <HomeClient initialWritings={posts} initialLocale="ja" initialTab="services" />
        </>
    );
}
