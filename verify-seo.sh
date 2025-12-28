#!/bin/bash

# SEO Verification Script
# Run this after deploying to production

echo "🔍 SEO Verification Checklist"
echo "=============================="
echo ""

SITE_URL="https://fuminozawa-info.site"

echo "1. Checking robots.txt..."
curl -s "$SITE_URL/robots.txt" | head -20
echo ""

echo "2. Checking sitemap.xml..."
curl -s "$SITE_URL/sitemap.xml" | grep -c "<url>"
echo "URLs found in sitemap"
echo ""

echo "3. Checking blog listing page..."
curl -s "$SITE_URL/blog" | grep -o '<title>.*</title>' | head -1
echo ""

echo "4. Checking sample blog post metadata..."
curl -s "$SITE_URL/blog/2357cfa6-7265-80af-8915-cc2b7721e70e" | grep -E '(canonical|og:title|application/ld)' | head -5
echo ""

echo "5. Verifying JSON-LD structured data..."
curl -s "$SITE_URL/blog/2357cfa6-7265-80af-8915-cc2b7721e70e" | grep -o 'BlogPosting' | head -1
echo ""

echo "✅ Verification complete!"
echo ""
echo "Next steps:"
echo "1. Submit sitemap to Google Search Console: $SITE_URL/sitemap.xml"
echo "2. Request indexing for each blog URL"
echo "3. Test with Rich Results Test: https://search.google.com/test/rich-results"
echo "4. Monitor in Search Console Coverage report"
