import Image from 'next/image';

interface ProfileSnippetProps {
    locale: 'en' | 'ja';
}

const content = {
    en: {
        author: 'Fumi Nozawa',
        role: 'Digital Marketer & Strategist',
        bio: 'Following a career with global brands like Paul Smith and Boucheron, Fumi now supports international companies with digital strategy and market expansion. By combining marketing expertise with a deep understanding of technology, he builds solutions that drive tangible brand growth.',
        tags: ['Market Entry', 'Global Expansion', 'Web Development', 'Digital Experience', 'Brand Strategy', 'Paid Media'],
    },
    ja: {
        author: 'Fumi Nozawa',
        role: 'デジタルマーケター & ストラテジスト',
        bio: 'Paul Smith、Boucheronといったグローバルブランドでデジタルマーケティングを担当。現在は海外を拠点に、戦略設計からWeb実装までを牽引。マーケターとしての視点とテクノロジーへの理解を活かし、欧米企業の日本進出やブランド成長を支援しています。',
        tags: ['日本進出支援', '日本企業の海外進出支援', 'Web開発', 'デジタル体験', 'ブランド戦略', 'デジタル広告'],
    },
};

export default function ProfileSnippet({ locale }: ProfileSnippetProps) {
    const { author, role, bio, tags } = content[locale as keyof typeof content];

    return (
        <section className="mt-16 pt-12 border-t border-gray-100">
            <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm relative overflow-hidden group">
                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-200/20 transition-colors duration-500" />

                <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-8">
                    <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0">
                        {/* Artistic frame */}
                        <div className="absolute inset-0 bg-blue-50 rounded-[2rem] rotate-3 -z-10 group-hover:rotate-6 transition-transform duration-500 ease-out" />
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent rounded-[2rem] -rotate-2 -z-10 group-hover:-rotate-4 transition-transform duration-500 ease-out" />

                        <Image
                            src="/profile.jpg"
                            alt={author}
                            fill
                            className="rounded-[2rem] object-cover shadow-md border-2 border-white"
                        />
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                        <div className="mb-4">
                            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                                {author}
                            </h3>
                            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mt-1.5 flex items-center justify-center sm:justify-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                                {role}
                            </p>
                        </div>
                        <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-light">
                            {bio}
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center sm:justify-start gap-3">
                            {tags.map((tag) => (
                                <span key={tag} className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-white border border-gray-100 text-gray-600 shadow-sm hover:border-blue-200 hover:text-blue-600 transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
