import Link from 'next/link';

interface BreadcrumbsProps {
    items: {
        label: string;
        href: string;
        active?: boolean;
    }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="mb-6 block" aria-label="Breadcrumb">
            <ol className="list-none p-0 inline">
                {items.map((item, index) => (
                    <li key={item.href} className="inline">
                        {index > 0 && (
                            <svg className="w-5 h-5 text-gray-400 mx-1 inline-block align-middle" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                            </svg>
                        )}
                        {item.active ? (
                            <span className="text-sm font-medium text-gray-500 align-middle">
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors align-middle"
                            >
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
