# Optimización SEO y Redes Sociales para Portfolio-NextJS

Este documento proporciona una guía completa para optimizar el SEO (Search Engine Optimization) y la integración con redes sociales de tu sitio web portfolio desarrollado con Next.js.

## Tabla de Contenidos

1. [Fundamentos de SEO en Next.js](#fundamentos-de-seo-en-nextjs)
2. [Metadatos y Etiquetas Title](#metadatos-y-etiquetas-title)
3. [Optimización para Redes Sociales (Open Graph y Twitter Cards)](#optimización-para-redes-sociales)
4. [Sitemap y Robots.txt](#sitemap-y-robotstxt)
5. [Estructura de URL y Enlaces Canónicos](#estructura-de-url-y-enlaces-canónicos)
6. [Optimización de Rendimiento y Velocidad](#optimización-de-rendimiento-y-velocidad)
7. [Estrategias para Contenido de Blog](#estrategias-para-contenido-de-blog)
8. [Seguimiento y Análisis SEO](#seguimiento-y-análisis-seo)
9. [Lista de Verificación SEO](#lista-de-verificación-seo)

## Fundamentos de SEO en Next.js

Next.js ofrece características integradas que facilitan la implementación de buenas prácticas SEO:

### Server-Side Rendering (SSR) y Static Site Generation (SSG)

**Ventaja SEO**: Los motores de búsqueda pueden indexar mejor el contenido pre-renderizado.

* **SSR** (Server-Side Rendering): Ideal para páginas con contenido dinámico que cambia frecuentemente.
  ```javascript
  // En pages/blog/[slug].js
  export async function getServerSideProps(context) {
    const { slug } = context.params;
    const post = await fetchPostData(slug);
    
    return {
      props: { post }
    };
  }
  ```

* **SSG** (Static Site Generation): Perfecto para páginas con contenido estático como la mayoría de las páginas de tu portfolio.
  ```javascript
  // En pages/index.js
  export async function getStaticProps() {
    const projectsData = await fetchProjects();
    
    return {
      props: { 
        projects: projectsData 
      },
      // Revalidar cada día
      revalidate: 86400
    };
  }
  ```

### Metadata API de Next.js 13/14

Next.js ahora proporciona una API de metadatos potente y fácil de usar:

```javascript
// layout.js o page.js 
export const metadata = {
  title: 'Mostapha.dev - Desarrollador Full Stack',
  description: 'Portfolio profesional de Mostapha Karkori, desarrollador Full Stack especializado en React, Next.js y Spring Boot',
};
```

**Para páginas dinámicas**:
```javascript
export async function generateMetadata({ params }) {
  const post = await fetchPost(params.slug);
  
  return {
    title: `${post.title} | Mostapha.dev Blog`,
    description: post.description || 'Artículo del blog de Mostapha Karkori sobre desarrollo web',
  };
}
```

## Metadatos y Etiquetas Title

### Metadatos Esenciales

Para cada página del sitio, asegúrate de incluir:

1. **Title**: Único para cada página, idealmente entre 50-60 caracteres
2. **Description**: Resumen conciso del contenido, entre 150-160 caracteres
3. **Robots**: Instrucciones para motores de búsqueda (`index,follow` por defecto)
4. **Viewport**: Para asegurar la responsividad (`width=device-width, initial-scale=1`)
5. **Canonical**: URL canónica para evitar contenido duplicado

### Implementación en Next.js

```javascript
export const metadata = {
  title: "Mostapha Karkori | Desarrollador Full Stack",
  description: "Portfolio profesional de Mostapha Karkori, especializado en desarrollo Full Stack con React, Next.js y Spring Boot.",
  robots: {
    index: true,
    follow: true
  },
  canonical: "https://mostapha.dev",
  // Otras propiedades
};
```

## Optimización para Redes Sociales

### Open Graph Protocol

El protocolo Open Graph mejora la forma en que se muestra tu contenido cuando se comparte en redes sociales como Facebook, LinkedIn y otras plataformas.

#### Propiedades Open Graph Básicas

```javascript
export const metadata = {
  openGraph: {
    title: "Mostapha Karkori | Desarrollador Full Stack",
    description: "Portfolio profesional con proyectos de desarrollo web moderno",
    url: "https://mostapha.dev",
    siteName: "Mostapha.dev",
    images: [
      {
        url: "https://mostapha.dev/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mostapha Karkori - Desarrollador Full Stack"
      }
    ],
    locale: "es_ES",
    type: "website"
  }
};
```

#### Para Páginas de Blog

```javascript
export async function generateMetadata({ params }) {
  const post = await fetchPost(params.slug);
  
  return {
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://mostapha.dev/blog/${post.slug}`,
      siteName: "Mostapha.dev Blog",
      images: [
        {
          url: post.thumbnail || "https://mostapha.dev/images/blog-default.jpg",
          width: 1200,
          height: 630,
          alt: post.title
        }
      ],
      locale: "es_ES",
      type: "article",
      publishedTime: post.date,
      authors: ["Mostapha Karkori"]
    }
  };
}
```

### Twitter Cards

Twitter tiene su propia especificación para compartir enlaces que complementa a Open Graph.

```javascript
export const metadata = {
  twitter: {
    card: "summary_large_image",
    title: "Mostapha Karkori | Desarrollador Full Stack",
    description: "Portfolio profesional con proyectos de desarrollo web moderno",
    creator: "@TuUsuarioTwitter",
    images: [
      "https://mostapha.dev/images/twitter-card.jpg"
    ]
  }
};
```

## Sitemap y Robots.txt

### Generación de Sitemap

El sitemap ayuda a los motores de búsqueda a descubrir e indexar todas las páginas de tu sitio.

Instalación de `next-sitemap`:

```bash
npm install next-sitemap
```

Configuración (`next-sitemap.config.js`):

```javascript
module.exports = {
  siteUrl: 'https://mostapha.dev',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ['/admin', '/server-sitemap.xml'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://mostapha.dev/server-sitemap.xml',
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin']
      }
    ]
  }
};
```

### Mapa del Sitio Dinámico

Para contenido dinámico como artículos de blog:

```javascript
// En pages/server-sitemap.xml/index.js
import { getServerSideSitemap } from 'next-sitemap';

export const getServerSideProps = async (ctx) => {
  const posts = await getAllPosts();
  
  const fields = posts.map((post) => ({
    loc: `https://mostapha.dev/blog/${post.slug}`,
    lastmod: post.modified || post.date,
    changefreq: 'weekly'
  }));
  
  return getServerSideSitemap(ctx, fields);
};

export default function Sitemap() {
  // No es necesario renderizar nada, esto sólo genera el XML
}
```

## Estructura de URL y Enlaces Canónicos

### URLs Amigables para SEO

- Usa URLs cortas, descriptivas y con palabras clave
- Evita ID y parámetros de consulta innecesarios
- Utiliza guiones (`-`) en lugar de guiones bajos (`_`)
- Estructura jerárquica (/blog/categoria/titulo)

### Enlaces Canónicos

Los enlaces canónicos ayudan a evitar problemas de contenido duplicado.

```javascript
export const metadata = {
  alternates: {
    canonical: 'https://mostapha.dev/blog/articulo-principal'
  }
};
```

## Optimización de Rendimiento y Velocidad

La velocidad de carga es un factor importante para el SEO. Next.js ofrece varias optimizaciones:

### Optimización de Imágenes

Utiliza el componente `next/image` para optimización automática:

```jsx
import Image from 'next/image';

<Image 
  src="/images/profile.jpg"
  alt="Mostapha Karkori"
  width={400}
  height={400}
  priority={true}  // Para imágenes above-the-fold
  quality={85}
/>
```

### Carga Diferida y División de Código

```jsx
import dynamic from 'next/dynamic';

// Componente cargado dinámicamente solo cuando es necesario
const HeavyComponent = dynamic(() => import('../components/HeavyComponent'), {
  loading: () => <p>Cargando...</p>
});
```

### Route Prefetching

Los enlaces de Next.js precargan automáticamente las rutas en el viewport:

```jsx
import Link from 'next/link';

<Link href="/blog">
  Ver todos los artículos
</Link>
```

## Estrategias para Contenido de Blog

### Estructura de Contenido

- Usa encabezados adecuadamente (H1, H2, H3)
- Incluye palabras clave relevantes de forma natural
- Escribe meta descripciones únicas para cada artículo
- Utiliza rich snippets y datos estructurados 

### Datos Estructurados (Schema.org)

Los datos estructurados ayudan a los motores de búsqueda a entender el contenido:

```javascript
export const metadata = {
  // Otros metadatos
  other: {
    'application-name': 'Mostapha.dev',
    'author': 'Mostapha Karkori'
  },
  // Schema.org para un artículo
  schema: [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': 'Título del artículo',
      'datePublished': '2025-04-11T10:45:00.000Z',
      'dateModified': '2025-04-11T10:45:00.000Z',
      'author': [{
        '@type': 'Person',
        'name': 'Mostapha Karkori',
        'url': 'https://mostapha.dev/about'
      }]
    }
  ]
};
```

## Seguimiento y Análisis SEO

### Integración con Google Analytics

```jsx
// En app/layout.js
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Configuración de Google Search Console

1. Verifica la propiedad añadiendo la meta tag en layout.js
2. Envía tu sitemap.xml
3. Monitoriza el rendimiento y problemas de indexación

## Lista de Verificación SEO

### Técnico
- [ ] Configurar metadatos para todas las páginas
- [ ] Implementar Open Graph y Twitter Cards
- [ ] Generar y enviar sitemap.xml
- [ ] Configurar robots.txt
- [ ] Optimizar velocidad de carga (Core Web Vitals)
- [ ] Asegurar que el sitio sea responsive
- [ ] Implementar URLs amigables para SEO
- [ ] Añadir enlaces canónicos donde sea necesario

### Contenido
- [ ] Optimizar títulos y meta descripciones
- [ ] Estructurar contenido con encabezados adecuados
- [ ] Incluir palabras clave relevantes
- [ ] Optimizar imágenes (alt text, tamaño)
- [ ] Implementar datos estructurados

### Análisis
- [ ] Configurar Google Analytics
- [ ] Configurar Google Search Console
- [ ] Monitorizar posiciones en resultados de búsqueda
- [ ] Rastrear e indexar páginas nuevas

---

## Recursos Adicionales

- [Documentación de Next.js sobre SEO](https://nextjs.org/docs/pages/building-your-application/optimizing/metadata)
- [Google Search Central](https://developers.google.com/search)
- [Open Graph Protocol](https://ogp.me/)
- [Schema.org](https://schema.org/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
