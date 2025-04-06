import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import Image from 'next/image';
import Link from 'next/link';

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'content/blog');
  let files;
  
  try {
    files = fs.readdirSync(postsDirectory);
  } catch (e) {
    return [];
  }
  
  return files
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) => ({
      slug: filename.replace('.md', ''),
    }));
}

export default async function BlogPost({ params }) {
  const { slug } = params;
  const post = await getPostBySlug(slug);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="text-teal-500 hover:underline">
          ← Volver a todos los artículos
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">{post.title}</h1>
        <div className="mb-6 text-gray-600 dark:text-secondary">
          <span>{post.date}</span>
        </div>
        
        {post.thumbnail && (
          <div className="relative w-full h-64 md:h-96 mb-8">
            <Image 
              src={post.thumbnail} 
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
            />
          </div>
        )}
        
        {/* Etiquetas/Categorías */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-8">
            {post.tags.map((tag) => (
              <Link 
                key={tag} 
                href={`/blog/category/${tag}`}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 dark:bg-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-teal-900"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
        
        <div 
          className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-secondary dark:prose-headings:text-secondary prose-a:text-teal-600 dark:prose-a:text-teal-400 prose-p:text-secondary dark:prose-p:text-secondary prose-li:text-secondary dark:prose-li:text-secondary prose-strong:text-secondary dark:prose-strong:text-secondary prose-em:text-secondary dark:prose-em:text-secondary"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
        
        {/* Compartir artículo */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-secondary">Compartir este artículo</h3>
          <div className="flex space-x-4">
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://mostapha.dev/blog/${slug}`)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Twitter
            </a>
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://mostapha.dev/blog/${slug}`)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400"
            >
              LinkedIn
            </a>
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://mostapha.dev/blog/${slug}`)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

async function getPostBySlug(slug) {
  const fullPath = path.join(process.cwd(), 'content/blog', `${slug}.md`);
  
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Convertir Markdown a HTML
    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    // Convertir las etiquetas a un array si es una cadena
    let tags = data.tags || [];
    if (typeof tags === 'string') {
      tags = tags.split(',').map(tag => tag.trim());
    }
    
    return {
      slug,
      contentHtml,
      title: data.title || '',
      date: data.date ? new Date(data.date).toLocaleDateString() : '',
      description: data.description || '',
      thumbnail: data.thumbnail || null,
      tags: tags,
    };
  } catch (error) {
    console.error(`Error al leer el artículo ${slug}:`, error);
    return {
      slug,
      contentHtml: '<p>No se pudo cargar el contenido del artículo.</p>',
      title: 'Artículo no encontrado',
      date: '',
      description: '',
      thumbnail: null,
      tags: [],
    };
  }
}