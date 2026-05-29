import { getBlogPosts } from '@/lib/prismic-blog';
import { getWorks } from '@/lib/prismic-works';
import HomeClient from './HomeClient';
import type { Metadata } from 'next';
import { generateWebsiteJSONLD, generateSEOMetadata, generateServiceJSONLD, generatePersonJSONLD, generateFAQJSONLD, generateBreadcrumbJSONLD } from '@/lib/seo';
import { getAlternateUrls } from '@/lib/locales';


export async function generateMetadata(): Promise<Metadata> {
  const alternateUrls = getAlternateUrls('/');

  return generateSEOMetadata({
    title: "Fumi Nozawa | Freelance Digital Marketer & Web Engineer (Japan/Global)",
    description: "Freelance Digital Marketer & Web Engineer bridging Japan and the global market. I provide end-to-end support from Japan Market Entry (GTM) and Global Expansion strategy to hands-on Web Development and AI Operations.",
    canonical: 'https://fumi-nozawa.space',
    locale: 'en-us',
    alternateUrls,
  });
}

export default async function Home() {
  const posts = await getBlogPosts('en-us');
  const works = await getWorks('en-us');
  const websiteJsonLd = generateWebsiteJSONLD({
    name: 'Fumi Nozawa | Digital Marketer & Developer',
    locale: 'en-us'
  });

  const serviceJsonLd = generateServiceJSONLD({
    locale: 'en-us'
  });

  const personJsonLd = generatePersonJSONLD({ locale: 'en-us' });
  const faqJsonLd = generateFAQJSONLD([
    {
      question: "Who is Fumi Nozawa?",
      answer: "Fumi Nozawa is a freelance Digital Marketer and Web Engineer bridging Japan and the global market. He specializes in SEO, GEO, and AI-driven growth strategies."
    },
    {
      question: "What services does Fumi Nozawa provide?",
      answer: "Fumi provides end-to-end support for Digital Experience, NextGen Performance (SEO/GEO), Japan Market Entry (GTM), and AI Operational Design."
    },
    {
      question: "Does Fumi Nozawa specialize in AI and GEO?",
      answer: "Yes, Fumi specializes in Generative Engine Optimization (GEO) and embedding AI into business operations to increase productivity and visibility in AI-driven search."
    }
  ]);
  const breadcrumbJsonLd = generateBreadcrumbJSONLD([
    { name: "Home", item: "https://fumi-nozawa.space" }
  ]);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <HomeClient initialWritings={posts} initialWorks={works} initialLocale="en" initialTab="services" />
    </>
  );
}
