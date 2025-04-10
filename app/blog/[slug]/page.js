import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';
import Image from 'next/image';
import Link from 'next/link';
import CodeCopyButton from '@/components/CodeCopyButton';
import { notFound } from 'next/navigation';

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
  // En Next.js 15.2.4, debemos esperar (await) params antes de desestructurarlo
  params = await params;
  
  // Asegurarnos de que params está disponible antes de desestructurarlo
  if (!params) {
    return notFound();
  }
  
  const { slug } = params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs y navegación mejorada */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-teal-600 dark:text-gray-200 dark:hover:text-teal-400">
                    <svg className="w-3 h-3 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                    </svg>
                    Inicio
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-3 h-3 text-gray-600 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <Link href="/blog" className="ml-1 text-sm font-medium text-gray-900 hover:text-teal-600 dark:text-gray-200 dark:hover:text-teal-400">Blog</Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 text-gray-600 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[150px] md:max-w-[250px]">{post.title}</span>
                  </div>
                </li>
              </ol>
            </nav>

            <div className="flex items-center space-x-2">
              <Link 
                href="/blog" 
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border border-teal-500 text-teal-600 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-teal-950/40 transition-all duration-200 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Volver a artículos</span>
              </Link>
              
              {post.category && (
                <Link
                  href={`/blog/category/${post.category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-gradient-to-r from-teal-500 to-teal-700 text-white hover:from-teal-600 hover:to-teal-800 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {post.category}
                </Link>
              )}
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-secondary bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
          {post.title}
        </h1>
        
        <div className="mb-8 text-gray-800 dark:text-gray-300 flex items-center font-medium">
          <span className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {post.date}
          </span>
          
          {post.readingTime && (
            <span className="inline-flex items-center ml-4 rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {post.readingTime}
            </span>
          )}
        </div>
        
        {post.thumbnail && (
          <div className="relative w-full h-72 md:h-96 mb-10 rounded-xl overflow-hidden shadow-xl">
            <Image 
              src={post.thumbnail} 
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1024px"
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-500 hover:scale-105"
            />
          </div>
        )}
        
        {/* Descripción destacada */}
        {post.description && (
          <div className="mb-10 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-teal-500 shadow-sm">
            <p className="text-lg italic text-gray-700 dark:text-gray-300">
              {post.description}
            </p>
          </div>
        )}
        
        {/* Etiquetas */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-10">
            {post.tags.map((tag) => (
              <Link 
                key={tag} 
                href={`/blog/category/${tag}`}
                className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-700 mr-2 mb-2 dark:bg-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors duration-200"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
        
        {/* Contenido del artículo con estilo específico para listas */}
        <div className="article-content">
          {/* Componente de botón de copiar */}
          <div id="code-copy-button-container">
            <CodeCopyButton />
          </div>
          <div 
            className="prose prose-lg max-w-none dark:prose-invert article-content"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </div>
        
        {/* Sección de compartir */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-6 text-secondary">Compartir este artículo</h3>
          <div className="flex flex-wrap gap-4">
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://mostapha.dev/blog/${slug}`)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center bg-[#1DA1F2] text-white px-4 py-2 rounded-md hover:bg-[#1a94e0] transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
              Twitter
            </a>
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://mostapha.dev/blog/${slug}`)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center bg-[#0A66C2] text-white px-4 py-2 rounded-md hover:bg-[#0958a8] transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              LinkedIn
            </a>
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://mostapha.dev/blog/${slug}`)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center bg-[#1877F2] text-white px-4 py-2 rounded-md hover:bg-[#166fe5] transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
              Facebook
            </a>
          </div>
        </div>
        
        {/* Autor y fecha de actualización */}
        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Última actualización: {post.date}
              </p>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Si te ha gustado este artículo, no dudes en compartirlo con tus colegas o dejar un comentario.
              </p>
            </div>
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
    
    // Configuración para rehype-pretty-code
    const options = {
      // Usa tema oscuro por defecto, asegurando compatibilidad con modo claro/oscuro
      theme: 'github-dark',
      keepBackground: false,
      // Mostrar números de línea
      onVisitLine(node) {
        // Añadir data-line para cada línea
        if (!node.properties.dataLine) {
          node.properties.dataLine = true;
        }
      },
      // Resaltar líneas específicas (opcional)
      onVisitHighlightedLine(node) {
        node.properties.className = [...(node.properties.className || []), 'highlighted'];
      },
    };
    
    // Procesar el markdown con rehype-pretty-code
    const result = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypePrettyCode, options)
      .use(rehypeStringify)
      .process(content);
    
    const contentHtml = result.toString();

    // Convertir las etiquetas a un array si es una cadena
    let tags = data.tags || [];
    if (typeof tags === 'string') {
      tags = tags.split(',').map(tag => tag.trim());
    }
    
    // Calcular tiempo de lectura (aproximado)
    const wordCount = content.split(/\s+/).length;
    const readingTime = `${Math.ceil(wordCount / 225)} min de lectura`;
    
    return {
      slug,
      contentHtml,
      title: data.title || '',
      date: data.date ? new Date(data.date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : '',
      description: data.description || '',
      thumbnail: data.thumbnail || null,
      tags: tags,
      category: data.category || null,
      readingTime,
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
      category: null,
      readingTime: '',
    };
  }
}