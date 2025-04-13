/**
 * API de búsqueda para el blog
 * Este endpoint permite buscar posts por título, descripción, contenido y etiquetas
 */

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Fuse from 'fuse.js';

/**
 * Maneja las solicitudes GET a la API de búsqueda
 * @param {Request} request - Objeto de solicitud
 * @returns {NextResponse} Respuesta con los resultados de búsqueda
 */
export async function GET(request) {
  // Obtener parámetros de búsqueda de la URL
  const urlObj = new URL(request.url);
  const searchParamsObj = urlObj.searchParams;
  
  const query = searchParamsObj.get('query') || '';
  const category = searchParamsObj.get('category') || '';
  const tag = searchParamsObj.get('tag') || '';
  const page = parseInt(searchParamsObj.get('page') || '1');
  const limit = parseInt(searchParamsObj.get('limit') || '9');
  
  // Si no hay query y no hay filtros, devolver los últimos posts
  if (!query && !category && !tag) {
    return NextResponse.json({
      results: [], 
      totalResults: 0,
      page,
      totalPages: 0
    });
  }
  
  try {
    // Leer el índice de búsqueda
    const indexPath = path.join(process.cwd(), 'lib', 'search-index.json');
    
    // Verificar si el archivo existe
    if (!fs.existsSync(indexPath)) {
      console.error('El archivo de índice de búsqueda no existe. Ejecuta: npm run generate-search-index');
      return NextResponse.json(
        { error: 'Índice de búsqueda no encontrado', results: [], totalResults: 0, page, totalPages: 0 },
        { status: 404 }
      );
    }
    
    const indexData = fs.readFileSync(indexPath, 'utf8');
    const posts = JSON.parse(indexData);
    
    // Aplicar filtros por categoría o etiqueta si están presentes
    let filteredPosts = posts;
    
    if (category) {
      filteredPosts = filteredPosts.filter(post => 
        post.category?.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (tag) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      );
    }
    
    let results = [];
    
    // Si hay una consulta, usar Fuse.js para búsqueda difusa
    if (query) {
      const fuseOptions = {
        keys: [
          { name: 'title', weight: 1 },
          { name: 'description', weight: 0.8 },
          { name: 'content', weight: 0.6 },
          { name: 'tags', weight: 0.5 },
        ],
        includeScore: true,
        threshold: 0.4, // Ajustar para determinar qué tan estricta es la búsqueda
        minMatchCharLength: 2, // Longitud mínima de texto para considerar una coincidencia
      };
      
      const fuse = new Fuse(filteredPosts, fuseOptions);
      const fuseResults = fuse.search(query);
      
      // Convertir resultados de Fuse.js al formato estándar de post
      results = fuseResults.map(result => ({
        ...result.item,
        score: result.score
      }));
    } else {
      // Si solo hay filtros pero no consulta, usar los posts filtrados
      results = filteredPosts;
    }
    
    // Ordenar por fecha (más reciente primero) o por relevancia si hay una consulta
    if (query) {
      // Ya están ordenados por relevancia gracias a Fuse.js
    } else {
      results.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    // Paginación
    const totalResults = results.length;
    const totalPages = Math.ceil(totalResults / limit);
    const startIndex = (page - 1) * limit;
    const paginatedResults = results.slice(startIndex, startIndex + limit);
    
    return NextResponse.json({
      results: paginatedResults,
      totalResults,
      page,
      totalPages
    });
    
  } catch (error) {
    console.error('Error en la búsqueda:', error);
    
    return NextResponse.json(
      { error: 'Error al procesar la búsqueda' },
      { status: 500 }
    );
  }
}
