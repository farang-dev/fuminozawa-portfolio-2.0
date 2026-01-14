# Quick Start Guide - Prismic Multi-Locale Blog

## 🚀 Getting Started in 5 Steps

### Step 1: Create Prismic Repository (5 minutes)

1. Go to [prismic.io](https://prismic.io) and sign up/login
2. Click "Create repository"
3. Choose a name (e.g., `fuminozawa-portfolio`)
4. Select "Blank project"
5. Click "Create repository"

### Step 2: Set Up Custom Type (3 minutes)

1. In your Prismic dashboard, go to **Custom Types**
2. Click "Create new"
3. Select "Repeatable Type"
4. Name it `blog_post`
5. Click "Create"
6. In the JSON editor, paste the contents of `prismic-custom-type-blog-post.json`
7. Click "Save"

### Step 3: Configure Locales (2 minutes)

1. In Prismic dashboard, go to **Settings** → **Translations & locales**
2. Add locale: `en-us` (English - United States) - set as default
3. Add locale: `ja-jp` (Japanese - Japan)
4. Click "Save"

### Step 4: Add Environment Variable (1 minute)

Create or update `.env.local`:

```env
NEXT_PUBLIC_PRISMIC_ENVIRONMENT=your-repository-name
```

Replace `your-repository-name` with the name you chose in Step 1.

### Step 5: Create Your First Post (5 minutes)

1. In Prismic dashboard, click "Create new" → "blog_post"
2. Fill in:
   - **UID**: `my-first-post` (URL-friendly slug)
   - **Title**: Your post title
   - **Description**: Brief summary
   - **Published Date**: Today's date
   - **Featured Image**: Upload an image (optional)
   - **Content**: Write your post
3. Click "Save"
4. Click "Publish"
5. Switch to Japanese locale (top right)
6. Translate the content
7. Click "Publish"

## ✅ Test Your Setup

Start the development server:

```bash
npm run dev
```

Visit:
- English blog: http://localhost:3000/blog
- Japanese blog: http://localhost:3000/ja/blog

## 🎨 What You'll See

- **Modern design** with gradients and animations
- **Featured images** on blog cards
- **Language switcher** in the header
- **Automatic locale detection** based on browser language
- **Beautiful rich text** rendering

## 📝 Creating More Posts

### In Prismic Dashboard:

1. Click "Create new" → "blog_post"
2. Use the same UID for related posts in different locales
3. Fill in all fields
4. Publish in both English and Japanese

### Best Practices:

- **UID**: Use lowercase, hyphens, no spaces (e.g., `my-awesome-post`)
- **Title**: Keep it concise and descriptive
- **Description**: 150-160 characters for SEO
- **Featured Image**: 1200x630px for best results
- **Published Date**: Set to actual publication date
- **Tags**: Add relevant tags for categorization

## 🔧 Troubleshooting

### "No articles found yet"
- Make sure posts are **published** (not just saved)
- Check that locale matches (en-us or ja-jp)
- Verify environment variable is set correctly

### Images not loading
- Check image URLs in Prismic
- Verify `next.config.js` has Prismic domains
- Restart dev server after config changes

### Language switcher not working
- Ensure posts have the same UID in both locales
- Check that both locales are published
- Clear browser cache

## 📚 Next Steps

1. **Migrate existing content** from Notion (see PRISMIC_MIGRATION_GUIDE.md)
2. **Customize design** in page components
3. **Add more locales** if needed (follow same pattern)
4. **Update sitemap** to include new blog URLs
5. **Deploy** and test in production

## 🎯 Key URLs

- **Prismic Dashboard**: https://prismic.io/dashboard
- **Documentation**: https://prismic.io/docs
- **Support**: https://community.prismic.io

## 💡 Tips

- Use **Slice Machine** for advanced content modeling: `npm run slicemachine`
- Enable **Preview Mode** to see unpublished changes
- Use **Webhooks** to trigger rebuilds on content changes
- Add **Tags** to organize and filter posts
- Use **Releases** for scheduled publishing

---

**Ready to go?** Start with Step 1 above! 🚀

For detailed information, see:
- `PRISMIC_MIGRATION_GUIDE.md` - Complete migration guide
- `IMPLEMENTATION_SUMMARY.md` - Technical details
- `PRISMIC_ENV_SETUP.md` - Environment configuration
