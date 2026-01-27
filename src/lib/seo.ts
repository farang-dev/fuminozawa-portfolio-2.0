import { Metadata } from 'next';
import { LocaleCode, locales, getAlternateUrls } from './locales';

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
    locale?: LocaleCode;
    alternateUrls?: Record<string, string>;
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
    locale = 'en-us',
    alternateUrls,
}: SEOProps): Metadata {
    const baseUrl = 'https://fuminozawa-info.site';
    const fullCanonical = canonical || baseUrl;
    const defaultImage = `${baseUrl}/og-image.png`;

    const localeData = locales[locale];
    const ogLocale = locale === 'en-us' ? 'en_US' : 'ja_JP';
    const alternateOgLocale = locale === 'en-us' ? 'ja_JP' : 'en_US';

    return {
        title,
        description,
        authors: [{ name: author }],
        creator: author,
        publisher: author,
        metadataBase: new URL(baseUrl),
        alternates: {
            canonical: fullCanonical,
            languages: alternateUrls || {},
        },
        openGraph: {
            title,
            description,
            url: fullCanonical,
            siteName: 'Fumi Nozawa - Portfolio',
            locale: ogLocale,
            alternateLocale: [alternateOgLocale],
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
            // Property already verified in Search Console
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
    locale = 'en-us',
}: {
    title: string;
    description: string;
    url: string;
    datePublished?: string;
    dateModified?: string;
    author?: string;
    authorUrl?: string;
    locale?: LocaleCode;
}) {
    const inLanguage = locale === 'en-us' ? 'en-US' : 'ja-JP';

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
        inLanguage,
    };
}

export function generateWebsiteJSONLD(params?: { name?: string; locale?: LocaleCode }) {
    const { name = 'Fumi Nozawa', locale = 'en-us' } = params || {};
    const inLanguage = locale === 'en-us' ? 'en-US' : 'ja-JP';

    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name,
        url: 'https://fuminozawa-info.site',
        author: {
            '@type': 'Person',
            name: 'Fumi Nozawa',
            url: 'https://fuminozawa-info.site',
        },
        inLanguage,
    };
}
