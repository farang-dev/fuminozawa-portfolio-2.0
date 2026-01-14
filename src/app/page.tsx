import { getBlogPosts } from '@/lib/prismic-blog';
import HomeClient from './HomeClient';
import type { Metadata } from 'next';
import { generateWebsiteJSONLD, generateSEOMetadata } from '@/lib/seo';
import { getAlternateUrls } from '@/lib/locales';

export async function generateMetadata(): Promise<Metadata> {
  const alternateUrls = getAlternateUrls('/');

  return generateSEOMetadata({
    title: "Fumi Nozawa - Software Engineer & Marketer",
    description: "Portfolio of Fumi Nozawa, a Software Engineer and Marketer specializing in Next.js, SEO, and Growth Strategies. Helping brands win in Japan and global markets.",
    canonical: 'https://fuminozawa-info.site',
    locale: 'en-us',
    alternateUrls,
  });
}

export default async function Home() {
  const posts = await getBlogPosts('en-us');
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
