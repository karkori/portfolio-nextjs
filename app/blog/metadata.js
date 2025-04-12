import { SITE_CONFIG } from '@/lib/config';

export const metadata = {
  title: `Blog | ${SITE_CONFIG.title}`,
  description: "Artículos técnicos sobre desarrollo web, frontend, backend, React, Next.js, Spring Boot y más tecnologías modernas.",
  keywords: ["blog desarrollo", "tutoriales programación", "react", "nextjs", "spring boot", "javascript", "java"],
  openGraph: {
    title: `Blog Técnico | ${SITE_CONFIG.title}`,
    description: "Artículos técnicos sobre desarrollo web, frontend, backend, React, Next.js, Spring Boot y más tecnologías modernas.",
    url: `${SITE_CONFIG.url}/blog`,
    siteName: SITE_CONFIG.title,
    locale: SITE_CONFIG.locale,
    type: SITE_CONFIG.seo.openGraph.type,
    images: [
      {
        url: "/api/og?title=Blog%20Técnico&type=website",
        width: 1200,
        height: 630,
        alt: `Blog de ${SITE_CONFIG.author.name}`
      }
    ],
  },
  twitter: {
    card: SITE_CONFIG.seo.twitter.cardType,
    title: `Blog Técnico | ${SITE_CONFIG.title}`,
    description: "Artículos técnicos sobre desarrollo web, frontend, backend, React, Next.js, Spring Boot y más tecnologías modernas.",
    creator: "@MostaphaKarkori",
    images: ["/api/og?title=Blog%20Técnico&type=website"],
  },
  alternates: {
    canonical: `${SITE_CONFIG.url}/blog`,
    languages: {
      'es-ES': `${SITE_CONFIG.url}/blog`,
    },
  },
};