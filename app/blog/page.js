import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Image from 'next/image';

export default async function Blog() {
  const posts = await getPosts();
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Blog</h1>
      
      {posts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600 dark:text-gray-400">No hay artículos publicados todavía.</p>
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

async function getPosts() {
  const postsDirectory = path.join(process.cwd(), 'content/blog');
  let files;
  
  try {
    files = fs.readdirSync(postsDirectory);
  } catch (e) {
    console.log('Blog directory not found or empty');
    return [];
  }
  
  const posts = files
    .filter((filename) => filename.endsWith('.md'))
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      
      return {
        slug: filename.replace('.md', ''),
        title: data.title,
        date: new Date(data.date).toLocaleDateString(),
        thumbnail: data.thumbnail,
        description: data.description,
        category: data.category,
        tags: data.tags || [],
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return posts;
}