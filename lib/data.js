export const headerList = [
  {
    link: "/blog",
    title: "Blog",
  },
  {
    link: "#expertise",
    title: "Areas of Expertise",
  },
  {
    link: "#about",
    title: "About Me",
  },
  {
    link: "#myservices",
    title: "My Services",
  },
  {
    link: "#portfolio",
    title: "Portfolio",
  },
  {
    link: "#working-style",
    title: "How I Work",
  }
];

export const portfolioItems = [
  {
    id: 1,
    title: "GenAI for WordPress",
    category: "personal",
    type: "Personal",
    technologies: "Python, OpenAI API, JWT, WordPress, Blogger",
    description: "Automated solution for generating SEO-optimized articles using AI (LLMs). Takes a list of titles from JSON, generates content with OpenAI, and automatically publishes to WordPress and Blogger.",
    image: "/images/wordpress.png",
  },
  {
    id: 2,
    title: "BidMaster – Real-time Auction Platform",
    category: "personal",
    type: "Personal",
    technologies: "Spring Boot, WebFlux, Angular 19, Tailwind, Docker Compose, MinIO, ClamAV, Kafka",
    description: "Fullstack real-time auction platform similar to Wallapop. Backend in Spring WebFlux, frontend in Angular 19. Uses containers for services, with a messaging system using Kafka under development.",
    image: "/images/wallapop.jpg",
  },
  {
    id: 3,
    title: "Coding.ma – Personal Blog",
    category: "personal",
    type: "Personal",
    technologies: "WordPress, PHP, HTML, CSS, JavaScript, SEO, Google Analytics",
    description: "Technical blog for sharing development knowledge with the Arabic community. Includes YouTube channel with tutorials, articles, and SEO optimization.",
    image: "/images/codingma.png",
  },
  {
    id: 4,
    title: "Roche Microservices – Capgemini",
    category: "professional",
    type: "Professional",
    technologies: "FastAPI, Python, AWS DynamoDB, Spring Boot, WebFlux, PostgreSQL, GitHub Actions",
    description: "FastAPI microservice for secure credential retrieval from DynamoDB. Another microservice in WebFlux for real-time data processing from laboratories. Complete CI/CD pipeline automation with GitHub Actions.",
    image: "/images/roche.png",
  },
  {
    id: 5,
    title: "Banco Santander – Knowmad Mood",
    category: "professional",
    type: "Professional",
    technologies: "Angular, Spring Boot, Oracle, Excel, HTML, CSS, Material",
    description: "Development of an administrative portal for handling large volumes of data. Migration to new Angular version, Excel file uploads, persistence with Oracle.",
    image: "/images/santander.png",
  },
  {
    id: 6,
    title: "Banco Cajamar – Knowmad Mood",
    category: "professional",
    type: "Professional",
    technologies: "Angular, Spring Boot, Hexagonal Architecture",
    description: "Portal for retrieving and downloading insurance policies. Application with hexagonal architecture to improve maintainability and scalability.",
    image: "/images/cajamar.webp",
  },
  {
    id: 7,
    title: "Orange – Inetum",
    category: "professional",
    type: "Professional",
    technologies: "Apigee, Google Cloud, OAuth, JWT, Swagger, Postman",
    description: "Development of API proxies for Orange clients using Apigee. Application of security policies and access control. Functional testing to ensure integrity between environments.",
    image: "/images/orange.png",
  },
  {
    id: 8,
    title: "SNCF – Capgemini France",
    category: "professional",
    type: "Professional",
    technologies: "Spring Boot, Java, JUnit, Selenium, Cucumber, Scrum",
    description: "Development of REST APIs for backend and web apps focused on software quality. Integration of automated testing and continuous improvement practices in an agile environment.",
    image: "/images/sncf.jpg",
  },
];

export const features = [
  {
    icon: (
      <svg
        className="w-8 h-8 text-secondary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Backend Development",
    description:
      "Scalable applications with Java, Spring Boot and RESTful services for robust and high-performance systems.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-secondary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Frontend Development",
    description:
      "Modern and responsive interfaces with Angular, React and advanced web technologies for an exceptional user experience.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-secondary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
    title: "Cloud & DevOps",
    description:
      "Implementation and management in cloud environments like AWS and Google Cloud (Apigee), with CI/CD practices for fast and reliable deployments.",
  },
];

export const socialLinks = [
  { name: "Facebook", icon: "facebook", url: "#" },
  { name: "Twitter", icon: "twitter", url: "#" },
  { name: "Instagram", icon: "instagram", url: "#" },
  { name: "LinkedIn", icon: "linkedin", url: "#" },
];

export const quickLinks = [
  { name: "Home", url: "#home" },
  { name: "Areas of Expertise", url: "#expertise" },
  { name: "About Me", url: "#about" },
  { name: "My Services", url: "#myservices" },
  { name: "Portfolio", url: "#portfolio" },
  { name: "How I Work", url: "#working-style" },
  { name: "Contact Me", url: "#contact" },
];

export const servicesLinks = [
  { name: "Backend Development", url: "#myservices" },
  { name: "Frontend Development", url: "#myservices" },
  { name: "Cloud & DevOps", url: "#myservices" },
  { name: "API Development", url: "#myservices" },
  { name: "Architecture Design", url: "#myservices" },
  { name: "Technical Consulting", url: "#myservices" },
];

export const services = [
  {
    title: "Backend Development",
    description:
      "Robust and scalable backend systems using Java (Spring Boot), Python (FastAPI), or Node.js (NestJS), with clean architecture and microservices.",
    icon: "🛠️",
  },
  {
    title: "Fullstack Web Applications",
    description: "End-to-end development with Angular, React, Spring Boot, or Next.js—built for performance, maintainability, and user experience.",
    icon: "🌐",
  },
  {
    title: "Cloud & DevOps Solutions",
    description: "Setup and automation of CI/CD pipelines (GitHub Actions), Docker/Kubernetes environments, and cloud integration with AWS, Apigee or GCP.",
    icon: "☁️",
  },
  {
    title: "AI-Driven Solutions",
    description:
      "Creation of prototypes and tools using LLMs, LangChain, RAG, and AI APIs (OpenAI). Interested in integrating AI to solve real-world problems.",
    icon: "🧠",
  },
  {
    title: "Technical Blogging & Content",
    description: "Creating blogs, tutorials, and educational content tailored to the tech community (especially Arabic-speaking devs) using WordPress and Blogger with SEO best practices.",
    icon: "✍️",
  },
  {
    title: "Testing & Quality Assurance",
    description:
      "Implementation of unit, integration, and end-to-end testing strategies using JUnit, Jest, Selenium, Cucumber, and more.",
    icon: "🧪",
  },
];

export const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechStart",
    content:
      "Working with Davis was a game-changer for our business. Their team delivered exceptional results and helped us increase our online presence significantly.",
    avatar: "/images/avatar1.png",
  },
  {
    name: "Michael Chen",
    role: "Marketing Director, BrandCo",
    content:
      "The quality of work and attention to detail is outstanding. We've partnered with them on multiple projects and they consistently exceed our expectations.",
    avatar: "/images/avatar2.png",
  },
  {
    name: "Emily Rodriguez",
    role: "Founder, DesignHub",
    content:
      "Davis transformed our website into a modern, user-friendly platform that has dramatically improved our conversion rates. Highly recommended!",
    avatar: "/images/avatar2.png",
  },
];
