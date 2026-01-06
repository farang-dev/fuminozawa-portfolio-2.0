import Link from 'next/link';
import { BlogPost } from '@/lib/notion';

interface RelatedPostsProps {
    currentPostId: string;
    posts: BlogPost[];
}

export default function RelatedPosts({ currentPostId, posts }: RelatedPostsProps) {
    const relatedPosts = posts
        .filter(post => post.id !== currentPostId)
        .slice(0, 3);

    if (relatedPosts.length === 0) return null;

    return (
        <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((post) => (
                    <article key={post.id} className="bg-white border rounded-lg p-5 hover:shadow-md transition-shadow">
                        <Link href={`/blog/${post.slug}`} className="group">
                            <time className="text-xs text-blue-600 font-medium mb-2 block">
                                {post.publishedDate && new Date(post.publishedDate).toLocaleDateString()}
                            </time>
                            <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                                {post.title}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {post.description}
                            </p>
                        </Link>
                    </article>
                ))}
            </div>
        </div>
    );
}
