'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface PrismicCodeBlockProps {
    text: string;
}

export default function PrismicCodeBlock({ text }: PrismicCodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <pre className="bg-gray-900 text-blue-100 p-6 my-8 rounded-2xl overflow-x-auto font-mono text-sm leading-relaxed shadow-xl border border-gray-800 group relative">
            <div className="absolute top-4 right-4 flex items-center gap-3">
                <span className="text-gray-500 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
                    Code
                </span>
                <button
                    onClick={copyToClipboard}
                    className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-blue-400 hover:bg-gray-800 transition-all border border-gray-700/50 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Copy to clipboard"
                >
                    {copied ? (
                        <Check className="w-4 h-4 text-green-400" />
                    ) : (
                        <Copy className="w-4 h-4" />
                    )}
                </button>
            </div>
            <code className="block w-full">{text}</code>
        </pre>
    );
}
