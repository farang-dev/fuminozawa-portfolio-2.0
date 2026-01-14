# Prismic Environment Setup

## Required Environment Variables

Add these to your `.env.local` file:

```env
# Prismic Configuration
NEXT_PUBLIC_PRISMIC_ENVIRONMENT=fuminozawa-portfolio
```

Replace `fuminozawa-portfolio` with your actual Prismic repository name.

## Optional Environment Variables

```env
# Only needed for private repositories or preview mode
PRISMIC_ACCESS_TOKEN=your_access_token_here
```

## Getting Your Repository Name

1. Log in to [Prismic](https://prismic.io)
2. Go to your repository settings
3. Find "Repository name" - this is what you need

## Getting an Access Token (if needed)

1. In your Prismic repository, go to **Settings** → **API & Security**
2. Under "Repository security", you can generate a permanent access token
3. Copy the token and add it to your `.env.local`

## Verifying Configuration

After adding the environment variables, restart your development server:

```bash
npm run dev
```

The Prismic client will automatically use these values.
