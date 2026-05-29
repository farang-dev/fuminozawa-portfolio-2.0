/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://fumi-nozawa.space',
  generateRobotsTxt: true,
  outDir: 'public',
}