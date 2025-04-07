'use client';

import { useEffect } from 'react';

export default function CodeCopyButton() {
  useEffect(() => {
    // Inserta los SVG para los botones de copiar
    const addCopyButtons = () => {
      // Selecciona todos los bloques de código en el artículo
      const codeBlocks = document.querySelectorAll('.article-content pre');
      
      codeBlocks.forEach(codeBlock => {
        // Evitar duplicados si ya tiene un botón de copiar
        if (codeBlock.querySelector('.code-copy-button')) {
          return;
        }
        
        // Crear el botón de copia con SVG profesional
        const copyButton = document.createElement('button');
        copyButton.className = 'code-copy-button';
        copyButton.setAttribute('aria-label', 'Copiar código');
        copyButton.setAttribute('title', 'Copiar al portapapeles');
        copyButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="copy-icon">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="check-icon" style="display: none;">
            <path d="M20 6L9 17l-5-5"></path>
          </svg>
        `;
        
        // Estilos para el botón
        const style = document.createElement('style');
        style.textContent = `
          .code-copy-button {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            width: 2rem;
            height: 2rem;
            padding: 0.25rem;
            background-color: rgba(30, 41, 59, 0.5);
            border: none;
            border-radius: 0.25rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.7;
            transition: all 0.2s ease;
            z-index: 50;
          }
          
          .dark .code-copy-button {
            background-color: rgba(255, 255, 255, 0.1);
          }
          
          .code-copy-button:hover {
            opacity: 1;
            background-color: rgba(30, 41, 59, 0.7);
          }
          
          .dark .code-copy-button:hover {
            background-color: rgba(255, 255, 255, 0.2);
          }
          
          .code-copy-button svg {
            width: 1rem;
            height: 1rem;
            color: white;
          }
          
          .code-copy-button .check-icon {
            color: #fff;
          }
        `;
        document.head.appendChild(style);
        
        // Añadir el botón al bloque de código
        codeBlock.appendChild(copyButton);
        
        // Añadir el evento de clic al botón
        copyButton.addEventListener('click', () => {
          // Para rehype-pretty-code, necesitamos extraer todas las líneas de texto
          // porque el código está distribuido en múltiples elementos [data-line]
          const codeLines = codeBlock.querySelectorAll('[data-line]');
          let code = '';
          
          if (codeLines && codeLines.length > 0) {
            // Concatenar el texto de cada línea
            codeLines.forEach(line => {
              code += line.textContent + '\n';
            });
          } else {
            // Fallback al método antiguo
            const codeElement = codeBlock.querySelector('code');
            code = codeElement ? codeElement.innerText : codeBlock.innerText;
          }
          
          // Copia al portapapeles
          navigator.clipboard.writeText(code).then(() => {
            // Cambiar al icono de check
            const copyIcon = copyButton.querySelector('.copy-icon');
            const checkIcon = copyButton.querySelector('.check-icon');
            
            copyIcon.style.display = 'none';
            checkIcon.style.display = 'block';
            
            // Volver al icono original después de un tiempo
            setTimeout(() => {
              copyIcon.style.display = 'block';
              checkIcon.style.display = 'none';
            }, 1500);
          }).catch(err => {
            console.error('Error al copiar el código:', err);
          });
        });
      });
    };
    
    // Ejecutar después de que el contenido se haya cargado
    if (document.readyState === 'complete') {
      addCopyButtons();
    } else {
      window.addEventListener('load', addCopyButtons);
      // También intentar ejecutarlo después de un pequeño retraso para asegurar que
      // el contenido dinámico se ha renderizado
      setTimeout(addCopyButtons, 1000);
      return () => window.removeEventListener('load', addCopyButtons);
    }
  }, []);
  
  // Este componente no renderiza nada visible
  return null;
}
