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
            <GalleryClient locale="ja" description="Fumi Nozawaは、ファッションフォトグラファーとして活動する傍ら、地元のアーティストの支援や、出会う人々のポートレート撮影を行っています。撮影のみならず、ビジュアルディレクションにも携わり、企画から仕上げまで一貫したクリエイティブワークを手がけています。" />
        </>
    );
}
