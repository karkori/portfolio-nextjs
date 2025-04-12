"use client";
import { headerList } from "@/lib/data";
import { BLOG_CATEGORIES } from "@/lib/config";
import { useTheme } from "@/providers/ThemeProvider";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { toggleTheme, theme } = useTheme();
  const pathname = usePathname();
  const isBlogPage = pathname === "/blog" || pathname.startsWith("/blog/");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Definir colores base según el tema
  const textColor = theme === 'light' ? '#1f2937' : '#ffffff';
  const hoverColor = '#0d9488'; // teal-500
  
  // Manejadores de eventos hover
  const handleMouseEnter = (e) => {
    e.target.style.color = hoverColor;
  };
  
  const handleMouseLeave = (e) => {
    e.target.style.color = textColor;
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "backdrop-blur-sm shadow-lg py-2" 
          : "py-4"
      }`}
      style={{
        backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.95)'
      }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="group relative">
            <span className="text-2xl font-extrabold tracking-tight relative inline-block">
              <span className="text-teal-500">Mostapha</span>
              <span style={{ color: textColor }}>.dev</span>
              <span className={`absolute -bottom-0.5 left-0 w-0 h-0.5 ${theme === 'dark' ? 'bg-teal-400' : 'bg-indigo-600'} group-hover:w-full transition-all duration-300`}></span>
            </span>
          </Link>

          <div className="hidden md:flex space-x-4 items-center">
            {headerList.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                style={{ color: textColor }}
                className="transition-colors"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {item.title}  
              </Link>
            ))}
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200/10 transition-colors">
            {theme === "dark" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden focus:outline-none"
          >
            <svg
              style={{ color: textColor }}
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4">
            {headerList.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                style={{ color: textColor }}
                className="transition-colors py-2 block"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            
            {/* Categorías del blog en menú móvil cuando estamos en la página del blog */}
            {isBlogPage && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: theme === 'light' ? '#e5e7eb' : '#374151' }}>
                <div style={{ color: theme === 'light' ? '#6b7280' : '#9ca3af' }} className="mb-2 text-sm font-medium">
                  Categorías del Blog
                </div>
                <div className="flex flex-wrap gap-2">
                  {BLOG_CATEGORIES.map((category, index) => (
                    <Link 
                      key={index}
                      href={`/blog/category/${category.slug}`}
                      style={{ 
                        backgroundColor: theme === 'light' ? '#f3f4f6' : '#1f2937',
                        color: theme === 'light' ? '#1f2937' : '#e5e7eb'
                      }}
                      className="inline-block px-3 py-1 mb-2 text-sm rounded-full transition-colors"
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#0d9488';
                        e.target.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = theme === 'light' ? '#f3f4f6' : '#1f2937';
                        e.target.style.color = theme === 'light' ? '#1f2937' : '#e5e7eb';
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      {category.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
