/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://fuminozawa-info.site',
  generateRobotsTxt: true,
  outDir: '.next',
}