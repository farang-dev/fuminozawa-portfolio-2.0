import { getBlogPosts } from '@/lib/prismic-blog';
import HomeClient from '../HomeClient';
import type { Metadata } from 'next';
import { generateWebsiteJSONLD, generateSEOMetadata } from '@/lib/seo';
import { getAlternateUrls } from '@/lib/locales';

export async function generateMetadata(): Promise<Metadata> {
    const alternateUrls = getAlternateUrls('/works');

    return generateSEOMetadata({
        title: "Works & Portfolio | Fumi Nozawa",
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

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
            />
            <HomeClient initialWritings={posts} initialLocale="en" initialTab="works" />
        </>
    );
}
