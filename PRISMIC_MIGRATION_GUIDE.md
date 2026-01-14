# Prismic Multi-Locale Blog Migration Guide

## Overview

This guide will help you complete the migration from Notion API to Prismic CMS with full multi-locale support (English & Japanese).

## What's Been Implemented

### ✅ Core Infrastructure
- **Prismic Client Configuration** (`prismicio.ts`)
- **Multi-Locale Support** (`src/lib/locales.ts`)
- **Prismic Blog Library** (`src/lib/prismic-blog.ts`)
- **Enhanced SEO Utilities** with hreflang support
- **Middleware** for automatic locale detection

### ✅ Components
- **PrismicContent** - Beautiful rich text renderer
- **LanguageSwitcher** - Elegant locale switcher

### ✅ Pages
- English blog listing (`/blog`)
- Japanese blog listing (`/ja/blog`)
- English blog post detail (`/blog/[slug]`)
- Japanese blog post detail (`/ja/blog/[slug]`)

## Setup Steps

### 1. Create Prismic Account & Repository

1. Go to [prismic.io](https://prismic.io) and create an account
2. Create a new repository (suggested name: `fuminozawa-portfolio`)
3. Note your repository name for the next step

### 2. Update Configuration

Update `slicemachine.config.json` with your actual repository name:

```json
{
  "repositoryName": "YOUR_REPOSITORY_NAME",
  "adapter": "@slicemachine/adapter-next",
  "libraries": ["./slices"],
  "localSliceSimulatorURL": "http://localhost:3000/slice-simulator",
  "apiEndpoint": "https://YOUR_REPOSITORY_NAME.cdn.prismic.io/api/v2"
}
```

### 3. Add Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_PRISMIC_ENVIRONMENT=YOUR_REPOSITORY_NAME
```

### 4. Set Up Prismic Content Model

#### Install Slice Machine (Optional but Recommended)

```bash
npm install --save-dev @slicemachine/adapter-next slice-machine-ui
```

#### Create Blog Post Custom Type

In your Prismic dashboard:

1. Go to **Custom Types**
2. Create a new **Repeatable Type** called `blog_post`
3. Add the following fields:

**Main Tab:**
- `title` - Title (required)
- `description` - Rich Text (single line)
- `published_date` - Date
- `featured_image` - Image
- `content` - Rich Text (allow all formatting)

**Settings:**
- Enable **Locales**: `en-us` (English - United States) and `ja-jp` (Japanese - Japan)
- Set `en-us` as the default locale

### 5. Migrate Your Content

#### Option A: Manual Migration
1. Open your Prismic dashboard
2. Create new blog posts in both English and Japanese
3. Use the same UID for related posts in different locales

#### Option B: Automated Migration (Recommended)

Create a migration script to transfer content from Notion to Prismic. Here's a template:

```typescript
// scripts/migrate-notion-to-prismic.ts
import { getBlogPosts as getNotionPosts } from '@/lib/notion';
import * as prismic from '@prismicio/client';

async function migrate() {
  const notionPosts = await getNotionPosts();
  const prismicClient = prismic.createClient('YOUR_REPOSITORY_NAME', {
    accessToken: 'YOUR_PRISMIC_ACCESS_TOKEN',
  });

  for (const post of notionPosts) {
    // Create document in Prismic
    // You'll need to use Prismic's Writing API
    console.log(`Migrating: ${post.title}`);
  }
}

migrate();
```

### 6. Test Locale Detection

The middleware automatically redirects users to the appropriate locale:

- Japanese browser → `/ja/blog`
- Other languages → `/blog`

Test by:
1. Changing your browser language settings
2. Visiting `/blog`
3. Verifying the redirect behavior

### 7. Update Sitemap (Optional)

Update `src/app/sitemap.ts` to include both locale versions:

```typescript
import { getBlogPosts } from '@/lib/prismic-blog';

export default async function sitemap() {
  const [enPosts, jaPosts] = await Promise.all([
    getBlogPosts('en-us'),
    getBlogPosts('ja-jp'),
  ]);

  const blogUrls = [
    ...enPosts.map(post => ({
      url: `https://fuminozawa-info.site/blog/${post.slug}`,
      lastModified: post.updatedDate || post.publishedDate,
      alternates: {
        languages: {
          en: `https://fuminozawa-info.site/blog/${post.slug}`,
          ja: `https://fuminozawa-info.site/ja/blog/${post.slug}`,
        },
      },
    })),
    ...jaPosts.map(post => ({
      url: `https://fuminozawa-info.site/ja/blog/${post.slug}`,
      lastModified: post.updatedDate || post.publishedDate,
      alternates: {
        languages: {
          en: `https://fuminozawa-info.site/blog/${post.slug}`,
          ja: `https://fuminozawa-info.site/ja/blog/${post.slug}`,
        },
      },
    })),
  ];

  return blogUrls;
}
```

### 8. Remove Old Notion Dependencies (After Testing)

Once everything is working:

```bash
npm uninstall @notionhq/client
```

Remove or archive:
- `src/lib/notion.ts`
- Old blog pages (already overwritten)

## SEO Features

### Implemented SEO Enhancements

✅ **Hreflang Tags** - Automatic alternate language URLs
✅ **Locale-Specific Open Graph** - Proper og:locale tags
✅ **JSON-LD Structured Data** - With language support
✅ **Canonical URLs** - Per locale
✅ **Meta Descriptions** - Locale-aware
✅ **Twitter Cards** - With proper metadata

### Testing SEO

Use these tools to verify:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## Locale Detection Flow

1. User visits `/blog`
2. Middleware checks `Accept-Language` header
3. If Japanese → redirect to `/ja/blog`
4. If other → stay on `/blog`

## Language Switcher

The `LanguageSwitcher` component:
- Shows available translations
- Grays out unavailable locales
- Maintains the current path when switching

## Troubleshooting

### Images Not Loading
- Verify Prismic domains in `next.config.js`
- Check image URLs in Prismic dashboard

### Locale Not Detected
- Clear browser cache
- Check middleware configuration
- Verify `Accept-Language` header

### Build Errors
- Ensure all environment variables are set
- Check Prismic repository is accessible
- Verify custom type schema matches code

### Content Not Showing
- Confirm documents are published in Prismic
- Check locale settings match (`en-us`, `ja-jp`)
- Verify API endpoint in configuration

## Next Steps

1. **Set up Prismic repository** and custom types
2. **Migrate content** from Notion to Prismic
3. **Test both locales** thoroughly
4. **Update sitemap** with new structure
5. **Remove Notion dependencies**
6. **Deploy and monitor**

## Benefits of This Setup

✅ **Better SEO** - Proper hreflang, structured data
✅ **User Experience** - Automatic language detection
✅ **Content Management** - Prismic's modern CMS interface
✅ **Performance** - Static generation with ISR
✅ **Scalability** - Easy to add more locales
✅ **Modern Stack** - Latest Next.js 15 features

## Support

For issues or questions:
- Check Prismic documentation: https://prismic.io/docs
- Review Next.js i18n guide: https://nextjs.org/docs/app/building-your-application/routing/internationalization
