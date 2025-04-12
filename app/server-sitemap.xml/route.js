import { getServerSideSitemap } from 'next-sitemap';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Obtener artículos del blog
  const posts = await getAllPosts();
  
  // Crear campos para el sitemap
  const fields = posts.map((post) => ({
    loc: `${baseUrl}/blog/${post.slug}`,
    lastmod: new Date(post.date).toISOString(),
    changefreq: 'weekly',
    priority: 0.8,
  }));
  
  // Obtener categorías del blog
  const categories = [...new Set(posts.flatMap(post => post.tags || []))];
  
  // Añadir páginas de categorías al sitemap
  categories.forEach(category => {
    fields.push({
      loc: `${baseUrl}/blog/category/${category}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.7,
    });
  });
  
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
      
      // Leer el contenido del archivo
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      // Usar gray-matter para parsear el frontmatter
      const { data } = matter(fileContents);
      
      // Convertir las etiquetas a un array si es una cadena
      let tags = data.tags || [];
      if (typeof tags === 'string') {
        tags = tags.split(',').map(tag => tag.trim());
      }
      
      return {
        slug,
        date: data.date ? data.date : new Date().toISOString(),
        tags: tags,
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return posts;
}
