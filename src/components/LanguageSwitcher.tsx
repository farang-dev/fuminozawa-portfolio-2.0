'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { locales, type LocaleCode, getLocaleFromPath } from '@/lib/locales';

interface LanguageSwitcherProps {
    availableLocales?: LocaleCode[];
    className?: string;
}

function LanguageSwitcherInner({
    availableLocales,
    className = ''
}: LanguageSwitcherProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentLocale = getLocaleFromPath(pathname);

    // Get the path without locale prefix
    const pathWithoutLocale = pathname.replace(/^\/(ja\/)?/, '/');

    const getLocalePath = (locale: LocaleCode) => {
        const queryString = searchParams.toString();
        const suffix = queryString ? `?${queryString}` : '';

        // Determine the base URL. If we're on the AI subdomain, we usually stay there
        // unless we're navigating to a non-AI path.
        const isCurrentAiSubdomain = typeof window !== 'undefined' &&
            (window.location.hostname === 'ai.fuminozawa-info.site' || window.location.hostname.startsWith('ai.'));

        let targetHost = '';
        if (isCurrentAiSubdomain) {
            targetHost = 'https://ai.fuminozawa-info.site';
        }

        // Normalize the path without locale
        // If pathname is /ja/blog/ai-news, pathWithoutLocale should be /blog/ai-news
        // If pathname is /ja, pathWithoutLocale should be /
        let cleanPath = pathname.replace(/^\/ja(\/|$)/, '/');
        if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;

        if (locale === 'en-us') {
            const base = cleanPath === '/' ? '/' : cleanPath.replace(/\/$/, '');
            return targetHost ? `${targetHost}${base}${suffix}` : `${base}${suffix}`;
        }

        // For /ja
        const base = cleanPath === '/' ? '/ja' : `/ja${cleanPath.replace(/\/$/, '')}`;
        return targetHost ? `${targetHost}${base}${suffix}` : `${base}${suffix}`;
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {Object.entries(locales).map(([code, locale]) => {
                const localeCode = code as LocaleCode;
                const isActive = currentLocale === localeCode;
                const isAvailable = !availableLocales || availableLocales.includes(localeCode);

                if (!isAvailable) {
                    return (
                        <span
                            key={code}
                            className="px-3 py-1.5 text-sm font-medium text-gray-400 cursor-not-allowed opacity-50"
                            title={`Not available in ${locale.name}`}
                        >
                            {locale.flag} {locale.lang.toUpperCase()}
                        </span>
                    );
                }

                return (
                    <Link
                        key={code}
                        href={getLocalePath(localeCode)}
                        className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${isActive
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                            }
            `}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        {locale.flag} {locale.lang.toUpperCase()}
                    </Link>
                );
            })}
        </div>
    );
}

export default function LanguageSwitcher(props: LanguageSwitcherProps) {
    return (
        <Suspense fallback={<div className={`flex items-center gap-2 ${props.className || ''}`} />}>
            <LanguageSwitcherInner {...props} />
        </Suspense>
    );
}
