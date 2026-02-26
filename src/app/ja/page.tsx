import { getBlogPosts } from '@/lib/prismic-blog';
import { getWorks } from '@/lib/prismic-works';
import HomeClient from '../HomeClient';
import type { Metadata } from 'next';
import { generateWebsiteJSONLD, generateSEOMetadata, generateServiceJSONLD } from '@/lib/seo';
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
            'https://www.facebook.com/masafumi.nozawa.5/',
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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
            />
            <HomeClient initialWritings={posts} initialWorks={works} initialLocale="ja" initialTab="services" />
        </>
    );
}
