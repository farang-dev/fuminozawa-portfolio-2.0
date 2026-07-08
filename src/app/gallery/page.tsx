import { InstagramMedia, getInstagramMedia } from '@/lib/instagram';
import { generateSEOMetadata, generateGalleryJSONLD, generateBreadcrumbJSONLD } from '@/lib/seo';
import type { Metadata } from 'next';
import GalleryClient from './GalleryClient';

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: "Gallery | Fumi Nozawa",
    description: "Photography and creative work by Fumi Nozawa. A curated collection of moments and visual stories.",
    canonical: 'https://fumi-nozawa.space/gallery',
    locale: 'en-us',
  });
}

export default async function GalleryPage() {
  const galleryJsonLd = generateGalleryJSONLD({ locale: 'en-us' });
  const breadcrumbJsonLd = generateBreadcrumbJSONLD([
    { name: "Home", item: "https://fumi-nozawa.space" },
    { name: "Gallery", item: "https://fumi-nozawa.space/gallery" }
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
          Fumi Nozawa is a part-time fashion photographer who supports local artists and takes photos of people he meets. Aside from taking photos, he also has experience directing photoshoots.
        </p>
      </div>
      <GalleryClient locale="en" />
    </>
  );
}