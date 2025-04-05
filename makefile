# Makefile para el proyecto tailwind-v4-guide-portfolio

# Variables
NPM := npm
NPM_RUN := $(NPM) run
PYTHON := python

PROJECT_DIR=$(pwd)

# Comandos principales
.PHONY: install dev build start lint tree

install:
	@echo "Instalando dependencias..."
	$(NPM) install

dev:
	@echo "Iniciando servidor de desarrollo..."
	$(NPM_RUN) dev

build:
	@echo "Construyendo proyecto para producción..."
	$(NPM_RUN) build

start:
	@echo "Iniciando servidor de producción..."
	$(NPM_RUN) start

lint:
	@echo "Ejecutando linter..."
	$(NPM_RUN) lint

# Comando para mostrar estructura del proyecto (Windows PowerShell)
tree:
	@echo "Estructura del proyecto:"
	@tree -I 'node_modules|.next|.git|build|coverage' -L 10 --dirsfirst


# Limpiar dependencias y caché
clean:
	@echo "Limpiando node_modules y caché..."
	rm -rf node_modules .next
	$(NPM) cache clean --force

# Reinstalar todo desde cero
reinstall: clean install

# Actualizar dependencias
update:
	@echo "Actualizando dependencias..."
	$(NPM) update
	$(NPM) outdated