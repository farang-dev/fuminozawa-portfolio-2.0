import { PrismicRichText } from '@prismicio/react';
import { JSXMapSerializer } from '@prismicio/react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Custom components for rendering Prismic rich text
 */
export const richTextComponents: any = {
    heading1: ({ children }: any) => (
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-10 mb-6 tracking-tight">
            {children}
        </h1>
    ),
    heading2: ({ children }: any) => (
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-12 mb-6 tracking-tight border-b pb-2 border-gray-100">
            {children}
        </h2>
    ),
    heading3: ({ children }: any) => (
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-8 mb-4">
            {children}
        </h3>
    ),
    paragraph: ({ children }: any) => (
        <p className="text-gray-800 leading-relaxed mb-6 text-base sm:text-lg">
            {children}
        </p>
    ),
    strong: ({ children }: any) => (
        <strong className="font-bold text-gray-900 bg-blue-50/30 px-0.5 rounded-sm">{children}</strong>
    ),
    em: ({ children }: any) => (
        <em className="italic text-gray-800">{children}</em>
    ),
    listItem: ({ children }: any) => (
        <li className="text-gray-800 leading-relaxed mb-3 ml-6 list-disc marker:text-blue-500">
            {children}
        </li>
    ),
    oListItem: ({ children }: any) => (
        <li className="text-gray-800 leading-relaxed mb-3 ml-6 list-decimal marker:text-blue-500 marker:font-bold">
            {children}
        </li>
    ),
    list: ({ children }: any) => (
        <ul className="my-6 space-y-1">{children}</ul>
    ),
    oList: ({ children }: any) => (
        <ol className="my-6 space-y-1">{children}</ol>
    ),
    image: ({ node }: any) => {
        if (!node.url) return null;
        return (
            <div className="my-10 flex flex-col items-center">
                <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100">
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
                    <p className="text-gray-500 text-sm text-center mt-4 italic">
                        {node.alt}
                    </p>
                )}
            </div>
        );
    },
    hyperlink: ({ node, children }: any) => {
        const isExternal = node.data.url?.startsWith('http');
        return (
            <Link
                href={node.data.url || '#'}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="text-blue-600 hover:text-blue-800 underline decoration-blue-200 decoration-2 underline-offset-4 transition-all font-medium"
            >
                {children}
            </Link>
        );
    },
    label: ({ node, children }: any) => {
        if (node.data.label === 'section-line' || node.data.label === 'divider') {
            return <hr className="my-16 border-t-2 border-gray-100 w-1/2 mx-auto" />;
        }
        return <span className={node.data.label}>{children}</span>;
    },
    embed: ({ node }: any) => (
        <div
            className="my-10 rounded-2xl overflow-hidden shadow-lg border border-gray-100"
            dangerouslySetInnerHTML={{ __html: node.oembed.html || '' }}
        />
    ),
    quote: ({ children }: any) => (
        <blockquote className="border-l-4 border-blue-500 bg-blue-50/20 px-8 py-6 my-10 italic text-gray-700 text-xl font-light leading-relaxed rounded-r-xl">
            {children}
        </blockquote>
    ),
    hr: () => <hr className="my-16 border-t-2 border-gray-100 w-1/2 mx-auto" />,
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
