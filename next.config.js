/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prismic webhook requirement: allow POST requests
  skipTrailingSlashRedirect: true,
  images: {
    // unoptimized: true, // Commented out to potentially fix 405 issues on revalidate if related to image processing middleware interference
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
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'fuminozawa-info.site',
          },
        ],
        destination: 'https://fumi-nozawa.space/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.fuminozawa-info.site',
          },
        ],
        destination: 'https://fumi-nozawa.space/:path*',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/news/:slug',
        destination: '/blog/:slug',
      },
      {
        source: '/ja/news/:slug',
        destination: '/ja/blog/:slug',
      },
    ];
  },
};

module.exports = nextConfig;
