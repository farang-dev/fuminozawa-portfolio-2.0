import Image from 'next/image';
import Link from 'next/link';

interface ProfileSnippetProps {
    locale: 'en' | 'ja';
}

const content = {
    en: {
        author: 'Fumi Nozawa',
        role: 'Digital Marketer & Strategist',
        bio: 'Following a career with global brands like Paul Smith and Boucheron, Fumi now supports international companies with digital strategy and market expansion. By combining marketing expertise with a deep understanding of technology, he builds solutions that drive tangible brand growth.',
        tags: ['Japan Market Entry', 'Global Expansion', 'Web Development', 'Digital Experience', 'Brand Strategy', 'Paid Media'],
        link: '/?tab=services&lang=en',
        cta: "Project consultation or other inquiries?\nFeel free to reach out.",
        ctaLabel: "Contact Me",
        contactLink: '/#contact',
    },
    ja: {
        author: 'Fumi Nozawa',
        role: 'デジタルマーケター & ストラテジスト',
        bio: 'Paul Smith、Boucheronといったグローバルブランドでデジタルマーケティングを担当。現在は海外を拠点に、戦略設計からWeb実装までを牽引。マーケターとしての視点とテクノロジーへの理解を活かし、欧米企業の日本進出やブランド成長を支援しています。',
        tags: ['日本進出支援', '日本企業の海外進出支援', 'Web開発', 'デジタル体験', 'ブランド戦略', 'デジタル広告'],
        link: '/?tab=services&lang=ja',
        cta: "プロジェクトの相談、その他ご相談など、\nお気軽にお問い合わせください。",
        ctaLabel: "お問い合わせはこちら",
        contactLink: '/ja#contact',
    },
};

export default function ProfileSnippet({ locale }: ProfileSnippetProps) {
    const { author, role, bio, tags, link, cta, ctaLabel, contactLink } = content[locale];

    return (
        <section className="mt-6">
            <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm relative overflow-hidden group">
                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-200/20 transition-colors duration-500" />

                <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-8">
                    <Link href={link} className="relative w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 group/img">
                        {/* Artistic frame */}
                        <div className="absolute inset-0 bg-blue-50 rounded-[2rem] rotate-3 -z-10 group-hover:rotate-6 group-hover/img:scale-105 transition-all duration-500 ease-out" />
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent rounded-[2rem] -rotate-2 -z-10 group-hover:-rotate-4 group-hover/img:scale-105 transition-all duration-500 ease-out" />

                        <Image
                            src="/profile.jpg"
                            alt={author}
                            fill
                            className="rounded-[2rem] object-cover shadow-md border-2 border-white transition-transform duration-500 group-hover/img:scale-[1.02]"
                        />
                    </Link>

                    <div className="flex-1 text-center sm:text-left w-full">
                        <div className="mb-4">
                            <Link href={link} className="inline-block group/name">
                                <h3 className="text-2xl font-bold text-gray-900 tracking-tight group-hover/name:text-blue-600 transition-colors">
                                    {author}
                                </h3>
                            </Link>
                            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mt-1.5 flex items-center justify-center sm:justify-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                                {role}
                            </p>
                        </div>
                        <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-light">
                            {bio}
                        </p>

                        <div className="mt-8 grid grid-cols-2 sm:flex sm:flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
                            {tags.map((tag) => (
                                <span key={tag} className="inline-flex items-center justify-center px-1 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold bg-white border border-gray-100 text-gray-600 shadow-sm hover:border-blue-200 hover:text-blue-600 transition-colors break-keep">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-10 pt-8 border-t border-blue-100/50 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="w-full text-center md:text-left">
                        <p className="text-gray-700 text-base font-medium leading-relaxed [text-wrap:balance]">
                            {cta}
                        </p>
                    </div>
                    <div className="flex justify-center w-full md:w-auto">
                        <Link
                            href={contactLink}
                            className="inline-flex items-center gap-3 bg-white/40 backdrop-blur-md border border-gray-200 text-gray-900 px-10 py-4 rounded-2xl font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all duration-300 whitespace-nowrap group/btn w-full sm:w-auto justify-center"
                        >
                            {ctaLabel}
                            <span className="text-xl group-hover/btn:translate-x-1.5 transition-transform duration-300">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
