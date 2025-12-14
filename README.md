# Portfolio Website Template

A modern, responsive portfolio website built with Next.js 15, TypeScript, and Tailwind CSS. Features a beautiful dark/light mode, multilingual support (English/Japanese), Instagram gallery integration, and a services showcase section.

![Portfolio Preview](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- 🎨 **Modern UI/UX** - Clean, professional design with smooth animations
- 🌓 **Dark/Light Mode** - Toggle between themes with smooth transitions
- 🌍 **Multilingual** - Built-in English and Japanese language support with browser language detection
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 📸 **Instagram Gallery** - Automatic Instagram feed integration via Graph API
- 💼 **Services Showcase** - Dedicated section to highlight your services
- 📝 **Blog Integration** - Notion-powered blog posts
- 🔗 **Shareable URLs** - Direct links to specific tabs (e.g., `/?tab=services`)
- ⚡ **Performance Optimized** - Built with Next.js 15 and Turbopack

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Instagram Business Account (for gallery feature)
- Notion account (for blog feature)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio-template.git
   cd portfolio-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Notion Integration (for blog)
   NOTION_API_KEY=your_notion_integration_token
   NOTION_DATABASE_ID=your_notion_database_id
   ```

4. **Configure Instagram API** (Optional)
   
   Update the access token in `/src/app/api/instagram/route.ts`:
   ```typescript
   const accessToken = 'YOUR_INSTAGRAM_ACCESS_TOKEN';
   ```
   
   See [Instagram Setup Guide](#instagram-setup) below for detailed instructions.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Customization

### Personal Information

Edit `/src/app/page.tsx` to update:

- **Profile Information**: Name, bio chips, social links
- **Services**: Update the `services` and `servicesEn` arrays
- **Works/Projects**: Modify the `works` array
- **Contact Email**: Change `mf.nozawa@gmail.com` to your email

### Styling

- **Colors**: Edit `/src/app/globals.css` to change the color scheme
- **Fonts**: Update font imports in `/src/app/layout.tsx`
- **Dark/Light Mode**: Customize theme colors in `globals.css`

### Language Support

The site automatically detects browser language and displays:
- **Japanese** for `ja` locale users
- **English** for all other users

To add more languages, extend the language state and add translations in `page.tsx`.

## 📸 Instagram Setup

To enable the Instagram gallery feature:

### Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app (Business type)
3. Add "Instagram Graph API" product

### Step 2: Connect Instagram Business Account

1. Make sure your Instagram is a **Business** or **Creator** account
2. Connect it to a Facebook Page
3. In Instagram settings: Account → Linked accounts → Facebook

### Step 3: Get Access Token

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app
3. Add permissions:
   - `instagram_basic`
   - `pages_show_list`
   - `pages_read_engagement`
4. Generate Access Token
5. Get your Instagram Business Account ID:
   ```
   Query: me/accounts
   Then: {PAGE_ID}?fields=instagram_business_account
   ```

### Step 4: Convert to Long-Lived Token (60 days)

```bash
curl -i -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_LIVED_TOKEN"
```

### Step 5: Update the Code

Replace the token in `/src/app/api/instagram/route.ts`:
```typescript
const accessToken = 'YOUR_LONG_LIVED_TOKEN';
```

## 📚 Blog Setup (Notion)

1. **Create a Notion Integration**
   - Go to [Notion Integrations](https://www.notion.so/my-integrations)
   - Create new integration
   - Copy the Internal Integration Token

2. **Create a Database**
   - Create a new database in Notion
   - Add properties: `Title`, `Description`, `Published` (checkbox)
   - Share the database with your integration

3. **Get Database ID**
   - Open the database in Notion
   - Copy the ID from the URL: `notion.so/YOUR_WORKSPACE/DATABASE_ID?v=...`

4. **Update Environment Variables**
   ```env
   NOTION_API_KEY=secret_xxxxx
   NOTION_DATABASE_ID=xxxxx
   ```

## 🎨 Tab Structure

The portfolio includes these main sections:

1. **Links** - Social media and contact links
2. **Services** - Your service offerings (customizable)
3. **Works** - Portfolio projects and case studies
4. **Blog** - Notion-powered blog posts
5. **Gallery** - Instagram photo gallery

## 🔗 URL Parameters

You can link directly to specific tabs:
- `/?tab=services` - Services section
- `/?tab=works` - Works/Projects
- `/?tab=writing` - Blog
- `/?tab=links` - Social links

## 📱 Mobile Optimization

The site is fully responsive with:
- Optimized font sizes for mobile
- Touch-friendly navigation
- Reduced padding for better space utilization
- Lazy-loaded images for performance

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **CMS**: [Notion API](https://developers.notion.com/)
- **Instagram**: [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- **Deployment**: [Vercel](https://vercel.com/) (recommended)

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/new)
3. Import your repository
4. Add environment variables:
   - `NOTION_API_KEY`
   - `NOTION_DATABASE_ID`
5. Deploy!

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/portfolio-template/issues).

## 💬 Support

If you have any questions or need help setting up, please open an issue or reach out!

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Icons from [Font Awesome](https://fontawesome.com/)
- Inspired by modern portfolio designs

---

**Made with ❤️ by [Your Name](https://yourwebsite.com)**

*Feel free to use this template for your own portfolio!*
