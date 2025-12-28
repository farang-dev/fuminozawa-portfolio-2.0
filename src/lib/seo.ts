import { Metadata } from 'next';

interface SEOProps {
    title: string;
    description: string;
    canonical?: string;
    ogImage?: string;
    ogType?: 'website' | 'article';
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    noindex?: boolean;
}

export function generateSEOMetadata({
    title,
    description,
    canonical,
    ogImage,
    ogType = 'website',
    publishedTime,
    modifiedTime,
    author = 'Fumi Nozawa',
    noindex = false,
}: SEOProps): Metadata {
    const baseUrl = 'https://fuminozawa-info.site';
    const fullCanonical = canonical || baseUrl;
    const defaultImage = `${baseUrl}/og-image.png`;

    return {
        title,
        description,
        authors: [{ name: author }],
        creator: author,
        publisher: author,
        metadataBase: new URL(baseUrl),
        alternates: {
            canonical: fullCanonical,
        },
        openGraph: {
            title,
            description,
            url: fullCanonical,
            siteName: 'Fumi Nozawa - Portfolio',
            locale: 'en_US',
            type: ogType,
            images: [
                {
                    url: ogImage || defaultImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            ...(publishedTime && { publishedTime }),
            ...(modifiedTime && { modifiedTime }),
            ...(author && ogType === 'article' && { authors: [author] }),
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            creator: '@fuminozawa',
            site: '@fuminozawa',
            images: [ogImage || defaultImage],
        },
        robots: {
            index: !noindex,
            follow: !noindex,
            googleBot: {
                index: !noindex,
                follow: !noindex,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        verification: {
            google: 'your-google-verification-code', // Add your actual verification code
        },
    };
}

export function generateArticleJSONLD({
    title,
    description,
    url,
    datePublished,
    dateModified,
    author = 'Fumi Nozawa',
    authorUrl = 'https://fuminozawa-info.site',
}: {
    title: string;
    description: string;
    url: string;
    datePublished?: string;
    dateModified?: string;
    author?: string;
    authorUrl?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description,
        author: {
            '@type': 'Person',
            name: author,
            url: authorUrl,
        },
        publisher: {
            '@type': 'Person',
            name: author,
            url: authorUrl,
        },
        datePublished,
        dateModified: dateModified || datePublished,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url,
        },
        url,
        inLanguage: 'en-US',
    };
}

export function generateWebsiteJSONLD() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Fumi Nozawa - Portfolio',
        description: 'Software Engineer specializing in Next.js and TypeScript',
        url: 'https://fuminozawa-info.site',
        author: {
            '@type': 'Person',
            name: 'Fumi Nozawa',
            url: 'https://fuminozawa-info.site',
        },
        inLanguage: 'en-US',
    };
}
