import BlogPostCard from '@/components/BlogPostCard';
import { blogCategories } from '@/lib/data';
import fs from 'fs';
import matter from 'gray-matter';
import Link from 'next/link';
import path from 'path';

export default async function CategoryPage({ params }) {
  const { slug } = params;
  const posts = await getPosts();
  
  // Si la categoría es "todos", mostrar todos los posts
  const filteredPosts = slug === 'todos' 
    ? posts 
    : posts.filter(post => post.tags && post.tags.includes(slug));
  
  const category = blogCategories.find(cat => cat.slug === slug) || { title: 'Categoría' };
  
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

// Función para obtener todos los posts
async function getPosts() {
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
      
      // Convertir las etiquetas a un array si es una cadena o asegurarse de que sea un array
      let tags = data.tags || [];
      if (typeof tags === 'string') {
        tags = tags.split(',').map(tag => tag.trim());
      }
      
      return {
        slug,
        title: data.title || '',
        date: data.date ? new Date(data.date).toLocaleDateString() : '',
        description: data.description || '',
        thumbnail: data.thumbnail || '/images/placeholder.jpg',
        tags: tags,
      };
    })
    .sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  
  return posts;
}