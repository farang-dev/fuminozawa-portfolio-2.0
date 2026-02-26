import { InstagramMedia, getInstagramMedia } from '@/lib/instagram';
import { generateSEOMetadata, generateGalleryJSONLD } from '@/lib/seo';
import type { Metadata } from 'next';
import GalleryClient from '../../gallery/GalleryClient';

export async function generateMetadata(): Promise<Metadata> {
    return generateSEOMetadata({
        title: "Gallery | Fumi Nozawa",
        description: "Photography and creative work by Fumi Nozawa. A curated collection of moments and visual stories.",
        canonical: 'https://fuminozawa-info.site/ja/gallery',
        locale: 'ja-jp',
    });
}

export default async function GalleryPage() {
    const galleryJsonLd = generateGalleryJSONLD({ locale: 'ja-jp' });

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryJsonLd) }}
            />
            <GalleryClient locale="ja" />
        </>
    );
}
