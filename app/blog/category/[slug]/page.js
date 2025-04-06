import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Image from 'next/image';
import { blogCategories } from '@/lib/data';

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
      <h1 className="text-3xl font-bold mb-2 dark:text-white">
        {category.title}
      </h1>
      <div className="mb-8">
        <Link href="/blog" className="text-teal-500 hover:underline">
          ← Volver a todos los artículos
        </Link>
      </div>
      
      {filteredPosts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600 dark:text-gray-400">No hay artículos en esta categoría todavía.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
              <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="relative h-48 w-full">
                  {post.thumbnail && (
                    <Image 
                      src={post.thumbnail} 
                      alt={post.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{post.date}</p>
                  <h2 className="text-xl font-semibold mb-2 dark:text-white">{post.title}</h2>
                  <p className="text-gray-700 dark:text-gray-300">{post.description}</p>
                  <div className="mt-4">
                    {post.tags && post.tags.map((tag) => (
                      <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 dark:bg-gray-700 dark:text-gray-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
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