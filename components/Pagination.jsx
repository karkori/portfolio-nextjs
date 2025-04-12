"use client";

import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';

const Pagination = ({ currentPage, totalPages, basePath }) => {
  const { theme } = useTheme();
  
  // No mostrar paginación si solo hay una página
  if (totalPages <= 1) return null;
  
  // Determinar qué páginas mostrar (siempre mostrar la primera, la última, la actual y 1-2 páginas adyacentes)
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Siempre incluir la primera página
    pageNumbers.push(1);
    
    // Rango alrededor de la página actual
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pageNumbers.push(i);
    }
    
    // Siempre incluir la última página si hay más de una
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    // Eliminar duplicados y ordenar
    return [...new Set(pageNumbers)].sort((a, b) => a - b);
  };
  
  const pageNumbers = getPageNumbers();
  
  // Estilos base según el tema
  const buttonBaseStyle = `
    flex items-center justify-center w-10 h-10 rounded-md transition-colors duration-200
    ${theme === 'dark' 
      ? 'text-gray-300 hover:bg-gray-700' 
      : 'text-gray-700 hover:bg-gray-100'}
  `;
  
  const buttonActiveStyle = `
    ${theme === 'dark' 
      ? 'bg-teal-600 text-white hover:bg-teal-700' 
      : 'bg-teal-500 text-white hover:bg-teal-600'}
  `;
  
  const buttonDisabledStyle = `
    ${theme === 'dark' 
      ? 'text-gray-600 cursor-not-allowed' 
      : 'text-gray-400 cursor-not-allowed'}
  `;
  
  return (
    <nav className="flex justify-center items-center space-x-2" aria-label="Paginación">
      {/* Botón Anterior */}
      {currentPage > 1 ? (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className={buttonBaseStyle}
          aria-label="Ir a la página anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
      ) : (
        <span className={`${buttonBaseStyle} ${buttonDisabledStyle}`} aria-disabled="true">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </span>
      )}
      
      {/* Números de página */}
      {pageNumbers.map((pageNumber, index) => {
        // Si hay un salto en la secuencia, mostrar puntos suspensivos
        if (index > 0 && pageNumber > pageNumbers[index - 1] + 1) {
          return (
            <span 
              key={`ellipsis-${pageNumber}`} 
              className={`${buttonBaseStyle} cursor-default`}
            >
              ...
            </span>
          );
        }
        
        return (
          <Link
            key={pageNumber}
            href={`${basePath}?page=${pageNumber}`}
            className={`${buttonBaseStyle} ${currentPage === pageNumber ? buttonActiveStyle : ''}`}
            aria-current={currentPage === pageNumber ? "page" : undefined}
            aria-label={`Ir a la página ${pageNumber}`}
          >
            {pageNumber}
          </Link>
        );
      })}
      
      {/* Botón Siguiente */}
      {currentPage < totalPages ? (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className={buttonBaseStyle}
          aria-label="Ir a la página siguiente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
      ) : (
        <span className={`${buttonBaseStyle} ${buttonDisabledStyle}`} aria-disabled="true">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </span>
      )}
    </nav>
  );
};

export default Pagination;