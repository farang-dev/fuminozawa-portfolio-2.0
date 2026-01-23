'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { locales, LocaleCode, getLocaleFromPath } from '@/lib/locales';

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

        if (locale === 'en-us') {
            // Ensure we don't end up with // if pathWithoutLocale is /
            const base = pathWithoutLocale === '/' ? '/' : pathWithoutLocale.replace(/\/$/, '');
            return `${base}${suffix}`;
        }
        // For /ja, ensure we don't have trailing slash unless it's just /ja/ (which should be /ja)
        const base = pathWithoutLocale === '/' ? '/ja' : `/ja${pathWithoutLocale.replace(/\/$/, '')}`;
        return `${base}${suffix}`;
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
