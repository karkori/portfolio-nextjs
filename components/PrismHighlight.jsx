'use client';

import { useEffect } from 'react';
import Prism from 'prismjs';

// Estilos base de Prism.js
import 'prismjs/themes/prism.css';
// Estilos para números de línea
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

// Importamos los lenguajes que queremos soportar
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-python';

// Importamos el plugin para números de línea
import 'prismjs/plugins/line-numbers/prism-line-numbers';

export default function PrismHighlight() {
  useEffect(() => {
    // Función para resaltar todos los bloques de código en el documento
    const highlightAll = () => {
      // Identificar bloques pre code
      const preBlocks = document.querySelectorAll('pre');
      
      preBlocks.forEach(preBlock => {
        // Añadir clase para números de línea
        if (!preBlock.classList.contains('line-numbers')) {
          preBlock.classList.add('line-numbers');
        }
        
        // Verificar si hay un elemento code dentro del pre
        const codeBlock = preBlock.querySelector('code');
        if (codeBlock) {
          // Si no tiene una clase de lenguaje, asignar una por defecto
          if (!Array.from(codeBlock.classList).some(cl => cl.startsWith('language-'))) {
            codeBlock.classList.add('language-plaintext');
          }
        }
      });
      
      // Ejecutar Prism para resaltar la sintaxis
      if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
      }
    };

    // Ejecutar después de que el DOM se ha cargado completamente
    if (document.readyState === 'complete') {
      highlightAll();
    } else {
      window.addEventListener('load', highlightAll);
      // También ejecutar después de un pequeño retraso para asegurarnos
      // de que Next.js haya completado la hidratación
      setTimeout(highlightAll, 200);
      
      return () => {
        window.removeEventListener('load', highlightAll);
      };
    }
  }, []);

  return null; // Este componente no renderiza nada visible
}
