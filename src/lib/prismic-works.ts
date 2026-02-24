import { createClient } from '../../prismicio';
import * as prismic from '@prismicio/client';
import { type LocaleCode, localeCodeToPrismicLocale } from './locales';
import { fallbackWorksEn, fallbackWorksJa } from './works-data';

export interface WorkItem {
    id: string;
    uid: string;
    title: string;
    description: string;
    link: string | null;
    cta_text: string;
    category: string;
    order: number;
    featuredImage?: {
        url: string;
        alt: string;
        dimensions: {
            width: number;
            height: number;
        };
    };
    locale: LocaleCode;
}

export async function getWorks(locale: LocaleCode = 'en-us'): Promise<WorkItem[]> {
    const client = createClient();
    try {
        const prismicLocale = localeCodeToPrismicLocale(locale);
        console.log(`[Prismic] Fetching works for locale: ${prismicLocale}`);

        const works = await client.getAllByType('work', {
            lang: prismicLocale,
            orderings: [
                { field: 'my.work.order', direction: 'asc' }
            ],
        });

        console.log(`[Prismic] Found ${works.length} works for ${prismicLocale}`);

        if (works.length === 0) {
            console.log(`[Prismic] No works found, using fallback data for ${locale}`);
            return locale === 'ja-jp' ? fallbackWorksJa : fallbackWorksEn;
        }

        return works.map((work: any) => ({
            id: work.id,
            uid: work.uid!,
            title: prismic.asText(work.data.title) || 'Untitled',
            description: prismic.asText(work.data.description) || '',
            link: work.data.link?.url || null,
            cta_text: work.data.cta_text || (locale === 'ja-jp' ? '詳細を見る' : 'View Details'),
            category: work.data.category || 'other',
            order: work.data.order || 999,
            featuredImage: work.data.featured_image?.url ? {
                url: work.data.featured_image.url,
                alt: work.data.featured_image.alt || '',
                dimensions: work.data.featured_image.dimensions,
            } : undefined,
            locale,
        }));
    } catch (error) {
        console.error('Error fetching works:', error);
        // Fallback on error too
        return locale === 'ja-jp' ? fallbackWorksJa : fallbackWorksEn;
    }
}
