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
      <GalleryClient locale="en" description="Fumi Nozawa is a part-time fashion photographer who supports local artists and captures portraits of people he meets. Beyond photography, he also directs photoshoots and handles visual production from concept to completion." />
    </>
  );
}