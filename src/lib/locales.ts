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
            return { code: code.toLowerCase(), quality: parseFloat(q) };
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
export function getAlternateUrls(fullPath: string, baseUrl: string = 'https://fuminozawa-info.site') {
    // Split path and query
    const [path, queryString] = fullPath.split('?');

    // Clean the route path: remove /ja prefix and surrounding slashes
    let cleanRoute = path.replace(/^\/+(ja\/?)?/, '').replace(/\/+$/, '');

    const constructUrl = (prefix: string) => {
        const segments = [baseUrl, prefix, cleanRoute].filter(Boolean);
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
