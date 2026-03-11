/**
 * Supported locales configuration
 */
export const locales = {
    'en-us': {
        code: 'en-us',
        lang: 'en',
        name: 'English',
        flag: '🇺🇸',
    },
    'ja-jp': {
        code: 'ja-jp',
        lang: 'ja',
        name: '日本語',
        flag: '🇯🇵',
    },
} as const;

export type LocaleCode = keyof typeof locales;

export const defaultLocale: LocaleCode = 'en-us';

/**
 * Get locale from path segment
 */
export function getLocaleFromPath(path: string): LocaleCode {
    const segments = path.split('/').filter(Boolean);
    const firstSegment = segments[0];

    if (firstSegment === 'ja') {
        return 'ja-jp';
    }

    return 'en-us';
}

/**
 * Detect user's preferred locale from browser language
 */
export function detectUserLocale(acceptLanguage?: string | null): LocaleCode {
    if (!acceptLanguage) return defaultLocale;

    const languages = acceptLanguage
        .split(',')
        .map(lang => {
            const [code, q = '1'] = lang.trim().split(';q=');
            return { code: code.toLowerCase(), quality: Number.parseFloat(q) };
        })
        .sort((a, b) => b.quality - a.quality);

    for (const { code } of languages) {
        if (code.startsWith('ja')) {
            return 'ja-jp';
        }
        if (code.startsWith('en')) {
            return 'en-us';
        }
    }

    return defaultLocale;
}

/**
 * Get path prefix for locale
 */
export function getLocalePrefix(locale: LocaleCode): string {
    return locale === 'en-us' ? '' : '/ja';
}

/**
 * Get alternate URLs for hreflang tags
 */
export function getAlternateUrls(fullPath: string, baseUrl = 'https://fuminozawa-info.site') {
    // Determine which base URL to use based on the path
    const isAiNews = fullPath.startsWith('blog/ai-news') || fullPath.startsWith('ja/blog/ai-news') ||
        fullPath.startsWith('news/') || fullPath.startsWith('ja/news/');
    const effectiveBaseUrl = isAiNews ? 'https://ai.fuminozawa-info.site' : baseUrl;

    // Split path and query
    const [path, queryString] = fullPath.split('?');

    // Clean the route path: remove /ja prefix and surrounding slashes
    let cleanRoute = path.replace(/^\/+(ja\/?)?/, '').replace(/\/+$/, '');

    // Special case: AI News index should be just / on the AI subdomain
    if (cleanRoute === 'blog/ai-news') {
        cleanRoute = '';
    } else if (isAiNews && cleanRoute.startsWith('blog/')) {
        // If it's AI News and the path starts with blog/, change it to news/ for the ai subdomain
        cleanRoute = cleanRoute.replace(/^blog\//, 'news/');
    }

    const constructUrl = (prefix: string) => {
        const segments = [effectiveBaseUrl, prefix, cleanRoute].filter(Boolean);
        let url = segments.join('/');

        // Append query string if it exists
        if (queryString) {
            url += `?${queryString}`;
        }

        return url;
    };

    return {
        'en-us': constructUrl(''),
        'ja-jp': constructUrl('ja'),
        'x-default': constructUrl(''),
    };
}

export const MAIN_DOMAIN = 'fuminozawa-info.site';
export const AI_NEWS_DOMAIN = 'ai.fuminozawa-info.site';

/**
 * Helper to determine if the current request is for the AI News subdomain
 */
export function isAiNewsDomain(host: string | null): boolean {
    if (!host) return false;
    return host === AI_NEWS_DOMAIN || host.startsWith('ai.');
}

/**
 * Convert Prismic locale to our locale code
 */
export function prismicLocaleToLocaleCode(prismicLocale: string): LocaleCode {
    if (prismicLocale === 'ja-jp') return 'ja-jp';
    return 'en-us';
}

/**
 * Convert our locale code to Prismic locale
 */
export function localeCodeToPrismicLocale(localeCode: LocaleCode): string {
    return localeCode;
}
