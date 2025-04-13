# Guía de Desarrollo del Portfolio

## Tabla de Contenidos
- [Stack Tecnológico](#stack-tecnológico)
- [Requisitos](#requisitos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Sistema del Blog](#sistema-del-blog)
- [CMS](#cms)
- [Tema y Estilos](#tema-y-estilos)
- [Buenas Prácticas](#buenas-prácticas)
- [Reglas de Desarrollo](#reglas-de-desarrollo)
- [Utilidades y Herramientas](#utilidades-y-herramientas)

## Stack Tecnológico
- Next.js 15.2.4
- React 19.0.0
- Tailwind CSS 4.0
- PostCSS (@tailwindcss/postcss)
- Decap CMS (anteriormente Netlify CMS)
- Unified/Remark/Rehype para procesamiento de Markdown

## Requisitos

### Requisitos del Sistema
- Node.js (versión LTS más reciente)
- npm o yarn como gestor de paquetes
- Git para control de versiones

### Requisitos del Navegador
- Navegadores modernos que soporten las últimas características CSS
- Soporte para color-mix(), @property, y cascade layers

## Estructura del Proyecto
```
portfolio-nextjs/
├── app/                      # Directorio principal de la aplicación Next.js
│   ├── admin/                # Punto de entrada para Decap CMS
│   │   └── page.js           # Página de redirección al admin
│   ├── api/                  # API routes
│   │   └── og/               # API para generar imágenes Open Graph
│   │       └── route.js      # Generador dinámico de imágenes OG
│   ├── blog/                 # Sistema del blog con rutas dinámicas
│   │   ├── category/         # Filtrado por categorías
│   │   │   └── [category]/   # Ruta dinámica para categorías
│   │   ├── [slug]/           # Rutas dinámicas para posts individuales
│   │   ├── layout.js         # Layout específico del blog
│   │   ├── metadata.js       # Configuración de metadatos del blog
│   │   └── page.js           # Página principal del blog
│   ├── favicon.ico           # Favicon del sitio
│   ├── globals.css           # Estilos globales
│   ├── layout.js             # Layout raíz de la aplicación
│   ├── page.js               # Página principal (Home)
│   └── server-sitemap.xml/   # Generación dinámica de sitemap
├── components/               # Componentes React reutilizables
│   ├── About.jsx             # Sección Sobre Mí
│   ├── AreasOfExpertise.jsx  # Áreas de especialización
│   ├── BlogHeader.jsx        # Encabezado del blog
│   ├── BlogPostCard.jsx      # Tarjeta de vista previa de artículo
│   ├── BreadcrumbNav.jsx     # Navegación de migas de pan
│   ├── CodeCopyButton.jsx    # Botón para copiar código
│   ├── Contact.jsx           # Sección de contacto
│   ├── Footer.jsx            # Pie de página
│   ├── Header.jsx            # Encabezado del sitio
│   ├── Hero.jsx              # Sección hero del landing
│   ├── Pagination.jsx        # Componente de paginación
│   ├── Portfolio.jsx         # Sección de proyectos
│   ├── SchemaOrg.jsx         # Datos estructurados para SEO
│   ├── Services.jsx          # Sección de servicios
│   ├── Testimonials.jsx      # Sección de testimonios
│   ├── Title.jsx             # Componente de título
│   ├── ui/                   # Componentes de UI reutilizables
│   └── WorkingStyle.jsx      # Sección de metodología de trabajo
├── content/                  # Contenido del blog en Markdown
│   └── blog/                 # Artículos del blog en formato .md
├── docs/                     # Documentación del proyecto
│   └── README.md             # Guía de desarrollo
├── lib/                      # Utilidades y configuración
│   ├── config.js             # Configuración centralizada del sitio
│   └── data.js               # Datos estáticos adicionales
├── providers/                # Providers de Context de React
│   └── ThemeProvider.jsx     # Gestión del tema claro/oscuro
├── public/                   # Archivos estáticos
│   ├── admin/                # Configuración de Decap CMS
│   │   ├── config.yml        # Configuración del CMS
│   │   └── index.html        # Punto de entrada del CMS
│   ├── images/               # Imágenes estáticas
│   │   ├── blog/             # Imágenes de los artículos del blog
│   │   ├── hero-image.jpg    # Imagen principal de la página Home
│   │   ├── logo.svg          # Logo del sitio
│   │   ├── og-image.jpg      # Imagen predeterminada para Open Graph
│   │   ├── placeholder.jpg   # Imagen de placeholder
│   │   ├── projects/         # Imágenes de proyectos
│   │   └── twitter-card.jpg  # Imagen para Twitter Card
│   └── pdf/                  # Archivos PDF (ej: CV)
├── .gitignore                # Archivos ignorados por Git
├── bun.lock                  # Archivo de bloqueo de dependencias de Bun
├── jsconfig.json             # Configuración de JavaScript
├── makefile                  # Makefile con scripts útiles
├── next-sitemap.config.js    # Configuración del sitemap
├── next.config.js            # Configuración de Next.js
├── next.config.mjs           # Configuración modular de Next.js
├── package-lock.json         # Archivo de bloqueo de dependencias npm
├── package.json              # Dependencias y scripts del proyecto
├── postcss.config.mjs        # Configuración de PostCSS
└── README.md                 # Readme principal del proyecto
```

Para visualizar y entender mejor la estructura completa del proyecto, puedes utilizar el comando:

```bash
make tree
```

## Sistema del Blog

El blog está implementado con una arquitectura que separa el contenido de la presentación:

### Estructura de Archivos
- Los artículos se almacenan como archivos Markdown en `content/blog/`
- Cada archivo tiene una sección de frontmatter con metadatos (título, fecha, thumbnail, descripción, etc.)
- El contenido se renderiza utilizando el pipeline unified/remark/rehype

### Características Principales
- **Paginación**: Implementada en `app/blog/page.js` con POSTS_PER_PAGE configurable
- **Categorías**: Filtrado por categorías en `/blog/category/[category]`
- **Etiquetas**: Sistema de etiquetado para clasificar contenido
- **Resaltado de código**: Usando `rehype-pretty-code` con temas para modo claro/oscuro
- **Tiempo de lectura**: Cálculo automático basado en el recuento de palabras
- **SEO optimizado**: Metadatos dinámicos para cada artículo con Open Graph y Twitter Cards
- **Botones para compartir**: Integración con redes sociales

### Renderizado de Markdown
El procesamiento de Markdown utiliza:
- `gray-matter` para extraer frontmatter
- `remark-parse` y `remark-gfm` para analizar Markdown con soporte para GitHub Flavored Markdown
- `remark-rehype` para convertir a formato HTML
- `rehype-pretty-code` para resaltado de sintaxis en bloques de código
- `rehype-stringify` para generar el HTML final

## CMS

El proyecto utiliza Decap CMS (anteriormente Netlify CMS) para la gestión de contenido:

### Configuración
- **Local Backend**: Habilitado para desarrollo local sin autenticación
- **Git Gateway**: Configurado para producción (rama main)
- **Media Folder**: Almacenamiento de imágenes en `public/images/blog`

### Colecciones
- **Blog**: Definida con los siguientes campos:
  - Título
  - Fecha de Publicación
  - Imagen de Portada
  - Descripción
  - Categoría (opciones predefinidas)
  - Contenido (editor Markdown)
  - Etiquetas

### Acceso
- En desarrollo: Accesible en `/admin`
- En producción: Redirigido a la página principal por seguridad

## Tema y Estilos

### Sistema de Temas
- **Theme Provider**: Implementado en `providers/ThemeProvider.jsx`
- **Almacenamiento**: Preferencias guardadas en localStorage
- **Detección automática**: Responde a preferencias del sistema operativo
- **Anti-parpadeo**: Script preventivo para evitar flash de contenido incorrecto al cargar

### Fuentes
- **Geist Sans**: Fuente principal para texto
- **Geist Mono**: Fuente para código y elementos monoespaciados

### Estilos
- **Tailwind CSS 4.0**: Framework de utilidades CSS
- **Diseño responsivo**: Optimizado para diferentes tamaños de pantalla
- **Transiciones**: Animaciones suaves para cambios de tema

## Buenas Prácticas

### Componentes React
- Usar componentes funcionales con hooks
- Implementar lazy loading cuando sea posible
- Mantener los componentes pequeños y enfocados
- Documentar props con JSDoc

### Tailwind CSS
- Utilizar las nuevas características de Tailwind 4.0
- Aprovechar las variables CSS nativas del tema
- Usar container queries para diseños responsivos
- Implementar la nueva paleta de colores P3

### Rendimiento
- Optimizar imágenes y assets
- Implementar code splitting
- Utilizar caching apropiadamente
- Monitorear el tamaño del bundle

## Reglas de Desarrollo

### Nomenclatura
- Componentes: PascalCase (ej: `BlogPostCard.jsx`)
- Funciones: camelCase (ej: `getPostBySlug`)
- Constantes: UPPER_SNAKE_CASE (ej: `POSTS_PER_PAGE`)
- CSS custom: kebab-case

### Git
- Commits semánticos (feat:, fix:, docs:, etc.)
- Branches por feature
- Pull requests obligatorios
- No commits directos a main/master

### Código
- ESLint para mantener consistencia
- Prettier para formateo
- Tests unitarios para componentes críticos

## Utilidades y Herramientas

### Configuración Centralizada
El archivo `lib/config.js` centraliza toda la configuración del sitio:
- Información del autor/sitio
- URLs y rutas
- Configuración del blog
- Configuración SEO
- Categorías y proyectos
- Experiencia laboral
- Navegación

### Sitemap
- Generación automática usando `next-sitemap`
- Configuración en `next-sitemap.config.js`

### Comandos Útiles
```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Linting
npm run lint

# Iniciar CMS en desarrollo
npm run cms

# Generar sitemap
npm run sitemap
```

### VSCode Extensions Recomendadas
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- GitLens

## Actualizaciones y Mantenimiento

### Versionado
- Seguir Semantic Versioning (SemVer)
- Mantener un CHANGELOG.md
- Documentar breaking changes

### Dependencias
- Revisar actualizaciones regularmente
- Mantener package.json actualizado
- Verificar compatibilidades

## Recursos y Referencias
- [Documentación de Next.js 15](https://nextjs.org/docs)
- [Tailwind CSS v4.0](https://tailwindcss.com/docs)
- [React 19 Documentation](https://react.dev/docs)
- [Decap CMS Documentation](https://decapcms.org/docs/intro/)
- [Unified/Remark/Rehype Ecosystem](https://unifiedjs.com/)
