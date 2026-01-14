import { PrismicRichText } from '@prismicio/react';
import { JSXMapSerializer } from '@prismicio/react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Custom components for rendering Prismic rich text
 */
export const richTextComponents: JSXMapSerializer = {
    heading1: ({ children }) => (
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-10 mb-6 tracking-tight">
            {children}
        </h1>
    ),
    heading2: ({ children }) => (
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-8 mb-5 tracking-tight">
            {children}
        </h2>
    ),
    heading3: ({ children }) => (
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-6 mb-4">
            {children}
        </h3>
    ),
    heading4: ({ children }) => (
        <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mt-5 mb-3">
            {children}
        </h4>
    ),
    heading5: ({ children }) => (
        <h5 className="text-base sm:text-lg font-semibold text-gray-900 mt-4 mb-2">
            {children}
        </h5>
    ),
    heading6: ({ children }) => (
        <h6 className="text-sm sm:text-base font-semibold text-gray-900 mt-3 mb-2">
            {children}
        </h6>
    ),
    paragraph: ({ children }) => (
        <p className="text-gray-800 leading-relaxed mb-5 text-base sm:text-lg">
            {children}
        </p>
    ),
    preformatted: ({ children }) => (
        <pre className="bg-gray-900 text-gray-100 rounded-xl p-6 overflow-x-auto my-6 text-sm sm:text-base font-mono border border-gray-700">
            <code>{children}</code>
        </pre>
    ),
    strong: ({ children }) => (
        <strong className="font-bold text-gray-900">{children}</strong>
    ),
    em: ({ children }) => (
        <em className="italic text-gray-800">{children}</em>
    ),
    listItem: ({ children }) => (
        <li className="text-gray-800 leading-relaxed mb-2 ml-6 list-disc marker:text-blue-600">
            {children}
        </li>
    ),
    oListItem: ({ children }) => (
        <li className="text-gray-800 leading-relaxed mb-2 ml-6 list-decimal marker:text-blue-600 marker:font-semibold">
            {children}
        </li>
    ),
    list: ({ children }) => (
        <ul className="my-6 space-y-1">{children}</ul>
    ),
    oList: ({ children }) => (
        <ol className="my-6 space-y-1">{children}</ol>
    ),
    image: ({ node }) => {
        if (!node.url) return null;

        return (
            <div className="my-8 flex flex-col items-center">
                <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                    <Image
                        src={node.url}
                        alt={node.alt || ''}
                        width={node.dimensions?.width || 800}
                        height={node.dimensions?.height || 600}
                        className="w-full h-auto"
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />
                </div>
                {node.alt && (
                    <p className="text-gray-500 text-sm text-center mt-3 italic">
                        {node.alt}
                    </p>
                )}
            </div>
        );
    },
    hyperlink: ({ node, children }) => {
        const isExternal = node.data.url?.startsWith('http');

        if (isExternal) {
            return (
                <a
                    href={node.data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 transition-colors font-medium"
                >
                    {children}
                </a>
            );
        }

        return (
            <Link
                href={node.data.url || '#'}
                className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 transition-colors font-medium"
            >
                {children}
            </Link>
        );
    },
    embed: ({ node }) => (
        <div
            className="my-8 rounded-2xl overflow-hidden shadow-lg border border-gray-200"
            dangerouslySetInnerHTML={{ __html: node.oembed.html || '' }}
        />
    ),
};

interface PrismicContentProps {
    field: any;
    className?: string;
}

/**
 * Component for rendering Prismic rich text content
 */
export default function PrismicContent({ field, className = '' }: PrismicContentProps) {
    if (!field) return null;

    return (
        <div className={`prose prose-lg prose-blue max-w-none ${className}`}>
            <PrismicRichText field={field} components={richTextComponents} />
        </div>
    );
}
