import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Image from 'next/image';
import { blogCategories } from '@/lib/data';

export default async function Blog() {
  const posts = await getPosts();
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-secondary">Mi Blog</h1>
      
      {/* Categorías en vista móvil */}
      <div className="flex overflow-x-auto pb-4 mb-6 md:hidden">
        {blogCategories.map((category, index) => (
          <Link 
            key={index}
            href={`/blog/category/${category.slug}`}
            className="flex-shrink-0 px-4 py-2 mr-2 rounded-full bg-gray-100 text-gray-800 hover:bg-teal-500 hover:text-white dark:bg-gray-800 dark:text-secondary dark:hover:bg-teal-600"
          >
            {category.title}
          </Link>
        ))}
      </div>
      
      {posts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600 dark:text-secondary">No hay artículos publicados todavía.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
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
                  <h2 className="text-xl font-semibold mb-2 text-secondary">{post.title}</h2>
                  <p className="text-gray-700 dark:text-secondary">{post.description}</p>
                  <div className="mt-4">
                    {post.tags && post.tags.map((tag) => (
                      <Link 
                        key={tag} 
                        href={`/blog/category/${tag}`}
                        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 dark:bg-gray-700 dark:text-secondary hover:bg-teal-100 dark:hover:bg-teal-900"
                      >
                        #{tag}
                      </Link>
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