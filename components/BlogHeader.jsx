"use client";
import { BLOG_CATEGORIES } from "@/lib/config";
import { useTheme } from "@/providers/ThemeProvider";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const BlogHeader = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toggleTheme, theme } = useTheme();

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

  // Manejar búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
      setShowSearchInput(false);
      setSearchTerm("");
    }
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

          <div className="hidden md:flex space-x-6">
            {BLOG_CATEGORIES.map((category, index) => (
              <Link
                key={index}
                href={`/blog/category/${category.slug}`}
                style={{ color: textColor }}
                className="transition-colors font-medium"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {category.title}
              </Link>
            ))}
          </div>

          <div className="flex items-center">
            {/* Input de búsqueda desplegable */}
            {showSearchInput ? (
              <form 
                onSubmit={handleSearch} 
                className="relative mr-2 transition-all duration-300 ease-in-out"
              >
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar artículos..."
                  className="py-1 pl-3 pr-8 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors duration-200 w-48 md:w-56"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowSearchInput(false)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                className="p-2 rounded-full focus:outline-none transition-colors mr-2"
                aria-label="Buscar"
                title="Buscar artículos"
                style={{ color: textColor }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </button>
            )}

            {/* Botón de tema */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full focus:outline-none transition-colors mr-2"
              aria-label="Toggle dark mode"
            >
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
                    strokeLinejoin="round"
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
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* Botón de menú móvil */}
            <div className="block md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center p-2 rounded focus:outline-none"
                aria-label="Toggle menu"
                style={{ color: textColor }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {!isOpen ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-2 transition-all duration-300 ease-in-out">
            <div className="flex flex-col space-y-3">
              {/* Búsqueda móvil */}
              <div className="pb-2 border-b border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar artículos..."
                    className="flex-1 py-2 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors duration-200"
                  />
                  <button
                    type="submit"
                    className="ml-2 p-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors duration-200"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                      />
                    </svg>
                  </button>
                </form>
              </div>

              {/* Enlaces de navegación móvil */}
              {BLOG_CATEGORIES.map((category, index) => (
                <Link
                  key={index}
                  href={`/blog/category/${category.slug}`}
                  style={{ color: textColor }}
                  className="transition-colors font-medium"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => setIsOpen(false)}
                >
                  {category.title}
                </Link>
              ))}
              <Link 
                href="/" 
                style={{ color: textColor }}
                className="transition-colors font-medium"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => setIsOpen(false)}
              >
                Portfolio
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default BlogHeader;