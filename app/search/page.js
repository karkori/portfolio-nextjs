import React from 'react';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/config';
import BlogPostCard from '@/components/BlogPostCard';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/Pagination';
import BreadcrumbNav from '@/components/BreadcrumbNav';

// Metadata para SEO
export const metadata = {
  title: 'Búsqueda de Artículos',
  description: 'Busca artículos en el blog de ' + SITE_CONFIG.author.name,
};

/**
 * Función para buscar posts utilizando la API de búsqueda
 * @param {string} query - Término de búsqueda
 * @param {string} category - Categoría para filtrar (opcional)
 * @param {string} tag - Etiqueta para filtrar (opcional)
 * @param {number} page - Número de página
 * @returns {Promise<Object>} Resultados de la búsqueda
 */
async function searchPosts(query, category, tag, page = 1) {
  // En el servidor, construimos la URL absoluta para la API
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Construir URL con parámetros
  const searchParams = new URLSearchParams();
  if (query) searchParams.set('query', query);
  if (category) searchParams.set('category', category);
  if (tag) searchParams.set('tag', tag);
  if (page) searchParams.set('page', page);
  
  const url = `${baseUrl}/api/search?${searchParams.toString()}`;
  
  try {
    // Buscar sin caché para obtener resultados actualizados
    const response = await fetch(url, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error(`Error en la búsqueda: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al buscar posts:', error);
    // Devolver objeto con arrays vacíos en caso de error
    return { results: [], totalResults: 0, page: 1, totalPages: 0 };
  }
}

/**
 * Página de búsqueda de artículos
 */
export default async function SearchPage({ searchParams }) {
  // Esperar searchParams en Next.js 15
  const params = await searchParams;
  
  // Extraer parámetros de búsqueda de la URL
  const query = params?.query || '';
  const category = params?.category || '';
  const tag = params?.tag || '';
  const currentPage = Number(params?.page) || 1;
  
  // Buscar posts que coincidan con los criterios
  const { results, totalResults, totalPages } = await searchPosts(
    query, 
    category, 
    tag, 
    currentPage
  );

  // Determinar el título de la página según los parámetros
  let pageTitle = 'Búsqueda';
  if (query) pageTitle = `Resultados para "${query}"`;
  else if (category) pageTitle = `Categoría: ${category}`;
  else if (tag) pageTitle = `Etiqueta: ${tag}`;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <BreadcrumbNav title={pageTitle} />

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
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-teal-500 mb-4 md:mb-0">{pageTitle}</h1>
      </div>

      {/* Barra de búsqueda destacada */}
      <div className="mb-8">
        <SearchBar 
          placeholder="Buscar artículos..." 
          initialQuery={query}
          className="max-w-2xl mx-auto"
        />
      </div>

      {/* Mostrar resultados o mensaje de no resultados */}
      {results.length > 0 ? (
        <>
          {/* Contador de resultados */}
          <div className="mb-6 text-gray-600 dark:text-gray-400">
            {totalResults} {totalResults === 1 ? 'resultado encontrado' : 'resultados encontrados'}
          </div>

          {/* Resultados en grid - reutilizando BlogPostCard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((post, index) => (
              <BlogPostCard key={post.slug} post={post} priority={index < 3} />
            ))}
          </div>
          
          {/* Paginación - reutilizando el componente existente */}
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                basePath="/search" 
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-10">
          {query ? (
            <div>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                No se encontraron resultados para "{query}"
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Prueba con otros términos o revisa la ortografía.
              </p>
            </div>
          ) : (
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Ingresa un término para comenzar a buscar.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
