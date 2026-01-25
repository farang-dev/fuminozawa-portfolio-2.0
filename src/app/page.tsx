import { getBlogPosts } from '@/lib/prismic-blog';
import HomeClient from './HomeClient';
import type { Metadata } from 'next';
import { generateWebsiteJSONLD, generateSEOMetadata } from '@/lib/seo';
import { getAlternateUrls } from '@/lib/locales';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const tab = params.tab as string | undefined;

  const tabTitles: Record<string, string> = {
    services: "Services",
    works: "Works & Portfolio",
    writing: "Blog & Thoughts",
    links: "Connect & Links",
  };

  const baseTitle = "Fumi Nozawa | Freelance Digital Marketer & Web Engineer (Japan/Global)";
  const title = tab && tabTitles[tab] ? `${tabTitles[tab]} | ${baseTitle}` : baseTitle;
  const canonical = tab ? `https://fuminozawa-info.site/?tab=${tab}` : 'https://fuminozawa-info.site';
  const alternateUrlPath = tab ? `?tab=${tab}` : '/';
  const alternateUrls = getAlternateUrls(alternateUrlPath);

  return generateSEOMetadata({
    title,
    description: "Freelance Digital Marketer & Web Engineer bridging Japan and the global market. I provide end-to-end support from Japan Market Entry and Global Expansion strategy to hands-on Web Development and AI Operations.",
    canonical,
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
      <HomeClient initialWritings={posts} initialLocale="en" />
    </>
  );
}
