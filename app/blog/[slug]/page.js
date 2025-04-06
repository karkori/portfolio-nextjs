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
        <Link href="/blog" className="text-blue-600 dark:text-blue-400 mb-4 inline-block hover:underline">
          ← Volver a todos los artículos
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">{post.title}</h1>
        <div className="mb-6 text-gray-600 dark:text-gray-400">
          <span>{post.date}</span>
          {post.category && (
            <>
              <span className="mx-2">•</span>
              <span>{post.category}</span>
            </>
          )}
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
        
        <div 
          className="prose prose-lg max-w-none dark:prose-invert" 
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
        
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8">
            {post.tags.map((tag) => (
              <span 
                key={tag} 
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 dark:bg-gray-700 dark:text-gray-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

async function getPostBySlug(slug) {
  const postsDirectory = path.join(process.cwd(), 'content/blog');
  const filePath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  
  const { data, content } = matter(fileContents);
  
  const result = await remark()
    .use(html)
    .process(content);
  
  const htmlContent = result.toString();
  
  return {
    slug,
    title: data.title,
    date: new Date(data.date).toLocaleDateString(),
    thumbnail: data.thumbnail,
    category: data.category,
    tags: data.tags || [],
    content: htmlContent,
  };
}