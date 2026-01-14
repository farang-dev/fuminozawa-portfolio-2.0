'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, LocaleCode, getLocaleFromPath } from '@/lib/locales';

interface LanguageSwitcherProps {
    availableLocales?: LocaleCode[];
    className?: string;
}

export default function LanguageSwitcher({
    availableLocales,
    className = ''
}: LanguageSwitcherProps) {
    const pathname = usePathname();
    const currentLocale = getLocaleFromPath(pathname);

    // Get the path without locale prefix
    const pathWithoutLocale = pathname.replace(/^\/(ja\/)?/, '/');

    const getLocalePath = (locale: LocaleCode) => {
        if (locale === 'en-us') {
            return pathWithoutLocale;
        }
        return `/ja${pathWithoutLocale}`;
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
