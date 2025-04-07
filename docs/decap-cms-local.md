# Documentación: Sistema de CMS Local para Portfolio Next.js

## Introducción

Esta documentación describe la arquitectura y funcionamiento del sistema de gestión de contenidos (CMS) implementado en el proyecto Portfolio Next.js. La solución utiliza Decap CMS configurado específicamente para trabajar **exclusivamente en entorno local**, proporcionando un flujo de trabajo sencillo para la creación y edición de contenido.

## Visión General

El sistema implementa un CMS (Content Management System) que:

1. **Solo funciona en entorno local**: Permite gestionar el contenido del blog únicamente desde el entorno de desarrollo local.
2. **Está bloqueado en producción**: Implementa mecanismos de seguridad para impedir el acceso al CMS en el entorno de producción.
3. **No requiere autenticación externa**: Utiliza un proxy local para evitar la necesidad de servicios de autenticación externos.

## Arquitectura

La arquitectura del sistema se compone de tres componentes principales:

### 1. Panel de Administración

El panel de administración es una interfaz web accesible en la ruta `/admin` que permite:

- Crear nuevos artículos de blog
- Editar artículos existentes
- Gestionar medios (imágenes)
- Vista previa del contenido antes de guardar

### 2. Sistema de Archivos

El contenido gestionado por el CMS se almacena en:

- **Archivos Markdown**: Ubicados en `/content/blog/` donde cada archivo representa un artículo.
- **Imágenes**: Almacenadas en `/public/images/blog/` y referenciadas desde los archivos Markdown.

### 3. Mecanismos de Seguridad

El sistema incluye un enfoque de múltiples capas para garantizar que el CMS solo sea accesible en entorno local:

- **Verificación de entorno**: Scripts que detectan automáticamente si la aplicación está ejecutándose en entorno local o producción.
- **Redirección automática**: Redirección a la página principal cuando se intenta acceder al CMS desde producción.
- **Backend local**: Configuración que solo funciona con el proxy de desarrollo local.

## Flujo de Trabajo

### Desarrollo Local

1. Iniciar el servidor proxy de Decap CMS:
   ```
   npx netlify-cms-proxy-server
   ```

2. Iniciar la aplicación Next.js:
   ```
   npm run dev
   ```

3. Acceder al panel de administración en:
   ```
   http://localhost:3000/admin
   ```

4. Crear o editar contenido a través de la interfaz visual.

5. Los cambios se guardan automáticamente en archivos Markdown en la carpeta `/content/blog/`.

### Producción

En el entorno de producción:

1. Cualquier intento de acceder a `/admin` o `/admin/index.html` será redirigido automáticamente a la página principal.
2. El sistema de CMS está desactivado por completo.
3. El contenido se sirve desde los archivos Markdown generados durante el desarrollo.

## Ventajas

Esta arquitectura ofrece varias ventajas:

- **Simplicidad**: No requiere configuración de servicios de autenticación externos.
- **Seguridad**: Evita la exposición del panel de administración en producción.
- **Velocidad**: Al utilizar archivos estáticos, el rendimiento del sitio en producción es óptimo.
- **Control de versiones**: Los cambios en el contenido se pueden gestionar mediante Git.

## Limitaciones

- El contenido solo puede ser editado en el entorno de desarrollo local.
- Requiere conocimientos técnicos básicos para iniciar el entorno de desarrollo.
- No permite la edición colaborativa en tiempo real entre múltiples editores.

## Conclusiones

Esta implementación proporciona un equilibrio entre la facilidad de uso de un CMS visual y la seguridad de un sitio estático en producción. Es ideal para proyectos personales o de pequeña escala donde el contenido es gestionado por una sola persona con acceso al entorno de desarrollo.
