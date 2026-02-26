import { getBlogPosts } from '@/lib/prismic-blog';
import HomeClient from '../HomeClient';
import type { Metadata } from 'next';
import { generateWebsiteJSONLD, generateSEOMetadata, generateServiceJSONLD } from '@/lib/seo';
import { getAlternateUrls } from '@/lib/locales';

export async function generateMetadata(): Promise<Metadata> {
    const alternateUrls = getAlternateUrls('/services');

    return generateSEOMetadata({
        title: "Services | Fumi Nozawa | Digital Marketer & Web Engineer",
        description: "Expert digital marketing services specializing in SEO, GEO, AI automation, and Japan market entry strategy.",
        canonical: 'https://fuminozawa-info.site/services',
        locale: 'en-us',
        alternateUrls,
    });
}

export default async function ServicesPage() {
    const posts = await getBlogPosts('en-us');
    const websiteJsonLd = generateWebsiteJSONLD({
        name: 'Fumi Nozawa | Services',
        locale: 'en-us'
    });

    const serviceJsonLd = generateServiceJSONLD({
        locale: 'en-us'
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
            <HomeClient initialWritings={posts} initialLocale="en" initialTab="services" />
        </>
    );
}
