/** @type {import('next-sitemap').IConfig} */
const { SITE_CONFIG } = require('./lib/config');

module.exports = {
  siteUrl: SITE_CONFIG.url,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: [
    '/admin',
    '/server-sitemap.xml',
    '/api/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: SITE_CONFIG.seo.robotsTxt.disallowPaths
      },
      ...Object.entries(SITE_CONFIG.seo.robotsTxt.crawlDelay).map(([agent, delay]) => ({
        userAgent: agent,
        crawlDelay: delay
      }))
    ]
  },
  changefreq: 'daily',
  priority: 0.7,
};