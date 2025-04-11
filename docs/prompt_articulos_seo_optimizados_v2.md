# Prompt para Crear Artículos Optimizados para SEO con Estilo Humano

## Instrucciones Base

Necesito que crees un artículo de blog técnico sobre [TEMA] que esté optimizado para SEO siguiendo las mejores prácticas de 2025 y que mantenga un estilo totalmente natural, como si hubiera sido escrito por un desarrollador experimentado con conocimientos profundos en la materia.

Primero, lee el archivo "mejores_practicas_seo_2025.md" para entender e implementar las estrategias SEO actuales en el artículo que vas a redactar.

## Estrategia de Generación de Contenido por Trozos

Para artículos extensos (más de 2000 palabras), es fundamental utilizar una estrategia de generación por trozos pequeños secuenciales (es un requisito técnico no negociable):

1. **Genera el artículo en secciones modulares**:
   - Primero, crea los metadatos y la introducción
   - Crear un indice de la estructura del artículo con enlaces a cada sección
   - Luego, añade cada sección principal una por una 
   - Finalmente, agrega la conclusión y recursos

2. **Por qué usar este enfoque**:
   - Evita truncamientos causados por limitaciones de longitud de respuesta
   - Permite revisar y ajustar cada sección antes de continuar
   - Facilita la edición específica sin reescribir todo el contenido
   - Reduce la probabilidad de perder todo el trabajo si ocurre un error
   - Garantiza consistencia a lo largo de todo el artículo

3. **Ejemplo de Estructura recomendada de trozos**:
La creación de un artículo extenso requiere una organización clara y modular. Aquí está un ejemplo de cómo se estructura el artículo, pero no es estricamente literal, ordena de forma inteligente:
   - Trozo 1: Metadatos + Introducción + "¿Qué vamos a construir?" + Prerrequisitos
   - Trozo 2: Paso 1 y Paso 2 del contenido principal
   - Trozo 3: Paso 3 y Paso 4 del contenido principal
   - Trozo 4: Paso 5 y Paso 6 del contenido principal (si aplica)
   - Trozo 5: Errores comunes + Conclusión + Recursos adicionales

Para implementar esta estrategia, utilizaré funciones de edición de bloques para ir añadiendo contenido al archivo secuencialmente, en lugar de intentar generar todo el artículo de una sola vez.

## Detalles del Artículo

- **Título principal**: [Proporcionar título o pedir que lo genere]
- **Palabra clave principal**: [Palabra clave]
- **Palabras clave secundarias**: [Lista de palabras clave relacionadas]
- **Intención de búsqueda**: [Informativa/Transaccional/Navegacional]
- **Extensión aproximada**: [Entre 2000-3000 palabras recomendado para temas técnicos]
- **Nivel técnico**: [Básico/Intermedio/Avanzado]
- **Público objetivo**: [Desarrolladores junior/senior, DevOps, etc.]

## Estructura Solicitada

Quiero que el artículo siga una estructura similar a la siguiente:

1. **Introducción personal** (150-250 palabras)
   - Comienza con una anécdota personal o experiencia relevante con el tema
   - Menciona brevemente por qué este tema es importante para los desarrolladores
   - Incluye la palabra clave principal de forma natural
   - Adelanta brevemente qué aprenderá el lector (sin usar frases genéricas como "En este artículo...")

2. **Cuerpo del contenido** estructurado con H2 y H3 lógicos
   - Utiliza preguntas como encabezados cuando sea apropiado
   - Asegúrate de que cada sección fluya naturalmente hacia la siguiente
   - Incluye ejemplos de código real y práctico cuando sea relevante
   - Explica no solo el "cómo" sino también el "por qué" de cada concepto

3. **Sección práctica o caso de uso**
   - Incluye al menos un ejemplo detallado de un caso real
   - Preferiblemente, menciona errores comunes que has cometido o has visto cometer
   - Ofrece soluciones basadas en tu experiencia

4. **Conclusión y siguientes pasos**
   - Resume los puntos clave sin simplemente repetirlos
   - Sugiere recursos adicionales o tecnologías complementarias
   - Termina con una reflexión personal o consejo profesional

## Elementos Específicos a Incluir

- Al menos una tabla comparativa (cuando sea relevante)
- 2-3 fragmentos de código con ejemplos prácticos y comentados
- Una sección de "Errores comunes a evitar" basada en experiencia real
- Una sección de FAQ con 4-5 preguntas naturales (no genéricas)
- Referencias a herramientas o librerías actualizadas al 2025

## Estilo de Escritura

- **CRUCIAL**: El texto debe parecer escrito por un humano, específicamente un desarrollador con experiencia
- Utiliza un tono conversacional pero profesional
- Incluye ocasionalmente:
  - Expresiones de primera persona como "En mi experiencia..."
  - Opiniones técnicas matizadas ("Aunque muchos prefieren X, yo he encontrado que Y funciona mejor para casos específicos como...")
  - Algunas imperfecciones estilísticas naturales (subordinadas ocasionales, alguna frase más larga seguida de otras cortas)
  - Referencias ocasionales a la evolución de la tecnología con el tiempo
  - Alguna expresión de frustración o entusiasmo auténtico ("Después de luchar con esta configuración durante horas...")

- **Evita**:
  - Estructuras repetitivas de párrafos
  - Exceso de adjetivos promocionales
  - Frases demasiado perfectas y pulidas que suenen artificiales
  - Explicaciones demasiado generales sin detalles específicos
  - Terminología inconsistente con el nivel técnico esperado

## Formato Técnico SEO

- Estructura clara de H1, H2, H3, H4 sin saltar niveles
- La palabra clave principal debe aparecer en:
  - El título H1
  - Primer párrafo
  - Al menos un H2
  - En la conclusión
- Las palabras clave secundarias deben distribuirse naturalmente en subtítulos y contenido
- Párrafos relativamente cortos (3-5 líneas máximo)
- Utiliza listas numeradas para pasos y listas con viñetas para características
- Incluye preguntas en algunos subtítulos para capturar búsquedas conversacionales
- Asegúrate de que la estructura sea escaneable con puntos de entrada visuales claros

## Instrucciones para Formato de Imágenes (placeholder)

Para cada punto donde se debería incluir una imagen, inserta un bloque como este:

```
[IMAGEN]
Título: [título descriptivo con palabra clave relevante]
Descripción: [breve descripción de lo que debería mostrar la imagen]
Alt-text: [texto alternativo optimizado para SEO]
```

## Metadatos a Generar al Final

Al final del artículo, por favor proporciona:

- **Meta título** (60-65 caracteres máximo)
- **Meta descripción** (150-160 caracteres máximo)
- **Slug URL** recomendado
- **5 etiquetas** recomendadas
- **Palabras clave semánticas** adicionales identificadas durante la creación

## Gestión de Consistencia entre Secciones

Al generar contenido por trozos, asegúrate de:
- Mantener coherencia terminológica entre secciones
- Revisar referencias cruzadas entre partes del artículo
- Mantener un tono y estilo unificados
- Evitar duplicación de contenido
- Verificar que las transiciones entre secciones sean naturales

Cuando finalices una sección y empieces otra, comienza haciendo una breve referencia a cómo la nueva sección conecta con lo anterior.

## Ejemplo de Estilo Humano a Emular

"Cuando implementé por primera vez una arquitectura de microservicios en un proyecto legacy, cometí el error clásico de crear servicios demasiado granulares. El resultado fue un desastre de dependencias que me tuvo despierto durante tres noches seguidas. Desde entonces, he desarrollado un enfoque más pragmático que quiero compartir con vosotros.

No voy a mentir: migrar a microservicios no es sencillo. Pero después de varios proyectos (y bastantes dolores de cabeza), he identificado algunos patrones que funcionan consistentemente. Y lo más importante: cuándo NO usar microservicios, algo que muchos artículos evitan mencionar."

## Notas Finales

- El artículo debe ser 100% original, útil y basado en experiencia práctica
- Evita clichés, generalidades y relleno
- Concéntrate en proporcionar información accionable específica
- Incluye alguna idea o enfoque poco convencional pero efectivo relacionado con el tema
- Escribe como si estuvieras compartiendo conocimiento valioso con un colega desarrollador, no como si estuvieras redactando documentación formal

Al seguir estas pautas, crearás un artículo técnicamente sólido, optimizado para SEO y con un estilo natural que resuene con los desarrolladores, sin ningún indicio de haber sido generado por IA.