"use client";
import { blogCategories } from "@/lib/data";
import { useTheme } from "@/providers/ThemeProvider";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const BlogHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-primary backdrop-blur-sm shadow-lg py-2" 
          : "bg-primary py-4"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="group relative">
            <span className="text-2xl font-extrabold tracking-tight relative inline-block">
              <span className="text-teal-500">Mostapha</span>
              <span className="text-gray-900 dark:text-white">.dev</span>
              <span className={`absolute -bottom-0.5 left-0 w-0 h-0.5 ${theme === 'dark' ? 'bg-teal-400' : 'bg-indigo-600'} group-hover:w-full transition-all duration-300`}></span>
            </span>
          </Link>

          <div className="hidden md:flex space-x-6">
            {blogCategories.map((category, index) => (
              <Link
                key={index}
                href={`/blog/category/${category.slug}`}
                className="text-gray-900 hover:text-teal-500 dark:text-white dark:hover:text-teal-400 transition-colors font-medium"
              >
                {category.title}
              </Link>
            ))}
          </div>

          <div className="flex items-center">
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

            <div className="block md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center p-2 rounded text-gray-800 dark:text-white hover:text-teal-500 dark:hover:text-teal-400 focus:outline-none"
                aria-label="Toggle menu"
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
              {blogCategories.map((category, index) => (
                <Link
                  key={index}
                  href={`/blog/category/${category.slug}`}
                  className="text-gray-900 hover:text-teal-500 dark:text-white dark:hover:text-teal-400 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {category.title}
                </Link>
              ))}
              <Link 
                href="/" 
                className="text-gray-900 hover:text-teal-500 dark:text-white dark:hover:text-teal-400 transition-colors font-medium"
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