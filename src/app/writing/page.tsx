import { getBlogPosts } from '@/lib/prismic-blog';
import HomeClient from '../HomeClient';
import type { Metadata } from 'next';
import { generateWebsiteJSONLD, generateSEOMetadata } from '@/lib/seo';
import { getAlternateUrls } from '@/lib/locales';

export async function generateMetadata(): Promise<Metadata> {
    const alternateUrls = getAlternateUrls('/writing');

    return generateSEOMetadata({
        title: "Journal & Blog | Fumi Nozawa",
        description: "Insights into the intersection of technology and digital experience—from web development and strategy to AI, SEO, and marketing trends.",
        canonical: 'https://fuminozawa-info.site/writing',
        locale: 'en-us',
        alternateUrls,
    });
}

export default async function WritingPage() {
    const posts = await getBlogPosts('en-us', { excludeAiNews: true });
    const websiteJsonLd = generateWebsiteJSONLD({
        name: 'Fumi Nozawa | Journal',
        locale: 'en-us'
    });

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
            />
            <HomeClient initialWritings={posts} initialLocale="en" initialTab="writing" />
        </>
    );
}
