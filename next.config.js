/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
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
    ],
  },
};

module.exports = nextConfig;
