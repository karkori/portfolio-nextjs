"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/providers/ThemeProvider';

const BlogPostCard = ({ post, priority = false }) => {
  const { theme } = useTheme();

  // Estilos base según el tema
  const cardStyle = {
    backgroundColor: theme === 'light' ? '#ffffff' : '#1e293b', // bg-white o dark slate
    borderColor: theme === 'light' ? '#e5e7eb' : '#334155', // gray-200 o slate-700
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', // shadow-sm
    transition: 'all 0.3s ease'
  };

  const titleStyle = {
    color: theme === 'light' ? '#111827' : '#f3f4f6', // gray-900 o gray-100
  };

  const descriptionStyle = {
    color: theme === 'light' ? '#374151' : '#d1d5db', // gray-700 o gray-300
  };

  const dateStyle = {
    color: theme === 'light' ? '#6b7280' : '#9ca3af', // gray-500 o gray-400
  };

  const tagStyle = {
    backgroundColor: theme === 'light' ? '#e5e7eb' : '#374151', // gray-200 o gray-700
    color: theme === 'light' ? '#374151' : '#d1d5db', // gray-700 o gray-300
  };

  // Manejadores de hover para el título
  const handleTitleMouseEnter = (e) => {
    e.target.style.color = '#0d9488'; // teal-600
  };

  const handleTitleMouseLeave = (e) => {
    e.target.style.color = titleStyle.color;
  };

  return (
    <div className="h-full">
      <div 
        className="rounded-lg overflow-hidden transition-all duration-300 h-full flex flex-col"
        style={cardStyle}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = cardStyle.boxShadow}
      >
        <Link href={`/blog/${post.slug}`} className="block group">
          <div className="relative h-48 w-full overflow-hidden">
            {post.thumbnail && (
              <Image 
                src={post.thumbnail} 
                alt={post.title}
                fill
                priority={priority}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </div>
        </Link>
        
        <div className="p-5 flex flex-col flex-grow">
          <p style={dateStyle} className="text-sm mb-2">{post.dateFormatted || (post.date instanceof Date ? post.date.toLocaleDateString() : post.date)}</p>
          <Link href={`/blog/${post.slug}`} className="block">
            <h2 
              className="text-xl font-semibold mb-2 transition-colors line-clamp-2"
              style={titleStyle}
              onMouseEnter={handleTitleMouseEnter}
              onMouseLeave={handleTitleMouseLeave}
            >
              {post.title}
            </h2>
          </Link>
          <p style={descriptionStyle} className="line-clamp-3 mb-4 flex-grow">{post.description}</p>
          <div className="mt-auto flex flex-wrap">
            {post.tags && post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/category/${tag}`}
                className="inline-block rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 transition-colors"
                style={tagStyle}
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
