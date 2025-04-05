# Guía de Desarrollo del Portfolio

## Tabla de Contenidos
- [Stack Tecnológico](#stack-tecnológico)
- [Requisitos](#requisitos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Buenas Prácticas](#buenas-prácticas)
- [Reglas de Desarrollo](#reglas-de-desarrollo)
- [Utilidades y Herramientas](#utilidades-y-herramientas)

## Stack Tecnológico
- Next.js 15.2.4
- React 19.0.0
- Tailwind CSS 4.0
- PostCSS (@tailwindcss/postcss)

## Requisitos

### Requisitos del Sistema
- Node.js (versión LTS más reciente)
- npm o yarn como gestor de paquetes
- Git para control de versiones

### Requisitos del Navegador
- Navegadores modernos que soporten las últimas características CSS
- Soporte para color-mix(), @property, y cascade layers

## Estructura del Proyecto
```
tailwind-v4-guide-portfolio/
├── app/                    # Directorio principal de la aplicación Next.js
├── components/            # Componentes React reutilizables
├── docs/                  # Documentación del proyecto
├── public/               # Archivos estáticos
└── styles/              # Estilos y configuración de Tailwind
```

Para visualizar y entender mejor la estructura completa del proyecto, puedes utilizar el comando:

```bash
make tree
```

Este comando mostrará la estructura de directorios de forma jerárquica, excluyendo carpetas como `node_modules`, `.next`, `.git`, `build` y `coverage` para mantener la salida limpia y enfocada en los archivos relevantes del proyecto.

## Buenas Prácticas

### Componentes React
- Usar componentes funcionales con hooks
- Implementar lazy loading cuando sea posible
- Mantener los componentes pequeños y enfocados
- Documentar props con TypeScript o JSDoc

### Tailwind CSS
- Utilizar las nuevas características de Tailwind 4.0
- Aprovechar las variables CSS nativas del tema
- Usar container queries para diseños responsivos
- Implementar la nueva paleta de colores P3

### Rendimiento
- Optimizar imágenes y assets
- Implementar code splitting
- Utilizar caching apropiadamente
- Monitorear el tamaño del bundle

## Reglas de Desarrollo

### Nomenclatura
- Componentes: PascalCase (ej: `HeaderNavigation.jsx`)
- Funciones: camelCase (ej: `handleSubmit`)
- Constantes: UPPER_SNAKE_CASE
- CSS custom: kebab-case

### Git
- Commits semánticos (feat:, fix:, docs:, etc.)
- Branches por feature
- Pull requests obligatorios
- No commits directos a main/master

### Código
- ESLint para mantener consistencia
- Prettier para formateo
- TypeScript para type-safety
- Tests unitarios para componentes críticos

## Utilidades y Herramientas

### Tailwind CSS 4.0
- Nuevo motor de alto rendimiento
- Detección automática de contenido
- Variables de tema CSS nativas
- Container queries
- Transformaciones 3D
- APIs de gradientes mejoradas

### Comandos Útiles
```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Linting
npm run lint

# Tests
npm run test

# Ver estructura del proyecto
make tree
```

### VSCode Extensions Recomendadas
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- GitLens

## Actualizaciones y Mantenimiento

### Versionado
- Seguir Semantic Versioning (SemVer)
- Mantener un CHANGELOG.md
- Documentar breaking changes

### Dependencias
- Revisar actualizaciones regularmente
- Mantener package.json actualizado
- Verificar compatibilidades

## Recursos y Referencias
- [Documentación de Next.js 15](https://nextjs.org/docs)
- [Tailwind CSS v4.0](https://tailwindcss.com/docs)
- [React 19 Documentation](https://react.dev/docs)