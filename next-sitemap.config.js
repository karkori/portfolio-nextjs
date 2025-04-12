/** @type {import('next-sitemap').IConfig} */

// Determinar la URL base
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

module.exports = {
  siteUrl: siteUrl,
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
        disallow: [
          '/admin',
          '/api/*',
          '/_next/',
          '/static/images/placeholder.jpg',
          '/404',
          '/500'
        ]
      },
      {
        userAgent: 'AhrefsBot',
        crawlDelay: 10
      },
      {
        userAgent: 'SemrushBot',
        crawlDelay: 10
      }
    ]
  },
  changefreq: 'daily',
  priority: 0.7,
}