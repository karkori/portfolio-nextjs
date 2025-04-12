import BlogPostCard from '@/components/BlogPostCard';
import fs from 'fs';
import matter from 'gray-matter';
import Link from 'next/link';
import path from 'path';
import { metadata } from './metadata';
import Pagination from '@/components/Pagination';
import { SITE_CONFIG } from '@/lib/config';

export { metadata };

// Número de posts por página
const POSTS_PER_PAGE = SITE_CONFIG.blog.postsPerPage;

export default async function Blog({ searchParams }) {
  // Obtener el número de página de los parámetros de búsqueda o usar 1 como valor predeterminado
  const currentPage = Number(searchParams?.page) || 1;
  
  // Obtener todos los posts y la información de paginación
  const { posts, totalPosts, totalPages } = await getPaginatedPosts(currentPage, POSTS_PER_PAGE);
  
  // Verificar si estamos en desarrollo
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-teal-500 mb-4 md:mb-0">Mi Blog</h1>
        
        {/* Botón para crear un nuevo artículo (visible solo en desarrollo) */}
        {isDevelopment && (
          <Link 
            href="/admin" 
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 text-white font-medium rounded-lg transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Administrar contenido
          </Link>
        )}
      </div>
      
      {posts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600 dark:text-gray-300">No hay artículos publicados todavía.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <BlogPostCard key={post.slug} post={post} priority={index < 3} />
            ))}
          </div>
          
          {/* Componente de paginación */}
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                basePath="/blog" 
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

async function getPaginatedPosts(page = 1, limit = 9) {
  const allPosts = await getPosts();
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / limit);
  
  // Asegurarse de que la página solicitada es válida
  const validPage = page < 1 ? 1 : page > totalPages ? totalPages : page;
  
  // Calcular el índice de inicio y fin para la paginación
  const startIndex = (validPage - 1) * limit;
  const endIndex = startIndex + limit;
  
  // Obtener los posts para la página actual
  const paginatedPosts = allPosts.slice(startIndex, endIndex);
  
  return {
    posts: paginatedPosts,
    totalPosts,
    totalPages,
    currentPage: validPage
  };
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