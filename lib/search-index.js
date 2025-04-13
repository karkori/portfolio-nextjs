/**
 * Script para generar un índice de búsqueda a partir de los posts del blog
 * Este índice será utilizado por la API de búsqueda para proporcionar resultados
 * de manera eficiente y rápida.
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { SITE_CONFIG } = require('./config');

/**
 * Genera un índice de búsqueda con todos los posts del blog
 * @returns {Array} Array de objetos con la información relevante de cada post
 */
async function generateSearchIndex() {
  try {
    const postsDirectory = path.join(process.cwd(), SITE_CONFIG.blog.postsDirectory);
    
    // Verificar si el directorio existe
    if (!fs.existsSync(postsDirectory)) {
      console.log(`El directorio ${postsDirectory} no existe.`);
      return [];
    }
    
    const fileNames = fs.readdirSync(postsDirectory);
    
    const searchIndex = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        try {
          // Eliminar ".md" para obtener el slug
          const slug = fileName.replace(/\.md$/, '');
          
          // Leer el contenido del archivo
          const fullPath = path.join(postsDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          
          // Usar gray-matter para parsear el frontmatter y el contenido
          const { data, content } = matter(fileContents);
          
          // Convertir etiquetas a array si es string
          let tags = data.tags || [];
          if (typeof tags === 'string') {
            tags = tags.split(',').map(tag => tag.trim());
          }
          
          // Extraer un extracto para la búsqueda (primeros 1000 caracteres)
          const searchableContent = content
            .replace(/#+\s/g, '') // Eliminar encabezados
            .replace(/!\[.*?\]\(.*?\)/g, '') // Eliminar imágenes
            .replace(/\[|\]|\(|\)/g, '') // Eliminar enlaces
            .replace(/`{1,3}.*?`{1,3}/g, '') // Eliminar bloques de código
            .replace(/\n/g, ' ') // Reemplazar saltos de línea con espacios
            .slice(0, 1000); // Limitar a 1000 caracteres
          
          // Calcular tiempo de lectura (reutilizando lógica existente)
          const wordCount = content.split(/\s+/).length;
          const readingTime = `${Math.ceil(wordCount / 225)} min de lectura`;
          
          return {
            slug,
            title: data.title || '',
            description: data.description || '',
            content: searchableContent,
            date: data.date ? new Date(data.date).toISOString() : '',
            dateFormatted: data.date ? new Date(data.date).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : '',
            tags: tags,
            category: data.category || null,
            thumbnail: data.thumbnail || SITE_CONFIG.blog.defaultThumbnail,
            readingTime,
          };
        } catch (fileError) {
          console.error(`Error al procesar el archivo ${fileName}:`, fileError);
          return null;
        }
      })
      .filter(post => post && post.title); // Filtrar posts nulos o sin título
    
    // Guardar el índice en un archivo JSON
    const searchIndexDir = path.join(process.cwd(), 'lib');
    const searchIndexPath = path.join(searchIndexDir, 'search-index.json');
    
    try {
      fs.writeFileSync(searchIndexPath, JSON.stringify(searchIndex), 'utf8');
      console.log(`Índice de búsqueda generado con ${searchIndex.length} posts.`);
    } catch (writeError) {
      console.error('Error al escribir el archivo de índice:', writeError);
    }
    
    return searchIndex;
  } catch (error) {
    console.error('Error al generar el índice de búsqueda:', error);
    return [];
  }
}

// Exportar la función para poder usarla en la API y en scripts
module.exports = { generateSearchIndex };

// Si se ejecuta directamente, generar el índice
if (require.main === module) {
  generateSearchIndex();
}
