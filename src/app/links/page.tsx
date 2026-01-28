import { getBlogPosts } from '@/lib/prismic-blog';
import HomeClient from '../HomeClient';
import type { Metadata } from 'next';
import { generateWebsiteJSONLD, generateSEOMetadata } from '@/lib/seo';
import { getAlternateUrls } from '@/lib/locales';

export async function generateMetadata(): Promise<Metadata> {
    const alternateUrls = getAlternateUrls('/links');

    return generateSEOMetadata({
        title: "Connect & Links | Fumi Nozawa",
        description: "Connect with Fumi Nozawa on social media or reach out via email for digital marketing and web engineering projects.",
        canonical: 'https://fuminozawa-info.site/links',
        locale: 'en-us',
        alternateUrls,
    });
}

export default async function LinksPage() {
    const posts = await getBlogPosts('en-us');
    const websiteJsonLd = generateWebsiteJSONLD({
        name: 'Fumi Nozawa | Links',
        locale: 'en-us'
    });

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
            />
            <HomeClient initialWritings={posts} initialLocale="en" initialTab="links" />
        </>
    );
}
