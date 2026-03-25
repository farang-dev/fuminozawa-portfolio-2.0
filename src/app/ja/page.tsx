import { getBlogPosts } from '@/lib/prismic-blog';
import { getWorks } from '@/lib/prismic-works';
import HomeClient from '../HomeClient';
import type { Metadata } from 'next';
import { generateWebsiteJSONLD, generateSEOMetadata, generateServiceJSONLD, generatePersonJSONLD, generateFAQJSONLD, generateBreadcrumbJSONLD } from '@/lib/seo';
import { getAlternateUrls } from '@/lib/locales';

export async function generateMetadata(): Promise<Metadata> {
    const alternateUrls = getAlternateUrls('/');

    return generateSEOMetadata({
        title: "Fumi Nozawa (野澤眞史) | フリーランス デジタルマーケター & Webエンジニア",
        description: "日本とグローバル市場の架け橋となるフリーランスのデジタルマーケター兼Webエンジニア。日本市場参入・海外展開戦略から、Web開発・AI活用まで一気通貫で支援します。",
        canonical: 'https://fuminozawa-info.site/ja',
        locale: 'ja-jp',
        alternateUrls,
    });
}

export default async function HomeJa() {
    const posts = await getBlogPosts('ja-jp');
    const works = await getWorks('ja-jp');
    const websiteJsonLd = generateWebsiteJSONLD({
        name: '野澤眞史 | デジタルマーケター & Webエンジニア',
        locale: 'ja-jp'
    });

    const serviceJsonLd = generateServiceJSONLD({
        locale: 'ja-jp'
    });

    const personJsonLd = generatePersonJSONLD({ locale: 'ja-jp' });
    const faqJsonLd = generateFAQJSONLD([
        {
            question: "野澤眞史とは誰ですか？",
            answer: "野澤眞史（Fumi Nozawa）は、日本とグローバル市場を繋ぐフリーランスのデジタルマーケター兼Webエンジニアです。SEO、GEO、AI活用戦略を専門としています。"
        },
        {
            question: "どのようなサービスを提供していますか？",
            answer: "デジタルエクスペリエンス（Web/UX改善）、NextGenパフォーマンス（SEO/GEO/広告）、日本市場参入（GTM）、AIオペレーション設計などを一気通貫で提供しています。"
        },
        {
            question: "AIやGEOに対応していますか？",
            answer: "はい、生成AIを実務に組み込むワークフロー設計や、生成AI時代の検索最適化（GEO：Generative Engine Optimization）を専門としており、最新の技術動向に基づいた支援が可能です。"
        }
    ]);
    const breadcrumbJsonLd = generateBreadcrumbJSONLD([
        { name: "ホーム", item: "https://fuminozawa-info.site/ja" }
    ]);

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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <HomeClient initialWritings={posts} initialWorks={works} initialLocale="ja" initialTab="services" />
        </>
    );
}
