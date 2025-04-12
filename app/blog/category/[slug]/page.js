import BlogPostCard from '@/components/BlogPostCard';
import { BLOG_CATEGORIES, SITE_CONFIG } from '@/lib/config';
import fs from 'fs';
import matter from 'gray-matter';
import Link from 'next/link';
import path from 'path';
import Pagination from '@/components/Pagination';

// Número de posts por página
const POSTS_PER_PAGE = SITE_CONFIG.blog.postsPerPage;

export async function generateMetadata({ params }) {
  // Necesitamos esperar a los parámetros en Next.js 15
  params = await params;
  
  const { slug } = params;
  const category = BLOG_CATEGORIES.find(cat => cat.slug === slug) || { title: 'Categoría' };
  
  // Crear un título personalizado para la categoría
  const title = `${category.title} | Blog de ${SITE_CONFIG.title}`;
  const description = `Artículos sobre ${category.title.toLowerCase()} - Tutoriales, guías y consejos de desarrollo`;
  
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `${SITE_CONFIG.url}/blog/category/${slug}`,
      type: SITE_CONFIG.seo.openGraph.type,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(category.title)}&type=category`,
          width: 1200,
          height: 630,
          alt: `Categoría: ${category.title}`
        }
      ],
    },
    twitter: {
      card: SITE_CONFIG.seo.twitter.cardType,
      title: title,
      description: description,
      images: [`/api/og?title=${encodeURIComponent(category.title)}&type=category`],
    },
  };
}

export default async function CategoryPage({ params, searchParams }) {
  // Next.js 15 requiere que los parámetros sean esperados
  params = await params;
  
  // Obtener el número de página de los parámetros de búsqueda o usar 1 como valor predeterminado
  const currentPage = Number(searchParams?.page) || 1;
  
  const { slug } = params;
  const allPosts = await getPosts();
  
  // Si la categoría es "todos", mostrar todos los posts
  const filteredPosts = slug === 'todos' 
    ? allPosts 
    : allPosts.filter(post => post.tags && post.tags.includes(slug));
  
  // Configurar la paginación
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  
  // Asegurarse de que la página solicitada es válida
  const validPage = currentPage < 1 ? 1 : currentPage > totalPages ? totalPages : currentPage;
  
  // Calcular el índice de inicio y fin para la paginación
  const startIndex = (validPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  
  // Obtener los posts para la página actual
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
  
  const category = BLOG_CATEGORIES.find(cat => cat.slug === slug) || { title: 'Categoría' };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-4 mb-8">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-sm font-medium text-teal-500 hover:text-teal-600 dark:hover:text-teal-400"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          Volver a todos los artículos
        </Link>
        
        <h1 className="text-3xl font-bold text-teal-500">
          {category.title}
        </h1>
      </div>
      
      {filteredPosts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600 dark:text-gray-300">No hay artículos en esta categoría todavía.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
          
          {/* Componente de paginación */}
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination 
                currentPage={validPage} 
                totalPages={totalPages} 
                basePath={`/blog/category/${slug}`} 
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

async function getPosts() {
  const postsDirectory = path.join(process.cwd(), SITE_CONFIG.blog.postsDirectory);
  
  // Verificar si el directorio existe
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(postsDirectory);
  
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      // Eliminar ".md" para obtener el slug
      const slug = fileName.replace(/\.md$/, '');
      
      // Leer el contenido del archivo como string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      // Usar gray-matter para parsear el frontmatter
      const { data } = matter(fileContents);
      
      // Convertir las etiquetas a un array si es una cadena o asegurarse de que sea un array
      let tags = data.tags || [];
      if (typeof tags === 'string') {
        tags = tags.split(',').map(tag => tag.trim());
      }
      
      // Convertir la fecha a objeto Date para ordenación correcta
      const date = data.date ? new Date(data.date) : new Date();
      
      return {
        slug,
        title: data.title || '',
        date: date,
        dateFormatted: date.toLocaleDateString(),
        description: data.description || '',
        thumbnail: data.thumbnail || SITE_CONFIG.blog.defaultThumbnail,
        tags: tags,
      };
    })
    .sort((a, b) => b.date - a.date); // Ordenar de más reciente a más antiguo
  
  return posts;
}