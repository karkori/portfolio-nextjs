import { getServerSideSitemap } from 'next-sitemap';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { SITE_CONFIG } from '@/lib/config';

export async function GET() {
  const baseUrl = SITE_CONFIG.url;
  
  // Obtener artículos del blog
  const posts = await getAllPosts();
  
  // Crear campos para el sitemap
  const fields = posts.map((post) => ({
    loc: `${baseUrl}/blog/${post.slug}`,
    lastmod: post.date instanceof Date ? post.date.toISOString() : new Date().toISOString(),
    changefreq: 'weekly',
    priority: 0.8,
  }));
  
  // Obtener categorías del blog
  const categories = [...new Set(posts.flatMap(post => post.tags || []))];
  
  // Añadir páginas de categorías al sitemap
  categories.forEach(category => {
    // Añadir la página principal de la categoría
    fields.push({
      loc: `${baseUrl}/blog/category/${category}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.7,
    });
    
    // Filtrar posts por categoría
    const categoryPosts = posts.filter(post => post.tags && post.tags.includes(category));
    
    // Calcular el número total de páginas para la paginación de esta categoría
    const totalCategoryPages = Math.ceil(categoryPosts.length / POSTS_PER_PAGE);
    
    // Añadir páginas de paginación para esta categoría
    for (let page = 2; page <= totalCategoryPages; page++) {
      fields.push({
        loc: `${baseUrl}/blog/category/${category}?page=${page}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.6,
      });
    }
  });
  
  // Calcular el número total de páginas para la paginación
  const POSTS_PER_PAGE = SITE_CONFIG.blog.postsPerPage;
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  
  // Añadir páginas de paginación al sitemap
  for (let page = 1; page <= totalPages; page++) {
    // No añadir la primera página con ?page=1 porque ya está cubierta por /blog
    if (page === 1) continue;
    
    fields.push({
      loc: `${baseUrl}/blog?page=${page}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.6,
    });
  }
  
  return getServerSideSitemap(fields);
}

async function getAllPosts() {
  const postsDirectory = path.join(process.cwd(), 'content/blog');
  
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
      
      // Convertir la fecha a objeto Date para ordenación correcta
      const date = data.date ? new Date(data.date) : new Date();
      
      return {
        slug,
        title: data.title || '',
        date: date,
        tags: data.tags || [],
      };
    })
    .sort((a, b) => b.date - a.date); // Ordenar de más reciente a más antiguo
  
  return posts;
}