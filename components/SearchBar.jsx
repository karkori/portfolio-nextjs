"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

/**
 * Componente de barra de búsqueda para el blog
 * @param {Object} props - Propiedades del componente
 * @param {string} props.placeholder - Texto de placeholder
 * @param {string} props.initialQuery - Consulta inicial
 * @param {string} props.className - Clases CSS adicionales
 */
export default function SearchBar({ placeholder = "Buscar artículos...", initialQuery = "", className = "" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(initialQuery || searchParams.get('query') || '');

  // Debounce para reducir el número de llamadas durante la escritura
  const debouncedSearch = useCallback(
    debounce((term) => {
      updateSearchParams(term);
    }, 300),
    [pathname]
  );

  // Función para actualizar los parámetros de búsqueda en la URL
  const updateSearchParams = useCallback((term) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    
    // Resetear la página a 1 cuando se cambia la búsqueda
    params.set('page', '1');
    
    // Actualizar la URL
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  // Manejar cambios en el campo de búsqueda
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    updateSearchParams(searchTerm);
  };

  // Función de debounce para limitar las llamadas durante la escritura
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors duration-200"
          aria-label="Buscar artículos"
        />
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 absolute left-3 text-gray-400 dark:text-gray-500" 
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
        
        {searchTerm && (
          <button 
            type="button"
            onClick={() => {
              setSearchTerm('');
              updateSearchParams('');
            }}
            className="absolute right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            aria-label="Limpiar búsqueda"
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
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}
