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
    additionalSitemaps: [
      `${siteUrl}/server-sitemap.xml`,
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api/*',
        ]
      }
    ]
  },
  changefreq: 'daily',
  priority: 0.7,
}