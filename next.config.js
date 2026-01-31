/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prismic webhook requirement: allow POST requests
  skipTrailingSlashRedirect: true,
  images: {
    // unoptimized: true, // Commented out to potentially fix 405 issues on revalidate if related to image processing middleware interference
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
      "www.notion.so",
      "notion.so",
      "s3-us-west-2.amazonaws.com",
      "prod-files-secure.s3.us-west-2.amazonaws.com",
      "images.prismic.io",
      "fuminozawa-portfolio.cdn.prismic.io",
      "scontent.cdninstagram.com",
      "scontent-sea1-1.cdninstagram.com",
      "scontent-lax3-1.cdninstagram.com",
      "scontent-lax3-2.cdninstagram.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.notion.so",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "notion.so",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3-us-west-2.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.prismic.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fuminozawa-portfolio.cdn.prismic.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.cdninstagram.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.fbcdn.net",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
