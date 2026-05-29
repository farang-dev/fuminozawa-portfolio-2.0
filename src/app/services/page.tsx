import { getBlogPosts } from '@/lib/prismic-blog';
import HomeClient from '../HomeClient';
import type { Metadata } from 'next';
import { generateWebsiteJSONLD, generateSEOMetadata, generateServiceJSONLD, generateBreadcrumbJSONLD, generateFAQJSONLD } from '@/lib/seo';
import { getAlternateUrls } from '@/lib/locales';

export async function generateMetadata(): Promise<Metadata> {
    const alternateUrls = getAlternateUrls('/services');

    return generateSEOMetadata({
        title: "Services | Fumi Nozawa | Digital Marketer & Web Engineer",
        description: "Expert digital marketing services specializing in SEO, GEO, AI automation, and Japan market entry strategy.",
        canonical: 'https://fumi-nozawa.space/services',
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

    const breadcrumbJsonLd = generateBreadcrumbJSONLD([
        { name: "Home", item: "https://fumi-nozawa.space" },
        { name: "Services", item: "https://fumi-nozawa.space/services" }
    ]);

    const faqJsonLd = generateFAQJSONLD([
        {
            question: "What digital marketing services do you offer?",
            answer: "I offer SEO, GEO (Generative Engine Optimization), Paid Media (PPC), and content strategy focused on Japan market entry and global growth."
        },
        {
            question: "How do you help with Japan Market Entry?",
            answer: "I provide end-to-end support from GTM strategy and demand research to localization of messaging, UX, and advertising operations specifically for the Japanese audience."
        },
        {
            question: "What is AI Operational Design?",
            answer: "It is the process of embedding generative AI into your business workflows—such as content creation, research, and data analysis—to increase productivity and scalability."
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
            <HomeClient initialWritings={posts} initialLocale="en" initialTab="services" />
        </>
    );
}
