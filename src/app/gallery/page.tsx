import { InstagramMedia, getInstagramMedia } from '@/lib/instagram';
import { generateSEOMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import GalleryClient from './GalleryClient';

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: "Gallery | Fumi Nozawa",
    description: "Photography and creative work by Fumi Nozawa. A curated collection of moments and visual stories.",
    canonical: 'https://fuminozawa-info.site/gallery',
    locale: 'en-us',
  });
}

export default async function GalleryPage() {
  // We can optionally pre-fetch media here to dehydrate to the client
  // but for now let's just keep the CSR logic in GalleryClient
  return <GalleryClient />;
}