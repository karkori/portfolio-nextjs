/**
 * Configuración centralizada del sitio web
 * Este archivo contiene todos los parámetros configurables del sitio
 */

// Información del autor/sitio
export const SITE_CONFIG = {
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
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  
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
export const BLOG_CATEGORIES = [
  { title: "Todos", slug: "todos" },
  { title: "Backend", slug: "backend" },
  { title: "Frontend", slug: "frontend" },
  { title: "DevOps", slug: "devops" },
  { title: "Dev Tools", slug: "dev-tools" }
];

// Proyectos destacados
export const FEATURED_PROJECTS = [
  {
    title: "E-commerce Platform",
    description: "Plataforma de comercio electrónico completa con pasarela de pagos, gestión de inventario y panel de administración.",
    technologies: ["Java", "Spring Boot", "React", "PostgreSQL"],
    image: "/images/projects/ecommerce.jpg",
    github: "https://github.com/karkori/ecommerce-platform",
    demo: "https://ecommerce-demo.mostapha.dev"
  },
  {
    title: "CRM System",
    description: "Sistema de gestión de relaciones con clientes con seguimiento de leads, gestión de contactos y análisis de ventas.",
    technologies: ["Next.js", "Node.js", "MongoDB", "TailwindCSS"],
    image: "/images/projects/crm.jpg",
    github: "https://github.com/karkori/crm-system",
    demo: "https://crm-demo.mostapha.dev"
  },
  {
    title: "Task Management App",
    description: "Aplicación de gestión de tareas con funcionalidades de arrastrar y soltar, recordatorios y colaboración en equipo.",
    technologies: ["React", "Firebase", "Material UI", "Redux"],
    image: "/images/projects/task-app.jpg",
    github: "https://github.com/karkori/task-management",
    demo: "https://tasks-demo.mostapha.dev"
  }
];

// Habilidades técnicas
export const SKILLS = {
  frontend: ["JavaScript", "TypeScript", "React", "Next.js", "Angular", "TailwindCSS", "Material UI", "Redux"],
  backend: ["Java", "Spring Boot", "Node.js", "Express", "REST APIs", "GraphQL"],
  database: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
  devops: ["Docker", "Kubernetes", "AWS", "CI/CD", "GitHub Actions"],
  tools: ["Git", "JIRA", "Figma", "VS Code", "IntelliJ IDEA"]
};

// Experiencia profesional
export const WORK_EXPERIENCE = [
  {
    company: "Tech Solutions Inc.",
    position: "Senior Full Stack Developer",
    period: "2022 - Presente",
    description: "Desarrollo de aplicaciones empresariales utilizando Spring Boot y React. Implementación de arquitecturas de microservicios y CI/CD pipelines.",
    technologies: ["Java", "Spring Boot", "React", "AWS", "Docker"]
  },
  {
    company: "Digital Innovations",
    position: "Full Stack Developer",
    period: "2019 - 2022",
    description: "Desarrollo de soluciones web para clientes de diversos sectores. Implementación de sistemas de e-commerce y CRM personalizados.",
    technologies: ["JavaScript", "Angular", "Node.js", "MongoDB", "Express"]
  },
  {
    company: "WebTech Studios",
    position: "Frontend Developer",
    period: "2017 - 2019",
    description: "Creación de interfaces de usuario responsivas y accesibles. Colaboración con diseñadores UX/UI para implementar experiencias de usuario óptimas.",
    technologies: ["HTML", "CSS", "JavaScript", "React", "SASS"]
  }
];

// Configuración de navegación
export const NAVIGATION = {
  main: [
    { name: "Inicio", href: "/" },
    { name: "Áreas de Experiencia", href: "/#expertise" },
    { name: "Sobre Mí", href: "/#about" },
    { name: "Servicios", href: "/#services" },
    { name: "Proyectos", href: "/#projects" },
    { name: "Cómo Trabajo", href: "/#process" },
    { name: "Blog", href: "/blog" },
    { name: "Contacto", href: "/#contact" }
  ],
  blog: [
    { name: "Todos los Artículos", href: "/blog" },
    { name: "Desarrollo Web", href: "/blog/category/desarrollo-web" },
    { name: "JavaScript", href: "/blog/category/javascript" },
    { name: "React", href: "/blog/category/react" },
    { name: "Java", href: "/blog/category/java" }
  ],
  social: [
    { name: "GitHub", href: "https://github.com/karkori", icon: "github" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/mostapha-bourarach", icon: "linkedin" }
  ]
};