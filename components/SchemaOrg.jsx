"use client";

import Script from 'next/script';

export function PersonSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Mostapha Karkori",
    "alternateName": "Mostapha.dev",
    "url": "https://mostapha.dev",
    "image": "https://mostapha.dev/images/mostapha-karkori.jpg",
    "sameAs": [
      "https://twitter.com/MostaphaKarkori",
      "https://github.com/mostapha",
      "https://linkedin.com/in/mostapha-karkori"
    ],
    "jobTitle": "Desarrollador Full Stack",
    "worksFor": {
      "@type": "Organization",
      "name": "Mostapha.dev"
    },
    "description": "Desarrollador Full Stack especializado en React, Next.js, Spring Boot y tecnologías web modernas.",
    "knowsAbout": ["React", "Next.js", "Spring Boot", "JavaScript", "Java", "Desarrollo Web"]
  };

  return (
    <Script 
      id="person-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://mostapha.dev",
    "name": "Mostapha.dev | Desarrollador Full Stack",
    "description": "Portfolio profesional de Mostapha Karkori, desarrollador Full Stack especializado en React, Next.js y Spring Boot",
    "author": {
      "@type": "Person",
      "name": "Mostapha Karkori"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://mostapha.dev/blog?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Script 
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BlogPostingSchema({ post }) {
  if (!post) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": post.thumbnail,
    "datePublished": post.date,
    "dateModified": post.modified || post.date,
    "author": {
      "@type": "Person",
      "name": "Mostapha Karkori",
      "url": "https://mostapha.dev"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Mostapha.dev",
      "logo": {
        "@type": "ImageObject",
        "url": "https://mostapha.dev/images/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://mostapha.dev/blog/${post.slug}`
    },
    "keywords": post.tags?.join(", ")
  };

  return (
    <Script 
      id="blogposting-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
