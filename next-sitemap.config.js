/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://mostapha.dev',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: [
    '/admin',
    '/server-sitemap.xml',
    '/api/*',
  ],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://mostapha.dev/server-sitemap.xml',
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
