# Prismic Works Migration Guide

This guide helps you migrate your portfolio works from hardcoded files to Prismic.

## 1. Create Custom Type "Work"

1. Go to **Slice Machine** or **Prismic Dashboard** > **Custom Types**.
2. Create a new Custom Type:
   - **Label**: Work
   - **ID**: `work`
   - **Repeatable**: Yes
3. Use the JSON schema provided in `prismic-custom-type-work.json` in your project root.
   - If using Slice Machine, you can copy the JSON content into the JSON editor tab of the Custom Type.

## 2. Add Content (Migration Data)

Add the following items to Prismic as new "Work" documents.
**Note:** You will need to upload images for each work item manually.

### Categories (Select Options)
When adding content, choose one of these keys for the "Category" field:
- `strategic_marketing`
- `social_media`
- `creative_direction`
- `data_visualization`
- `web_projects`

### Items List (English)

| Order | Category | Title | Link |
|-------|----------|-------|------|
| 1 | `strategic_marketing` | EIRE Systems Corporate Website Relaunch | `https://www.eiresystems.com/ja/` |
| 2 | `strategic_marketing` | AXIORY Forex Broker Japan | `https://www.axiory.com/jp/` |
| 3 | `strategic_marketing` | Boucheron Japan E-commerce | `https://www.boucheron.com/ja_jp/` |
| 4 | `strategic_marketing` | Forex Product Website Management... | `https://www.axiory.com/jp/trading-products/clash-cfds` |
| 5 | `strategic_marketing` | High Jewelry Collection Campaign... | `https://www.boucheron.com/ja_jp/high-jewelry/collections-carte-blanche/ailleurs` |
| 6 | `strategic_marketing` | Sustainability Program (Boucheron) | `https://www.boucheron.com/ja_jp/our-maison/sustainability` |
| 7 | `strategic_marketing` | Advertising Campaign (Boucheron) | `https://www.boucheron.com/ja_jp/our-maison/the-sense-of-style/the-quatre-icon` |
| 8 | `strategic_marketing` | Amazon Prime Day (Computer Futures) | `https://www.amazon.co.jp/primeday` |
| 9 | `social_media` | Boucheron Japan Social Media | `https://page.line.me/625rfwps` |
| 10 | `social_media` | Paul Smith Japan Social Media | `https://www.instagram.com/paulsmithjapan/` |
| 11 | `creative_direction` | Paul Smith Japan Instagram Direction | `https://www.instagram.com/p/CEoUtZADLyG/?img_index=1` |
| 12 | `creative_direction` | Red Ear Campaign | `https://www.paulsmith.co.jp/stories/aw19/red-ear` |
| 13 | `creative_direction` | Personal Photography | `/gallery` |
| 14 | `data_visualization` | Looker Studio Dashboard | `https://lookerstudio.google.com/...` |
| 15 | `web_projects` | Save GPT | `https://chromewebstore.google.com/detail/save-gpt/...` |
| 16 | `web_projects` | GenAI ✖️ PLP | `https://balenciaga-ambassador-clone.vercel.app/` |
| 17 | `web_projects` | Unmanned Newsroom - AI powered | `https://www.unmanned-newsroom.com/` |
| 18 | `web_projects` | Georgia News - AI powered | `https://georgia-news-japan.online/` |

**Don't forget to create the Japanese versions interchangeably!**
(Use the locales feature in Prismic to switch to Japanese and fill in Japanese content).

## 3. Verify on Frontend

Once you publish content in Prismic, it should automatically appear on the site.
If no content is found in Prismic, the site falls back to the hardcoded data (legacy mode).
