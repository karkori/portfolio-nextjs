# Instalación del Sistema de Búsqueda

Este documento contiene las instrucciones para instalar y configurar el sistema de búsqueda para el blog.

## Archivos implementados

Se han creado los siguientes archivos:

1. `lib/search-index.js` - Script que genera el índice de búsqueda
2. `app/api/search/route.js` - API endpoint para realizar búsquedas
3. `components/SearchBar.jsx` - Componente de la barra de búsqueda
4. `app/search/page.js` - Página de resultados de búsqueda

Además, se ha modificado:

1. `components/Header.jsx` - Para añadir el botón de búsqueda en el header
2. `package.json` - Para añadir el script de generación del índice y la dependencia fuse.js

## Pasos de instalación

### 1. Instalar la dependencia fuse.js

```bash
npm install fuse.js
```

### 2. Asegurarse de que existen artículos en el blog

Verifica que el directorio `content/blog` contenga archivos Markdown (`.md`) con el contenido de los artículos.

Si no existen artículos, crea al menos uno de prueba en este directorio con la siguiente estructura:

```md
---
title: "Artículo de prueba"
date: "2025-04-13"
description: "Este es un artículo de prueba para el sistema de búsqueda"
thumbnail: "/images/blog/default-thumbnail.jpg"
category: "Test"
tags: ["prueba", "test", "búsqueda"]
---

Este es el contenido del artículo de prueba.
```

### 3. Generar el índice de búsqueda inicial

```bash
npm run generate-search-index
```

Este comando creará un archivo `lib/search-index.json` con los datos de todos los posts del blog.

### 3. Probar el sistema

1. Inicia el servidor de desarrollo:

```bash
npm run dev
```

2. Accede a la página de búsqueda en tu navegador:

```
http://localhost:3000/search
```

3. También puedes hacer clic en el icono de búsqueda en el header.

## Generación automática del índice

El índice de búsqueda se generará automáticamente durante el proceso de build con el comando:

```bash
npm run build
```

## Características del sistema de búsqueda

- **Búsqueda difusa**: Permite encontrar resultados incluso con errores ortográficos
- **Búsqueda por título, descripción, contenido y etiquetas**: Con diferentes pesos para cada campo
- **Paginación**: Resultados paginados usando el componente existente
- **Filtros por categoría y etiquetas**: Compatibles con los filtros existentes
- **Búsqueda en tiempo real**: Actualiza los resultados mientras escribes
- **URL compartibles**: Los parámetros de búsqueda se mantienen en la URL
- **Diseño consistente**: Reutiliza los componentes `BlogPostCard` y `Pagination`

## Personalización

### Ajustar la relevancia de la búsqueda

Para ajustar el umbral de relevancia de la búsqueda, modifica el valor de `threshold` en el archivo `app/api/search/route.js`:

```javascript
const fuseOptions = {
  // ...
  threshold: 0.4, // Valores más bajos = búsqueda más estricta
  // ...
};
```

### Cambiar la cantidad de resultados por página

Para modificar el número de resultados por página, cambia el valor predeterminado de `limit` en `app/api/search/route.js`:

```javascript
const limit = parseInt(searchParams.get('limit') || '9');
```

## Solución de problemas

### El índice de búsqueda no se genera

Si el índice no se genera correctamente, verifica que:

1. El directorio `content/blog` existe y contiene archivos Markdown
2. Tienes permisos de escritura en el directorio `lib/`
3. Ejecuta el script manualmente para ver posibles errores:

```bash
node lib/search-index.js
```

### Los resultados de búsqueda no aparecen

Si la búsqueda no muestra resultados, verifica que:

1. El archivo `lib/search-index.json` existe y contiene datos
2. La API de búsqueda funciona correctamente accediendo a:
   `http://localhost:3000/api/search?query=tuConsulta`
3. La consola del navegador no muestra errores
