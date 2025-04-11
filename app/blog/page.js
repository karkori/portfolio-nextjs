import BlogPostCard from '@/components/BlogPostCard';
import fs from 'fs';
import matter from 'gray-matter';
import Link from 'next/link';
import path from 'path';

export default async function Blog() {
  const posts = await getPosts();
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <BlogPostCard key={post.slug} post={post} priority={index < 3} />
          ))}
        </div>
      )}
    </div>
  );
}

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