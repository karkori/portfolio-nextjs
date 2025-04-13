/**
 * Versión CommonJS de la configuración centralizada
 * Este archivo es para uso específico con scripts que utilizan require()
 */

// Información del autor/sitio
const SITE_CONFIG = {
  // Información básica del sitio
  title: "Mostapha.dev",
  titleTemplate: "%s | Mostapha.dev",
  description: "Portfolio profesional de Mostapha Bourarach, desarrollador Full Stack especializado en Java, Spring Boot, React y Next.js",
  language: "es-ES",
  locale: "es_ES",
  
  // Información del autor
  author: {
    name: "Mostapha Bourarach",
    title: "Desarrollador Full Stack",
    email: "contact@mostapha.dev",
    github: "https://github.com/karkori",
    linkedin: "https://www.linkedin.com/in/mostapha-bourarach",
    bio: "Desarrollador Full Stack con más de 6 años de experiencia en Java, Spring Boot, Angular y tecnologías cloud. Especializado en arquitecturas escalables y aplicaciones de alto rendimiento."
  },
  
  // URLs y rutas
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.mostapha.dev",
  
  // Rutas de archivos importantes
  paths: {
    cv: "/pdf/Mostapha_Bourarach_CV_Fullstack_03_27_2025.pdf",
    profileImage: "/images/hero-image.jpg",
    logo: "/images/logo.svg",
    placeholder: "/images/placeholder.jpg",
  },
  
  // Configuración del blog
  blog: {
    postsPerPage: 9,
    postsDirectory: "content/blog",
    defaultThumbnail: "/images/placeholder.jpg",
  },
  
  // Configuración SEO
  seo: {
    openGraph: {
      type: "website",
      siteName: "Mostapha.dev",
    },
    twitter: {
      cardType: "summary_large_image",
    },
    robotsTxt: {
      disallowPaths: [
        "/admin",
        "/api/*",
        "/_next/",
        "/static/images/placeholder.jpg",
        "/404",
        "/500"
      ],
      crawlDelay: {
        "AhrefsBot": 10,
        "SemrushBot": 10
      }
    }
  }
};

// Categorías del blog
const BLOG_CATEGORIES = [
  { title: "Todos", slug: "todos" },
  { title: "Backend", slug: "backend" },
  { title: "Frontend", slug: "frontend" },
  { title: "DevOps", slug: "devops" },
  { title: "Dev Tools", slug: "dev-tools" }
];

module.exports = { 
  SITE_CONFIG, 
  BLOG_CATEGORIES 
};
