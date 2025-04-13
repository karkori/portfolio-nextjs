# Sistema de Búsqueda para Blog en Next.js 15

## Índice
1. [Visión General](#visión-general)
2. [Arquitectura](#arquitectura)
3. [Componentes del Sistema](#componentes-del-sistema)
4. [Flujo de Trabajo](#flujo-de-trabajo)
5. [Optimizaciones](#optimizaciones)
6. [Integración con Decap CMS](#integración-con-decap-cms)
7. [Consideraciones de Rendimiento](#consideraciones-de-rendimiento)
8. [Implementación](#implementación)

## Visión General

El sistema de búsqueda para el blog proporcionará a los usuarios la capacidad de buscar artículos del blog de manera eficiente basándose en títulos, descripciones, contenido y metadatos como etiquetas y categorías. Está diseñado específicamente para blogs basados en archivos Markdown con Decap CMS.

## Arquitectura

La arquitectura del sistema de búsqueda consta de tres componentes principales:

1. **Generador de índice de búsqueda**: Un script que procesa todos los archivos Markdown del blog y crea un índice de búsqueda optimizado.
2. **API de búsqueda**: Un endpoint API de Next.js que consulta el índice y devuelve resultados relevantes.
3. **Interfaz de usuario**: Componentes del frontend que permiten a los usuarios realizar búsquedas y ver los resultados.

## Componentes del Sistema

### 1. Generador de Índice de Búsqueda

**Ubicación**: `lib/search-index.js`

**Funcionalidad**:
- Lee todos los archivos Markdown del directorio `content/blog`
- Extrae el frontmatter (título, descripción, fecha, etiquetas, categoría) usando `gray-matter`
- Procesa el contenido para crear un texto plano optimizado para búsquedas
- Genera un archivo JSON con el índice de búsqueda

**Ejecución**:
- Durante el proceso de construcción de Next.js
- Manualmente cuando se añade nuevo contenido
- Automáticamente mediante un script pre-commit (opcional)

### 2. API de Búsqueda

**Ubicación**: `app/api/search/route.js`

**Funcionalidad**:
- Endpoint API que recibe consultas de búsqueda mediante parámetros de URL
- Utiliza Fuse.js para realizar búsqueda difusa (fuzzy search)
- Permite filtrar por categoría o etiquetas
- Devuelve resultados ordenados por relevancia

**Características**:
- Búsqueda difusa para tolerar errores ortográficos
- Ponderación personalizada para diferentes campos (título, descripción, contenido)
- Paginación para resultados extensos
- Caché de resultados para consultas comunes

### 3. Interfaz de Usuario

**Componentes**:
- **SearchBar**: Componente para la entrada de búsqueda
- **Reutilización de BlogPostCard**: Aprovechamiento del componente existente para mostrar los resultados de búsqueda
- **SearchPage**: Página dedicada a la búsqueda que utiliza componentes existentes
- **Integración en Header**: Para acceso rápido desde cualquier página

**Reutilización de componentes existentes**:
- Se utilizará el componente `BlogPostCard.jsx` para mostrar cada resultado de búsqueda
- Se adaptará el componente `Pagination.jsx` para la navegación entre resultados
- Se mantendrá la consistencia visual al aprovechar el mismo sistema de tarjetas del blog actual
- Se incorporará la lógica de búsqueda en el diseño existente sin duplicar componentes UI

## Flujo de Trabajo

1. **Generación del índice**:
   - Al construir el sitio, se genera un índice de búsqueda
   - Este índice se guarda como un archivo JSON

2. **Proceso de búsqueda**:
   - El usuario introduce un término de búsqueda en la interfaz
   - La entrada se envía al endpoint API como parámetro de URL
   - El API consulta el índice utilizando Fuse.js
   - Los resultados se devuelven al cliente
   - Los resultados se muestran al usuario en formato similar a las tarjetas de blog existentes

3. **Experiencia de usuario**:
   - La búsqueda se realiza en tiempo real o al presionar Enter
   - Los resultados se actualizan dinámicamente y se muestran utilizando los componentes `BlogPostCard` existentes
   - La URL se actualiza con los parámetros de búsqueda (para compartir/marcar)
   - Se mantiene la misma experiencia visual que en la página principal del blog y categorías

## Optimizaciones

### Rendimiento de Búsqueda
- Uso de índices invertidos para búsquedas más rápidas
- Limitar la cantidad de texto indexado por artículo
- Implementar umbral de relevancia para filtrar resultados irrelevantes

### Experiencia de Usuario
- Implementar debounce para reducir peticiones durante la escritura
- Mostrar sugerencias de búsqueda basadas en contenido popular
- Proporcionar filtros adicionales (por fecha, categoría, etiquetas)
- Mantener la consistencia visual con el diseño actual del blog
- Asegurar que la presentación de resultados respeta el tema claro/oscuro existente

## Integración con Decap CMS

El sistema de búsqueda es totalmente compatible con Decap CMS:

- Los nuevos artículos creados a través del CMS serán indexados automáticamente
- No se requiere configuración adicional en el CMS
- El índice de búsqueda se puede regenerar manualmente desde el panel de administración

## Consideraciones de Rendimiento

- **Tamaño del índice**: Para blogs con muchos artículos, es importante optimizar el tamaño del índice
- **Frecuencia de actualización**: Definir cuándo regenerar el índice (build time, bajo demanda, etc.)
- **Caché del cliente**: Implementar estrategias de caché para reducir llamadas API repetitivas

## Implementación

### Pasos de implementación

1. Crear el script generador de índice de búsqueda
2. Desarrollar el endpoint API de búsqueda
3. Crear la página de búsqueda reutilizando componentes existentes:
   - Adaptar `BlogPostCard.jsx` para recibir resultados de búsqueda
   - Reutilizar `Pagination.jsx` para navegar entre resultados
   - Mantener la consistencia visual con el resto del blog
4. Integrar el sistema en el layout existente 
5. Configurar la regeneración automática del índice
6. Realizar pruebas con contenido real

### Dependencias necesarias

- `fuse.js`: Para búsqueda difusa eficiente
- `gray-matter`: Para procesar el frontmatter de Markdown (ya está en el proyecto)

### Tiempo estimado de implementación

- Desarrollo inicial: 4-6 horas
- Ajustes y optimizaciones: 2-3 horas
- Pruebas e integración: 1-2 horas
