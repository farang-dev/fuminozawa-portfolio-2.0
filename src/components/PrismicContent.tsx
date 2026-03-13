import { PrismicRichText } from '@prismicio/react';
import Image from 'next/image';
import Link from 'next/link';
import PrismicCodeBlock from './PrismicCodeBlock';

/**
 * Custom components for rendering Prismic rich text
 */
export const richTextComponents: any = {
    heading1: ({ children }: any) => (
        <h1 className="max-w-2xl mx-auto text-3xl sm:text-4xl font-bold text-gray-900 mt-14 mb-6 tracking-tight">
            {children}
        </h1>
    ),
    heading2: ({ children }: any) => (
        <h2 className="max-w-2xl mx-auto text-2xl sm:text-3xl font-semibold text-gray-900 mt-16 mb-8 tracking-tight border-t pt-8 border-gray-100">
            {children}
        </h2>
    ),
    heading3: ({ children }: any) => (
        <h3 className="max-w-2xl mx-auto text-xl sm:text-2xl font-semibold text-gray-900 mt-14 mb-6">
            {children}
        </h3>
    ),
    paragraph: ({ children }: any) => (
        <p className="max-w-2xl mx-auto text-gray-800 leading-[1.8] mb-8 text-base sm:text-lg last:mb-0">
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
        <li className="text-gray-800 leading-[1.8] ml-6 list-disc marker:text-blue-500 pl-2 [&_p]:inline [&_p]:m-0">
            {children}
        </li>
    ),
    oListItem: ({ children }: any) => (
        <li className="text-gray-800 leading-[1.8] ml-6 list-decimal marker:text-blue-500 marker:font-bold pl-2 [&_p]:inline [&_p]:m-0">
            {children}
        </li>
    ),
    list: ({ children }: any) => (
        <ul className="max-w-2xl mx-auto mb-8 mt-2 space-y-3">{children}</ul>
    ),
    oList: ({ children }: any) => (
        <ol className="max-w-2xl mx-auto mb-8 mt-2 space-y-3">{children}</ol>
    ),
    image: ({ node }: any) => {
        if (!node.url) return null;
        return (
            <figure className="my-14 flex flex-col items-center">
                <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50">
                    <Image
                        src={node.url}
                        alt={node.alt || ''}
                        width={node.dimensions?.width || 800}
                        height={node.dimensions?.height || 600}
                        className="w-full h-auto transition-transform duration-500 hover:scale-[1.02]"
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />
                </div>
                {node.alt && (
                    <figcaption className="text-gray-500 text-sm text-center mt-4 italic px-4 font-medium">
                        {node.alt}
                    </figcaption>
                )}
            </figure>
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
            className="my-14 rounded-2xl overflow-hidden shadow-lg border border-gray-100 w-full"
            dangerouslySetInnerHTML={{ __html: node.oembed.html || '' }}
        />
    ),
    quote: ({ children }: any) => (
        <blockquote className="max-w-2xl mx-auto border-l-4 border-blue-500 bg-blue-50/20 px-8 py-6 my-10 italic text-gray-700 text-xl font-light leading-[1.8] rounded-r-xl">
            {children}
        </blockquote>
    ),
    preformatted: ({ node }: any) => {
        const text = node.text;
        // Simple markdown table detection: needs at least | and | --- |
        const lines = text.trim().split('\n');
        const hasTableStructure = lines.length >= 3 &&
            lines.some((l: string) => l.includes('|')) &&
            lines.some((l: string) => l.match(/^\s*\|?\s*:?-+:?\s*\|/));

        if (hasTableStructure) {
            try {
                const separatorIndex = lines.findIndex((line: string) => line.match(/^\s*\|?\s*:?-+:?\s*\|/));
                if (separatorIndex > 0) {
                    const headerLine = lines[separatorIndex - 1];
                    const headers = headerLine.split('|')
                        .map((s: string) => s.trim())
                        .filter((s: string, i: number, arr: string[]) => (i > 0 && i < arr.length - 1) || s !== ''); // Handle optional leading/trailing |

                    const rows = lines.slice(separatorIndex + 1)
                        .map((line: string) => line.split('|')
                            .map((s: string) => s.trim())
                            .filter((s: string, i: number, arr: string[]) => (i > 0 && i < arr.length - 1) || s !== '')
                        )
                        .filter((row: string[]) => row.length > 0);

                    return (
                        <figure className="max-w-3xl mx-auto my-12 font-sans">
                            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white scrollbar-thin scrollbar-thumb-gray-200">
                                <table className="w-full text-left border-collapse min-w-[600px]">
                                    <thead className="bg-gray-50/80 border-b border-gray-200">
                                        <tr>
                                            {headers.map((h: string, i: number) => (
                                                <th key={i} className="px-6 py-4 text-sm font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
                                                    {h.replace(/\*\*/g, '')}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {rows.map((row: string[], i: number) => (
                                            <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                                                {row.map((cell: string, j: number) => (
                                                    <td key={j} className="px-6 py-4 text-sm text-gray-700 leading-[1.8]">
                                                        {cell.startsWith('**') && cell.endsWith('**') ?
                                                            <strong className="font-bold text-gray-900">{cell.slice(2, -2)}</strong> : cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <figcaption className="text-gray-400 text-[10px] mt-2 text-right uppercase tracking-[0.2em] px-2 sm:hidden font-semibold">
                                ← Scroll horizontally →
                            </figcaption>
                        </figure>
                    );
                }
            } catch (e) {
                console.error("Failed to parse markdown table", e);
            }
        }

        return (
            <div className="max-w-3xl mx-auto my-8">
                <PrismicCodeBlock text={node.text} />
            </div>
        );
    },
    label: ({ node, children }: any) => {
        if (node.data.label === 'section-line' || node.data.label === 'divider') {
            return <hr className="max-w-2xl mx-auto my-16 border-t-2 border-gray-100" />;
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
    hr: () => <hr className="max-w-2xl mx-auto my-16 border-t-2 border-gray-100" />,
    table: ({ children }: any) => (
        <figure className="max-w-3xl mx-auto my-12">
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white scrollbar-thin scrollbar-thumb-gray-200">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    {children}
                </table>
            </div>
            <figcaption className="text-gray-400 text-[10px] mt-2 text-right uppercase tracking-[0.2em] px-2 sm:hidden font-semibold">
                ← Scroll horizontally →
            </figcaption>
        </figure>
    ),
    thead: ({ children }: any) => (
        <thead className="bg-gray-50/80 border-b border-gray-200">
            {children}
        </thead>
    ),
    tbody: ({ children }: any) => (
        <tbody className="divide-y divide-gray-100 bg-white">
            {children}
        </tbody>
    ),
    tr: ({ children }: any) => (
        <tr className="hover:bg-gray-50/30 transition-colors">
            {children}
        </tr>
    ),
    th: ({ children }: any) => (
        <th className="px-6 py-4 text-sm font-bold text-gray-900 uppercase tracking-wider whitespace-nowrap">
            {children}
        </th>
    ),
    td: ({ children }: any) => (
        <td className="px-6 py-4 text-sm text-gray-700 leading-[1.8] border-t border-gray-100">
            {children}
        </td>
    ),
    heading4: ({ children }: any) => (
        <h4 className="max-w-2xl mx-auto text-lg sm:text-xl font-semibold text-gray-900 mt-10 mb-4">
            {children}
        </h4>
    ),
    heading5: ({ children }: any) => (
        <h5 className="max-w-2xl mx-auto text-base sm:text-lg font-semibold text-gray-900 mt-8 mb-3">
            {children}
        </h5>
    ),
    heading6: ({ children }: any) => (
        <h6 className="max-w-2xl mx-auto text-sm sm:text-base font-semibold text-gray-900 mt-8 mb-3 uppercase tracking-wide">
            {children}
        </h6>
    ),
};

/**
 * Pre-processes Prismic rich text field to detect and merge consecutive markdown table paragraphs.
 */
function preprocessRichText(field: any) {
    if (!Array.isArray(field)) return field;

    const processed: any[] = [];
    let currentTableRows: any[] = [];

    const isTableLine = (node: any) => {
        if (node.type !== 'paragraph' || !node.text) return false;
        const trimmed = node.text.trim();
        // Check if it starts with | or contains multiple |
        return trimmed.startsWith('|') || (trimmed.includes('|') && trimmed.split('|').length > 1);
    }

    const flushTable = () => {
        if (currentTableRows.length > 0) {
            // Check if current rows actually form a valid table (min 2 lines, has separator)
            const combinedText = currentTableRows.map((n: any) => n.text).join('\n');
            const lines = combinedText.split('\n');
            const hasSeparator = lines.some((l: string) => l.match(/^\s*\|?\s*:?-+:?\s*\|/));

            if (currentTableRows.length >= 2 && hasSeparator) {
                processed.push({
                    type: 'preformatted',
                    text: combinedText,
                    spans: []
                });
            } else {
                // Not a valid table structure, keep as paragraphs
                processed.push(...currentTableRows);
            }
            currentTableRows = [];
        }
    };

    for (const node of field) {
        if (isTableLine(node)) {
            currentTableRows.push(node);
        } else {
            flushTable();
            processed.push(node);
        }
    }
    flushTable();

    return processed;
}

interface PrismicContentProps {
    field: any;
    className?: string;
}

/**
 * Component for rendering Prismic rich text content
 */
export default function PrismicContent({ field, className = '' }: PrismicContentProps) {
    if (!field) return null;

    // Pre-process field to handle markdown tables pasted as paragraphs
    const processedField = preprocessRichText(field);

    return (
        <div className={`max-w-none ${className}`}>
            <PrismicRichText field={processedField} components={richTextComponents} />
        </div>
    );
}

