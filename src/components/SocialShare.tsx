'use client';

import { useState } from 'react';

interface SocialShareProps {
    url: string;
    title: string;
    locale?: 'en' | 'ja';
}

export default function SocialShare({ url, title, locale = 'en' }: SocialShareProps) {
    const [copied, setCopied] = useState(false);

    const t = {
        en: {
            shareTitle: 'Share this article',
            copyLink: 'Copy Link',
            copied: 'Copied!',
        },
        ja: {
            shareTitle: 'この記事をシェア',
            copyLink: 'リンクをコピー',
            copied: 'コピーしました！',
        },
    };

    const text = t[locale] || t.en;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    return (
        <div className="flex flex-col gap-4 mt-12 mb-2 pt-8 border-t border-gray-100">
            <h3 className="text-gray-900 font-bold text-lg">{text.shareTitle}</h3>
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-3">
                {/* Copy Link - Takes full width on mobile grid if needed, or stays inline */}
                <button
                    onClick={handleCopy}
                    className="col-span-2 sm:col-auto group flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all relative w-full sm:w-auto"
                    aria-label={text.copyLink}
                >
                    <i className="fas fa-link text-sm"></i>
                    <span className="text-sm font-semibold">{text.copyLink}</span>
                    {copied && (
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap z-10">
                            {text.copied}
                        </span>
                    )}
                </button>

                {/* Action Icons Wrapper */}
                <div className="col-span-2 flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
                    {/* X (Twitter) */}
                    <a
                        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none flex items-center justify-center w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-black hover:bg-gray-800 text-white transition-all"
                        aria-label="Share on X"
                        title="Share on X"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                    </a>

                    {/* LinkedIn */}
                    <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none flex items-center justify-center w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-[#0077b5] hover:bg-[#006396] text-white transition-all"
                        aria-label="Share on LinkedIn"
                        title="Share on LinkedIn"
                    >
                        <i className="fab fa-linkedin-in text-lg"></i>
                    </a>

                    {/* WhatsApp */}
                    <a
                        href={`https://api.whatsapp.com/send?text=${encodedTitle} ${encodedUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none flex items-center justify-center w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white transition-all"
                        aria-label="Share on WhatsApp"
                        title="Share on WhatsApp"
                    >
                        <i className="fab fa-whatsapp text-xl"></i>
                    </a>

                    {/* LINE */}
                    <a
                        href={`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none flex items-center justify-center w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-[#06C755] hover:bg-[#05b34c] text-white transition-all"
                        aria-label="Share on LINE"
                        title="Share on LINE"
                    >
                        <i className="fab fa-line text-xl"></i>
                    </a>
                </div>
            </div>
        </div>
    );
}
