import { getBlogPosts } from '@/lib/prismic-blog';
import HomeClient from '../../HomeClient';
import type { Metadata } from 'next';
import { generateWebsiteJSONLD, generateSEOMetadata, generateServiceJSONLD } from '@/lib/seo';
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
            <HomeClient initialWritings={posts} initialLocale="ja" initialTab="services" />
        </>
    );
}
