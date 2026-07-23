import type { Metadata } from 'next';
import { type LocaleCode, locales, getAlternateUrls } from './locales';

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
    tags?: string[];
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
    tags,
}: SEOProps): Metadata {
    const baseUrl = 'https://fumi-nozawa.space';
    const aiBaseUrl = 'https://ai.fumi-nozawa.space';

    // Ensure Masafumi Nozawa is always present in the title for SEO
    const ensureFullName = (t: string) => {
        if (t.includes('Masafumi Nozawa') || t.includes('野澤眞史')) return t;
        return `${t} | Masafumi Nozawa`;
    };

    // Logic to determine if this is an AI News related content
    const isAiNewsContent = tags?.some(t => ['AI News', 'AIニュース'].includes(t)) ||
        (canonical && (canonical.includes('ai-news') || canonical.includes('ai.')));

    const effectiveBaseUrl = isAiNewsContent ? aiBaseUrl : baseUrl;
    const fullCanonical = canonical || effectiveBaseUrl;

    // Use profile.jpg as fallback if og-image.png doesn't exist
    const defaultImage = `${baseUrl}/profile.jpg`;

    const ogLocale = locale === 'en-us' ? 'en_US' : 'ja_JP';
    const alternateOgLocale = locale === 'en-us' ? 'ja_JP' : 'en_US';

    // Dynamic site name based on locale
    const siteName = locale === 'en-us'
        ? (isAiNewsContent ? 'AI News | Fumi Nozawa' : 'Fumi Nozawa | Digital Marketer & Developer')
        : (isAiNewsContent ? 'AIニュース | 野澤眞史' : '野澤眞史 | デジタルマーケター & Webエンジニア');

    return {
        title: ensureFullName(title),
        description,
        authors: [{ name: author }, { name: 'Masafumi Nozawa' }],
        creator: author,
        publisher: author,
        metadataBase: new URL(effectiveBaseUrl),
        alternates: {
            canonical: fullCanonical,
            languages: alternateUrls || {},
        },
        openGraph: {
            title,
            description,
            url: fullCanonical,
            siteName,
            locale: ogLocale,
            alternateLocale: [alternateOgLocale],
            type: ogType,
            images: [
                {
                    url: ogImage || defaultImage,
                    width: 1200,
                    height: 627,
                    alt: title,
                    type: (ogImage || defaultImage).endsWith('.png') ? 'image/png' : 'image/jpeg',
                },
            ],
            ...(publishedTime && { publishedTime }),
            ...(modifiedTime && { modifiedTime }),
            ...(author && ogType === 'article' && { authors: [author] }),
            ...(tags && ogType === 'article' && { tags }),
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            creator: '@fuminozawa',
            site: '@fuminozawa',
            images: [{
                url: ogImage || defaultImage,
                alt: title,
            }],
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
        keywords: ['Fumi Nozawa', 'Masafumi Nozawa', '野澤眞史', 'Digital Marketer', 'Web Developer', 'Japan', ...(tags || [])],
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
    image,
    author = 'Masafumi Nozawa',
    authorUrl = 'https://fumi-nozawa.space',
    locale = 'en-us',
    tags = [],
}: {
    title: string;
    description: string;
    url: string;
    datePublished?: string;
    dateModified?: string;
    image?: string;
    author?: string;
    authorUrl?: string;
    locale?: LocaleCode;
    tags?: string[];
}) {
    const inLanguage = locale === 'en-us' ? 'en-US' : 'ja-JP';

    // Determine the most appropriate schema type
    // Use NewsArticle if it looks like a news post (contains AI, News, or specific marketing tags)
    const isNews = tags.some(tag =>
        ['News', 'AI', 'AI News', 'Market Entry', 'Marketing News', 'GTM'].includes(tag) ||
        ['ニュース', 'AIニュース', '最新情報'].includes(tag)
    );

    const schemaType = isNews ? 'NewsArticle' : 'BlogPosting';

    return {
        '@context': 'https://schema.org',
        '@type': schemaType,
        headline: title,
        description,
        ...(image && { image: [image] }),
        datePublished,
        dateModified: dateModified || datePublished,
        author: {
            '@type': 'Person',
            name: author,
            alternateName: 'Masafumi Nozawa',
            url: authorUrl,
            jobTitle: 'Digital Marketer & Web Developer',
            sameAs: [
                'https://www.linkedin.com/in/masafumi-nozawa/',
                'https://www.facebook.com/masafumi.nozawa.5/'
            ]
        },
        publisher: {
            '@type': 'Person',
            name: author,
            alternateName: 'Masafumi Nozawa',
            logo: {
                '@type': 'ImageObject',
                url: 'https://fumi-nozawa.space/profile.jpg'
            }
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url,
        },
        url,
        inLanguage,
        keywords: tags.join(', '),
    };
}

export function generateWebsiteJSONLD(params?: { name?: string; locale?: LocaleCode }) {
    const { name = 'Fumi Nozawa', locale = 'en-us' } = params || {};
    const inLanguage = locale === 'en-us' ? 'en-US' : 'ja-JP';

    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name,
        url: 'https://fumi-nozawa.space',
        author: {
            '@type': 'Person',
            name: 'Fumi Nozawa',
            alternateName: 'Masafumi Nozawa',
            url: 'https://fumi-nozawa.space',
        },
        inLanguage,
    };
}

export function generateServiceJSONLD({
    locale = 'en-us'
}: {
    locale?: LocaleCode;
}) {
    const isEn = locale === 'en-us';
    const siteUrl = 'https://fumi-nozawa.space';

    return {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: isEn ? 'Fumi Nozawa | Digital Marketing & Web Development' : '野澤眞史 | デジタルマーケティング & Web受託開発',
        image: `${siteUrl}/profile.jpg`,
        url: isEn ? siteUrl : `${siteUrl}/ja`,
        priceRange: '$$',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Tokyo',
            addressCountry: 'JP'
        },
        description: isEn
            ? 'Freelance Digital Marketer and Web Engineer specializing in SEO, GEO, Japan Market Entry, and AI-driven growth strategies.'
            : 'SEO、GEO、日本市場参入、AI活用戦略を専門とするフリーランスのデジタルマーケター兼Webエンジニア。',
        serviceType: [
            'Digital Marketing',
            'SEO & GEO',
            'Web Development',
            'Japan Market Entry Strategy',
            'AI Operations'
        ],
        areaServed: ['Japan', 'Global'],
        sameAs: [
            'https://www.linkedin.com/in/masafumi-nozawa/',
            'https://www.facebook.com/masafumi.nozawa.5/',
            'https://github.com/farang-dev',
            'https://x.com/fuminozawa_',
            'https://instagram.com/fumi_fumar/'
        ],
        provider: {
            '@type': 'Person',
            name: 'Fumi Nozawa',
            alternateName: 'Masafumi Nozawa',
            url: siteUrl
        }
    };
}

export function generatePersonJSONLD({
    locale = 'en-us'
}: {
    locale?: LocaleCode;
}) {
    const isEn = locale === 'en-us';
    const siteUrl = 'https://fumi-nozawa.space';

    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Fumi Nozawa',
        alternateName: 'Masafumi Nozawa',
        url: siteUrl,
        jobTitle: isEn ? 'Digital Marketer & Web Developer' : 'デジタルマーケター & Webエンジニア',
        image: `${siteUrl}/profile.jpg`,
        sameAs: [
            'https://www.linkedin.com/in/masafumi-nozawa/',
            'https://github.com/farang-dev',
            'https://www.facebook.com/masafumi.nozawa.5/',
            'https://instagram.com/fumi_fumar/',
            'https://x.com/fuminozawa_'
        ],
        description: isEn
            ? 'Fumi Nozawa (Masafumi Nozawa) is an expert in Next.js, SEO, GEO, and Digital Marketing Strategy with a focus on Japan Market Entry.'
            : '野澤眞史 (Masafumi Nozawa) は、Next.js、SEO、GEO、デジタルマーケティング戦略、日本市場参入を専門とするスペシャリスト。',
        knowsAbout: [
            'Digital Marketing',
            'Search Engine Optimization (SEO)',
            'Generative Engine Optimization (GEO)',
            'Web Development',
            'Next.js',
            'React',
            'TypeScript',
            'AI Operations',
            'Japan Market Entry',
            'Growth Strategy'
        ]
    };
}

export function generateFAQJSONLD(faqItems: { question: string; answer: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer
            }
        }))
    };
}

export function generateBreadcrumbJSONLD(items: { name: string; item: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.item
        }))
    };
}

export function generateGalleryJSONLD({
    locale = 'en-us'
}: {
    locale?: LocaleCode;
}) {
    const isEn = locale === 'en-us';
    return {
        '@context': 'https://schema.org',
        '@type': 'ImageGallery',
        name: isEn ? 'Instagram Gallery | Fumi Nozawa' : 'インスタグラム ギャラリー | 野澤眞史',
        description: isEn
            ? 'A collection of visual stories and marketing insights from Instagram.'
            : 'Instagramから発信するビジュアルストーリーとマーケティングのインサイト。',
        url: isEn ? 'https://fumi-nozawa.space/gallery' : 'https://fumi-nozawa.space/ja/gallery',
        author: {
            '@type': 'Person',
            name: 'Fumi Nozawa',
            alternateName: 'Masafumi Nozawa'
        }
    };
}

export function generateCollectionJSONLD({
    name,
    description,
    url,
    locale = 'en-us'
}: {
    name: string;
    description: string;
    url: string;
    locale?: LocaleCode;
}) {
    const inLanguage = locale === 'en-us' ? 'en-US' : 'ja-JP';
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name,
        description,
        url,
        inLanguage,
        author: {
            '@type': 'Person',
            name: 'Fumi Nozawa',
            alternateName: 'Masafumi Nozawa'
        },
        mainEntity: {
            '@type': 'ItemList',
            'itemListElement': []
        }
    };
}
