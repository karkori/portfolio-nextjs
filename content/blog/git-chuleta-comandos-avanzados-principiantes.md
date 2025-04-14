---
title: Git para todos - La chuleta definitiva de comandos (de básicos a avanzados)
date: 2025-04-14T19:55:00.000Z
thumbnail: /images/blog/git-chuleta-comandos.png
description: Guía completa de referencia con los comandos más útiles de Git, desde lo básico hasta técnicas avanzadas, explicados de manera sencilla para principiantes y profesionales.
category: Dev-tools
tags:
  - git
  - control-versiones
  - dev-tools
  - terminal
  - chuleta
---

## Introducción

Git se ha convertido en la herramienta de control de versiones estándar para cualquier desarrollador. Sin embargo, su potencia viene con una curva de aprendizaje que puede resultar intimidante. 

Esta guía tipo "chuleta" está diseñada para servir como referencia rápida tanto para quienes empiezan con Git como para quienes quieren dominar técnicas más avanzadas. He organizado los comandos por contextos de uso, explicando de forma sencilla qué hace cada uno y cuándo utilizarlo.

## Configuración inicial

Antes de empezar a utilizar Git, debes configurar tu identidad:

```bash
# Configurar nombre
git config --global user.name "Tu Nombre"

# Configurar email
git config --global user.email "tu@email.com"

# Configurar editor predeterminado (ejemplo con VS Code)
git config --global core.editor "code --wait"

# Ver toda la configuración actual
git config --list
```

## Comandos básicos del día a día

### Iniciar y clonar repositorios

```bash
# Iniciar un repositorio nuevo
git init

# Clonar un repositorio existente
git clone https://github.com/usuario/repositorio.git

# Clonar una rama específica
git clone -b nombre-rama https://github.com/usuario/repositorio.git
```

### Gestionar cambios

```bash
# Ver el estado actual
git status

# Añadir archivos al área de preparación (staging)
git add nombre-archivo.txt    # Un solo archivo
git add .                     # Todos los archivos
git add *.js                  # Todos los archivos JS

# Realizar un commit
git commit -m "Mensaje descriptivo del cambio"

# Añadir y hacer commit en un solo paso (solo archivos ya rastreados)
git commit -am "Mensaje del commit"
```

### Trabajar con el historial

```bash
# Ver historial de commits
git log                       # Historial completo
git log --oneline             # Formato resumido
git log --graph --oneline     # Con representación gráfica

# Ver cambios específicos
git show a1b2c3d              # Detalles de un commit específico
git diff                      # Cambios no preparados para commit
git diff --staged             # Cambios preparados para commit
```

### Trabajar con ramas

```bash
# Ver ramas
git branch                    # Ramas locales
git branch -r                 # Ramas remotas
git branch -a                 # Todas las ramas

# Crear una rama
git branch nombre-rama

# Cambiar a una rama
git checkout nombre-rama
git switch nombre-rama        # En Git moderno

# Crear y cambiar a una nueva rama en un solo paso
git checkout -b nueva-rama
git switch -c nueva-rama      # En Git moderno

# Eliminar una rama
git branch -d nombre-rama     # Si ya está fusionada
git branch -D nombre-rama     # Forzar eliminación
```

### Sincronización con repositorios remotos

```bash
# Ver repositorios remotos
git remote -v

# Añadir un repositorio remoto
git remote add origin https://github.com/usuario/repositorio.git

# Descargar cambios sin fusionar
git fetch origin

# Descargar y fusionar cambios
git pull origin nombre-rama

# Subir cambios locales
git push origin nombre-rama

# Configurar tracking para hacer push/pull sin especificar origen
git branch --set-upstream-to=origin/nombre-rama
```

## Técnicas intermedias

### Fusión de ramas (Merge)

```bash
# Fusionar otra rama a la rama actual
git merge nombre-rama

# Fusionar sin commit automático
git merge --no-commit nombre-rama

# Abortar una fusión con conflictos
git merge --abort
```

### Stash: guardar cambios temporalmente

El stash es como un "bolsillo mágico" donde puedes guardar cambios sin hacer commit:

```bash
# Guardar cambios en el stash
git stash

# Guardar con un mensaje descriptivo
git stash save "Trabajando en nueva función, incompleta"

# Ver lista de stashes
git stash list

# Aplicar el último stash (manteniéndolo en la lista)
git stash apply

# Aplicar un stash específico
git stash apply stash@{2}

# Aplicar y eliminar el último stash 
git stash pop

# Eliminar el último stash
git stash drop

# Eliminar todos los stashes
git stash clear
```

### Reescribir historia (con cuidado)

```bash
# Modificar el último commit
git commit --amend -m "Nuevo mensaje para el último commit"

# Añadir archivos olvidados al último commit
git add archivo-olvidado.txt
git commit --amend --no-edit

# Rebase interactivo para los últimos N commits (reescribe la historia)
git rebase -i HEAD~3    # Para los últimos 3 commits
```

> ⚠️ **Advertencia**: Nunca reescribas la historia de ramas que ya han sido compartidas con otros, a menos que sepas exactamente lo que estás haciendo y hayas coordinado con tu equipo.

## Técnicas avanzadas

### Cherry-pick: aplicar commits específicos

El cherry-pick es como usar pinzas para tomar sólo el commit que necesitas:

```bash
# Aplicar un commit específico a la rama actual
git cherry-pick a1b2c3d

# Cherry-pick sin commit automático (para revisar antes)
git cherry-pick --no-commit a1b2c3d

# Cherry-pick de varios commits
git cherry-pick a1b2c3d f4g5h6i
```

### Rebase: reorganizar commits

Rebase es como levantar tu rama, moverla y volverla a colocar en otro punto:

```bash
# Rebasar tu rama sobre la rama principal actualizada
git checkout mi-rama
git rebase main

# Rebase interactivo (para limpiar/reordenar commits)
git rebase -i HEAD~5    # Para los últimos 5 commits

# Continuar un rebase después de resolver conflictos
git rebase --continue

# Abortar un rebase
git rebase --abort
```

### Gestión de etiquetas (tags)

```bash
# Crear una etiqueta ligera
git tag v1.0.0

# Crear una etiqueta anotada (con mensaje)
git tag -a v1.0.0 -m "Versión 1.0.0 - Lanzamiento inicial"

# Ver etiquetas
git tag

# Ver detalles de una etiqueta
git show v1.0.0

# Subir etiquetas al remoto
git push origin v1.0.0         # Una etiqueta específica
git push origin --tags         # Todas las etiquetas
```

### Reflog: tu red de seguridad

El reflog registra todos los movimientos del puntero HEAD, siendo una herramienta invaluable para recuperar commits "perdidos":

```bash
# Ver el reflog
git reflog

# Recuperar un estado anterior
git checkout HEAD@{2}    # Volver a donde estaba HEAD hace 2 movimientos

# Recuperar una rama eliminada
git checkout -b rama-recuperada HEAD@{4}    # Si la rama estaba en esa posición
```

### Bisect: encontrar errores

Git bisect es una herramienta de "detective" que te ayuda a encontrar en qué commit se introdujo un error:

```bash
# Iniciar bisect
git bisect start

# Marcar el commit actual como malo
git bisect bad

# Marcar un commit anterior conocido como bueno
git bisect good a1b2c3d

# Después de probar cada commit intermedio, marcarlo:
git bisect good    # Si funciona correctamente
git bisect bad     # Si el error persiste

# Finalizar búsqueda
git bisect reset
```

## Flujos de trabajo recomendados

### Git Flow simplificado

Git Flow es un modelo popular para organizar tus ramas:

1. **main/master**: Código en producción, siempre estable
2. **develop**: Rama de desarrollo, integra funcionalidades
3. **feature/\***: Ramas para nuevas funcionalidades
4. **hotfix/\***: Correcciones urgentes para producción
5. **release/\***: Preparación para lanzamiento

```bash
# Crear nueva funcionalidad
git checkout develop
git checkout -b feature/nueva-funcionalidad

# Una vez terminada, integrarla en develop
git checkout develop
git merge feature/nueva-funcionalidad

# Preparar lanzamiento
git checkout -b release/v1.1.0 develop

# Finalizar lanzamiento
git checkout main
git merge release/v1.1.0
git tag -a v1.1.0 -m "Versión 1.1.0"
git checkout develop
git merge release/v1.1.0
```

### GitHub Flow simplificado

Para equipos que prefieren un enfoque más sencillo:

1. **main**: Siempre desplegable
2. **feature-branches**: Ramas para cada cambio

```bash
# Crear rama para un cambio
git checkout -b mi-cambio

# Después de completar y probar localmente
git push -u origin mi-cambio

# Después de revisar y aprobar el Pull Request en GitHub
git checkout main
git pull
```

## Consejos prácticos para principiantes

### ¿Cómo arreglar errores comunes?

```bash
# "Oops, hice commit en la rama equivocada"
git branch rama-correcta    # Crear la rama correcta
git reset HEAD~1 --soft     # Deshacer el commit manteniendo los cambios
git stash                   # Guardar los cambios
git checkout rama-correcta  # Ir a la rama correcta
git stash pop               # Aplicar los cambios
git add .                   # Añadir los cambios
git commit -m "Mensaje"     # Hacer commit en la rama correcta

# "Quiero deshacer el último commit pero mantener los cambios"
git reset HEAD~1 --soft

# "Quiero deshacer cambios en un archivo y volver a la versión del último commit"
git checkout -- nombre-archivo.txt

# "Quiero deshacer todos los cambios locales (¡peligroso!)"
git reset --hard HEAD

# "Añadí algo al área de staging pero no quiero incluirlo en el commit"
git restore --staged nombre-archivo.txt    # Git moderno
git reset HEAD nombre-archivo.txt          # Git clásico
```

### Consejos para escribir buenos mensajes de commit

Un buen mensaje de commit debe:

1. Comenzar con un verbo en imperativo ("Añade", "Arregla", "Actualiza")
2. Ser breve pero descriptivo (idealmente menos de 50 caracteres)
3. Explicar el qué y el por qué, no el cómo

Ejemplo:
```bash
git commit -m "Añade validación de correo electrónico en formulario de registro"
```

Para mensajes más detallados:
```bash
git commit -m "Añade validación de correo electrónico" -m "Previene registros con emails inválidos y mejora la experiencia del usuario al mostrar mensajes de error específicos."
```

## Alias útiles para aumentar tu productividad

Puedes configurar alias para comandos que utilizas frecuentemente:

```bash
# Configurar alias
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.lg "log --graph --oneline --decorate"
git config --global alias.unstage "reset HEAD --"
```

Después podrás usarlos así:
```bash
git st        # Equivalente a git status
git co main   # Equivalente a git checkout main
git lg        # Muestra un log gráfico y condesado
```

## Trucos avanzados para impresionar a tus colegas

### Buscar texto en todo el historial

```bash
# Buscar en todos los commits dónde se añadió o eliminó una cadena
git log -S "texto-a-buscar"

# Buscar en todos los commits cuyo mensaje contiene cierto texto
git log --grep="texto-en-mensajes"
```

### Ver quién modificó cada línea (blame)

```bash
# Ver quién modificó cada línea de un archivo
git blame nombre-archivo.txt

# De manera más legible
git blame -w -C -C -C nombre-archivo.txt
```

### Limpiar archivos no rastreados

```bash
# Ver qué se eliminaría
git clean -n

# Eliminar archivos no rastreados
git clean -f

# Eliminar archivos y directorios no rastreados
git clean -fd
```

### Guardar y aplicar un conjunto de cambios como parche

```bash
# Crear parche a partir de cambios preparados
git diff --staged > mis-cambios.patch

# Aplicar un parche
git apply mis-cambios.patch
```

## Resolución de problemas comunes

### Conflictos de fusión

Cuando ocurren conflictos durante un merge o rebase:

1. Git marca los archivos con conflictos
2. Abre los archivos y busca las secciones marcadas con `<<<<<<<`, `=======` y `>>>>>>>`
3. Edita los archivos para resolver los conflictos
4. Añade los archivos resueltos con `git add`
5. Continúa con `git merge --continue` o `git rebase --continue`

```bash
# Herramienta visual para resolución de conflictos
git mergetool
```

### Problemas de permisos

```bash
# Hacer ejecutable un archivo
git update-index --chmod=+x script.sh

# Preservar permisos de ejecución
git config --global core.fileMode true
```

## Personalización de Git

### Ignorar archivos globalmente

```bash
# Crear archivo global de ignore
git config --global core.excludesfile ~/.gitignore_global

# Editar el archivo
echo ".DS_Store" >> ~/.gitignore_global
echo "*.log" >> ~/.gitignore_global
echo ".env" >> ~/.gitignore_global
```

### Configurar colores

```bash
# Habilitar colores
git config --global color.ui true

# Personalizar colores específicos
git config --global color.status.changed "blue normal bold"
```

## Conclusión

Git es una herramienta increíblemente poderosa cuyo dominio puede llevar tiempo. No te preocupes si no entiendes todos los comandos avanzados inmediatamente; comienza con los básicos y ve expandiendo tu conocimiento.

Recuerda que esta chuleta está pensada como referencia rápida. Si quieres profundizar en algún comando específico, el comando `git help <comando>` siempre es tu mejor amigo.

¿Tienes algún truco o comando favorito de Git que no hayamos incluido? ¡Compártelo en los comentarios!

## Recursos adicionales

- [Documentación oficial de Git](https://git-scm.com/doc)
- [GitHub Learning Lab](https://lab.github.com/)
- [Oh Shit, Git!?!](https://ohshitgit.com/) - Soluciones a problemas comunes
- [Git Flow Cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/)
