import { getBlogPosts } from '@/lib/prismic-blog';
import HomeClient from '../HomeClient';
import type { Metadata } from 'next';
import { generateWebsiteJSONLD, generateSEOMetadata, generateCollectionJSONLD } from '@/lib/seo';
import { getAlternateUrls } from '@/lib/locales';

export async function generateMetadata(): Promise<Metadata> {
    const alternateUrls = getAlternateUrls('/works');

    return generateSEOMetadata({
        title: "Works | Fumi Nozawa",
        description: "Explore the portfolio of Fumi Nozawa, featuring web development projects, digital marketing campaigns, and creative direction.",
        canonical: 'https://fuminozawa-info.site/works',
        locale: 'en-us',
        alternateUrls,
    });
}

export default async function WorksPage() {
    const posts = await getBlogPosts('en-us');
    const websiteJsonLd = generateWebsiteJSONLD({
        name: 'Fumi Nozawa | Works',
        locale: 'en-us'
    });

    const collectionJsonLd = generateCollectionJSONLD({
        name: 'Works Portfolio | Fumi Nozawa',
        description: 'Explore web development projects, digital marketing campaigns, and creative direction by Fumi Nozawa.',
        url: 'https://fuminozawa-info.site/works',
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
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
            />
            <HomeClient initialWritings={posts} initialLocale="en" initialTab="works" />
        </>
    );
}
