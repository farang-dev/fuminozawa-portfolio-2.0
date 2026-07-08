import { InstagramMedia, getInstagramMedia } from '@/lib/instagram';
import { generateSEOMetadata, generateGalleryJSONLD, generateBreadcrumbJSONLD } from '@/lib/seo';
import type { Metadata } from 'next';
import GalleryClient from '../../gallery/GalleryClient';

export async function generateMetadata(): Promise<Metadata> {
    return generateSEOMetadata({
        title: "Gallery | Fumi Nozawa",
        description: "Photography and creative work by Fumi Nozawa. A curated collection of moments and visual stories.",
        canonical: 'https://fumi-nozawa.space/ja/gallery',
        locale: 'ja-jp',
    });
}

export default async function GalleryPage() {
    const galleryJsonLd = generateGalleryJSONLD({ locale: 'ja-jp' });
    const breadcrumbJsonLd = generateBreadcrumbJSONLD([
        { name: "ホーム", item: "https://fumi-nozawa.space/ja" },
        { name: "ギャラリー", item: "https://fumi-nozawa.space/ja/gallery" }
    ]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <div className="bg-black px-4 sm:px-6 lg:px-8 pt-20 pb-4">
                <p className="text-center text-sm text-white/60 max-w-2xl mx-auto">
                    Fumi Nozawaは、ファッションフォトグラファーとして活動しながら、地元のアーティストを支援し、出会った人々のポートレートを撮影しています。フォトグラファーとしての撮影に加え、フォトシュートのディレクション経験も有しています。
                </p>
            </div>
            <GalleryClient locale="ja" />
        </>
    );
}
