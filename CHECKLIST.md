# ✅ Prismic Migration Checklist

## Pre-Migration Checklist

- [x] Install Prismic dependencies
- [x] Create Prismic client configuration
- [x] Set up multi-locale utilities
- [x] Create Prismic blog library
- [x] Enhance SEO utilities with locale support
- [x] Create middleware for locale detection
- [x] Build PrismicContent component
- [x] Build LanguageSwitcher component
- [x] Create English blog pages
- [x] Create Japanese blog pages
- [x] Update Next.js config for Prismic images
- [x] Create comprehensive documentation

## Your Action Items

### Phase 1: Prismic Setup (15-20 minutes)

- [ ] **Create Prismic account**
  - Go to https://prismic.io
  - Sign up or log in
  - Create new repository

- [ ] **Set up custom type**
  - Go to Custom Types in Prismic dashboard
  - Create "blog_post" repeatable type
  - Import JSON from `prismic-custom-type-blog-post.json`
  - Save the custom type

- [ ] **Configure locales**
  - Go to Settings → Translations & locales
  - Add `en-us` (English - United States) as default
  - Add `ja-jp` (Japanese - Japan)
  - Save settings

- [ ] **Update environment variables**
  - Open `.env.local`
  - Add: `NEXT_PUBLIC_PRISMIC_ENVIRONMENT=your-repository-name`
  - Replace with your actual repository name
  - Save file

### Phase 2: Content Migration (varies)

- [ ] **Option A: Manual migration**
  - Create new blog posts in Prismic
  - Copy content from Notion
  - Publish in both English and Japanese
  - Use same UID for related posts

- [ ] **Option B: Automated migration**
  - Create migration script
  - Use Prismic Writing API
  - Batch import from Notion
  - Verify all content transferred

### Phase 3: Testing (30 minutes)

- [ ] **Test English blog**
  - Visit http://localhost:3000/blog
  - Verify posts load
  - Check featured images
  - Test post detail pages
  - Verify SEO metadata

- [ ] **Test Japanese blog**
  - Visit http://localhost:3000/ja/blog
  - Verify posts load
  - Check Japanese formatting
  - Test post detail pages
  - Verify locale-specific metadata

- [ ] **Test language detection**
  - Change browser language to Japanese
  - Visit /blog
  - Should redirect to /ja/blog
  - Change back to English
  - Should stay on /blog

- [ ] **Test language switcher**
  - Click language switcher
  - Verify it switches between locales
  - Check unavailable translations are grayed out
  - Verify URL changes correctly

- [ ] **Test SEO**
  - View page source
  - Check hreflang tags present
  - Verify Open Graph metadata
  - Check JSON-LD structured data
  - Validate with Google Rich Results Test

### Phase 4: Build & Deploy (15 minutes)

- [ ] **Local build test**
  ```bash
  npm run build
  ```
  - Verify build succeeds
  - Check for any errors
  - Review build output

- [ ] **Update sitemap**
  - Update `src/app/sitemap.ts`
  - Include both locale versions
  - Add hreflang to sitemap entries

- [ ] **Deploy to staging**
  - Deploy to staging environment
  - Test all functionality
  - Verify environment variables set
  - Check Prismic API connectivity

- [ ] **Deploy to production**
  - Deploy to production
  - Monitor for errors
  - Test live URLs
  - Verify all features work

### Phase 5: Post-Deployment (ongoing)

- [ ] **Submit to search engines**
  - Submit updated sitemap to Google Search Console
  - Submit to Bing Webmaster Tools
  - Request re-indexing of blog pages

- [ ] **Monitor performance**
  - Check Core Web Vitals
  - Monitor page load times
  - Review error logs
  - Track user engagement

- [ ] **Clean up old code**
  - Remove `@notionhq/client` package
  - Delete `src/lib/notion.ts`
  - Remove Notion environment variables
  - Archive old blog pages (if any)

- [ ] **Documentation**
  - Update main README.md
  - Document content creation process
  - Create style guide for blog posts
  - Train team on Prismic CMS

## Verification Checklist

### Functionality
- [ ] Blog listing loads in English
- [ ] Blog listing loads in Japanese
- [ ] Blog posts load in English
- [ ] Blog posts load in Japanese
- [ ] Featured images display correctly
- [ ] Rich text content renders properly
- [ ] Tags display correctly
- [ ] Dates format according to locale
- [ ] Language switcher works
- [ ] Auto-detection redirects correctly
- [ ] Social sharing buttons work
- [ ] Breadcrumbs navigate correctly

### SEO
- [ ] Hreflang tags present
- [ ] Canonical URLs correct
- [ ] Open Graph metadata complete
- [ ] Twitter Card metadata present
- [ ] JSON-LD structured data valid
- [ ] Meta descriptions present
- [ ] Title tags optimized
- [ ] Alt text on images

### Performance
- [ ] Pages load quickly (<3s)
- [ ] Images optimized
- [ ] Static generation working
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Lighthouse score >90

### Content
- [ ] All posts migrated
- [ ] Images transferred
- [ ] Links work correctly
- [ ] Formatting preserved
- [ ] Tags assigned
- [ ] Dates correct

## Troubleshooting Guide

### Issue: "No articles found yet"
**Solution:**
1. Check posts are published in Prismic (not just saved)
2. Verify environment variable is set correctly
3. Check locale matches (en-us or ja-jp)
4. Restart dev server

### Issue: Images not loading
**Solution:**
1. Verify Prismic domains in next.config.js (already added)
2. Check image URLs in Prismic dashboard
3. Restart dev server
4. Clear browser cache

### Issue: Language switcher not working
**Solution:**
1. Ensure posts have same UID in both locales
2. Check both locales are published
3. Verify getAlternateLocalePosts() returns data
4. Check console for errors

### Issue: Build fails
**Solution:**
1. Check all environment variables set
2. Verify Prismic repository accessible
3. Check custom type schema matches code
4. Review build logs for specific errors

### Issue: Locale detection not working
**Solution:**
1. Check middleware.ts is running
2. Verify Accept-Language header
3. Clear browser cache
4. Test with different browsers

## Success Criteria

✅ All blog posts accessible in both languages
✅ Automatic language detection working
✅ SEO metadata complete and correct
✅ Build succeeds without errors
✅ Production deployment successful
✅ Search engines can crawl all pages
✅ Performance metrics meet targets
✅ No broken links or images
✅ Mobile experience excellent
✅ Team trained on Prismic CMS

## Timeline Estimate

| Phase | Estimated Time |
|-------|----------------|
| Prismic Setup | 15-20 minutes |
| Content Migration | 1-4 hours (depends on content volume) |
| Testing | 30 minutes |
| Build & Deploy | 15 minutes |
| Post-Deployment | Ongoing |
| **Total** | **2-5 hours** |

## Support Resources

- **Quick Start**: See QUICK_START.md
- **Migration Guide**: See PRISMIC_MIGRATION_GUIDE.md
- **Architecture**: See ARCHITECTURE.md
- **Prismic Docs**: https://prismic.io/docs
- **Prismic Community**: https://community.prismic.io
- **Next.js i18n**: https://nextjs.org/docs/app/building-your-application/routing/internationalization

---

**Current Status**: ✅ Code Implementation Complete
**Next Step**: Complete Phase 1 (Prismic Setup)
**Estimated Time to Launch**: 2-5 hours

Good luck! 🚀
