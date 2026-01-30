import { PrismicRichText } from '@prismicio/react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Custom components for rendering Prismic rich text
 */
export const richTextComponents: any = {
    heading1: ({ children }: any) => (
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-10 mb-4 tracking-tight">
            {children}
        </h1>
    ),
    heading2: ({ children }: any) => (
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-10 mb-4 tracking-tight border-t pt-6 border-gray-100">
            {children}
        </h2>
    ),
    heading3: ({ children }: any) => (
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-8 mb-4">
            {children}
        </h3>
    ),
    paragraph: ({ children }: any) => (
        <p className="text-gray-800 leading-relaxed mb-4 text-base sm:text-lg last:mb-0">
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
        <li className="text-gray-800 leading-relaxed ml-6 list-disc marker:text-blue-500 pl-2 [&_p]:inline [&_p]:m-0">
            {children}
        </li>
    ),
    oListItem: ({ children }: any) => (
        <li className="text-gray-800 leading-relaxed ml-6 list-decimal marker:text-blue-500 marker:font-bold pl-2 [&_p]:inline [&_p]:m-0">
            {children}
        </li>
    ),
    list: ({ children }: any) => (
        <ul className="mb-4 mt-1 space-y-3">{children}</ul>
    ),
    oList: ({ children }: any) => (
        <ol className="mb-4 mt-1 space-y-3">{children}</ol>
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
    preformatted: ({ node }: any) => (
        <pre className="bg-gray-900 text-blue-100 p-6 my-8 rounded-2xl overflow-x-auto font-mono text-sm leading-relaxed shadow-xl border border-gray-800 group relative">
            <div className="absolute top-4 right-4 text-gray-500 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                CODE
            </div>
            <code className="block w-full text-blue-100">{node.text}</code>
        </pre>
    ),
    label: ({ node, children }: any) => {
        if (node.data.label === 'section-line' || node.data.label === 'divider') {
            return <hr className="my-16 border-t-2 border-gray-100 w-1/2 mx-auto" />;
        }
        if (node.data.label === 'code' || node.data.label === 'inlinecode') {
            return (
                <code className="bg-blue-50/50 text-blue-600 px-1.5 py-0.5 rounded-md font-mono text-[0.9em] border border-blue-100/50 break-words">
                    {children}
                </code>
            );
        }
        return <span className={node.data.label}>{children}</span>;
    },
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
        <div className={`max-w-none ${className}`}>
            <PrismicRichText field={field} components={richTextComponents} />
        </div>
    );
}
