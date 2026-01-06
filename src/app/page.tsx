import { getBlogPosts } from '@/lib/notion';
import HomeClient from './HomeClient';
import type { Metadata } from 'next';
import { generateWebsiteJSONLD } from '@/lib/seo';

export const metadata: Metadata = {
  title: "Fumi Nozawa - Portfolio",
  description: "Software Engineer and Marketer specializing in Next.js, SEO, and Growth Strategies. Helping brands win in Japan and global markets.",
  openGraph: {
    title: "Fumi Nozawa - Portfolio",
    description: "Software Engineer and Marketer specializing in Next.js, SEO, and Growth Strategies. Helping brands win in Japan and global markets.",
    url: 'https://fuminozawa-info.site',
    siteName: 'Fumi Nozawa',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://fuminozawa-info.site',
  },
};

export default async function Home() {
  const posts = await getBlogPosts();
  const websiteJsonLd = generateWebsiteJSONLD();

  // Person Schema for E-E-A-T
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Fumi Nozawa',
    url: 'https://fuminozawa-info.site',
    jobTitle: 'Software Engineer & Marketer',
    sameAs: [
      'https://www.linkedin.com/in/masafumi-nozawa/',
      'https://github.com/farang-dev',
      'https://x.com/fuminozawa_',
      'https://instagram.com/fumi_fumar/'
    ],
    description: 'Expert in Next.js, SEO, and Digital Marketing Strategy.'
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <HomeClient initialWritings={posts} />
    </>
  );
}
