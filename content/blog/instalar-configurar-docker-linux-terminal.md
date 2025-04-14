---
title: Guía Rápida para Instalar y Configurar Docker en Linux
date: 2025-04-14T08:15:00.000Z
thumbnail: /images/blog/docker-linux-terminal.png
description: Aprende a instalar, configurar y utilizar Docker en sistemas Linux con comandos sencillos desde la terminal. Una guía eficiente para desarrolladores.
category: Dev-tools
tags:
  - docker
  - linux
  - terminal
  - dev-tools
  - containers
---

## Introducción: Docker en Linux

Docker y Linux son una combinación perfecta. Al contrario que en Windows, donde Docker necesita una capa adicional de virtualización (como vimos en nuestro [artículo sobre Docker en Windows](/blog/instalar-configurar-docker-windows-terminal)), en Linux los contenedores pueden ejecutarse de forma nativa, lo que ofrece mejor rendimiento y menor sobrecarga del sistema.

En este artículo, te mostraré cómo instalar Docker en las distribuciones Linux más populares, configurarlo correctamente y empezar a trabajar con contenedores desde la terminal. La meta es que puedas tener Docker funcionando en cuestión de minutos.

## Instalación de Docker en diferentes distribuciones

### Ubuntu/Debian

La instalación en Ubuntu y Debian es prácticamente idéntica. Estos comandos funcionan en Ubuntu 20.04, 22.04, 24.04 y Debian 11, 12.

```bash
# 1. Actualizar el índice de paquetes
sudo apt update

# 2. Instalar paquetes necesarios
sudo apt install -y ca-certificates curl gnupg lsb-release

# 3. Añadir la clave GPG oficial de Docker
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 4. Configurar el repositorio
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 5. Actualizar de nuevo e instalar Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

Para Debian, solo necesitas reemplazar `ubuntu` por `debian` en las URLs.

### Fedora/RHEL/CentOS/Rocky Linux

Para distribuciones basadas en Red Hat, el proceso es similar:

```bash
# 1. Instalar el paquete yum-utils
sudo dnf install -y yum-utils

# 2. Añadir el repositorio de Docker
sudo yum-config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo

# 3. Instalar Docker
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

Para RHEL/CentOS/Rocky Linux, reemplaza `fedora` en la URL del repositorio por `centos`.

### Arch Linux

En Arch Linux, Docker está disponible directamente en los repositorios oficiales:

```bash
sudo pacman -Syu
sudo pacman -S docker
```

## Configuración post-instalación

### 1. Iniciar y habilitar el servicio de Docker

```bash
# Iniciar Docker
sudo systemctl start docker

# Configurar Docker para que inicie con el sistema
sudo systemctl enable docker

# Verificar que Docker esté funcionando
sudo docker run hello-world
```

### 2. Añadir tu usuario al grupo docker

Para poder ejecutar Docker sin necesidad de `sudo`:

```bash
# Crear el grupo docker (probablemente ya exista)
sudo groupadd docker

# Añadir tu usuario al grupo
sudo usermod -aG docker $USER

# Aplicar los cambios (necesitarás cerrar sesión y volver a iniciarla)
# O alternativamente:
newgrp docker
```

### 3. Configurar el daemon de Docker

Para personalizar la configuración de Docker, puedes editar el archivo `/etc/docker/daemon.json` (similar a como lo hacemos en [Windows con el archivo daemon.json](/blog/instalar-configurar-docker-windows-terminal#configuración-del-daemon-de-docker)):

```bash
sudo mkdir -p /etc/docker
sudo nano /etc/docker/daemon.json
```

Añade la configuración deseada. Por ejemplo:

```json
{
  "data-root": "/ruta/personalizada/docker",
  "storage-driver": "overlay2",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "default-address-pools": [
    {"base":"172.17.0.0/16","size":24}
  ],
  "registry-mirrors": ["https://registry-mirror.example.com"]
}
```

Después de modificar la configuración, reinicia Docker:

```bash
sudo systemctl restart docker
```

## Comandos esenciales de Docker

Los comandos básicos son iguales a los que utilizamos en [Windows](/blog/instalar-configurar-docker-windows-terminal#comandos-básicos-de-docker), lo que hace que Docker sea una herramienta muy portable entre sistemas operativos.

### Gestión de imágenes

```bash
# Buscar imágenes en Docker Hub
docker search nginx

# Descargar una imagen
docker pull nginx:latest

# Listar imágenes locales
docker images

# Eliminar una imagen
docker rmi nginx:latest
```

### Gestión de contenedores

```bash
# Crear y ejecutar un contenedor
docker run -d --name mi-nginx -p 8080:80 nginx

# Listar contenedores en ejecución
docker ps

# Listar todos los contenedores (incluyendo los detenidos)
docker ps -a

# Detener un contenedor
docker stop mi-nginx

# Iniciar un contenedor
docker start mi-nginx

# Ver logs de un contenedor
docker logs mi-nginx

# Ejecutar un comando dentro de un contenedor
docker exec -it mi-nginx bash

# Eliminar un contenedor
docker rm mi-nginx
```

### Redes y volúmenes

```bash
# Crear una red
docker network create mi-red

# Listar redes
docker network ls

# Crear un volumen
docker volume create mi-volumen

# Listar volúmenes
docker volume ls

# Usar un volumen en un contenedor
docker run -d --name mi-nginx -v mi-volumen:/usr/share/nginx/html nginx
```

## Usando Docker Compose

Docker Compose facilita la gestión de aplicaciones multi-contenedor. Viene incluido en las instalaciones recientes de Docker.

Crea un archivo `docker-compose.yml`:

```yaml
version: '3'
services:
  web:
    image: nginx:latest
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html
  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: example
      MYSQL_DATABASE: webdata
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

Comandos básicos:

```bash
# Iniciar los servicios
docker compose up -d

# Ver logs
docker compose logs

# Detener los servicios
docker compose down

# Detener y eliminar volúmenes
docker compose down -v
```

## Consejos de seguridad y rendimiento

### Limitar recursos de los contenedores

```bash
# Limitar CPU y memoria
docker run -d --name mi-nginx --memory="512m" --cpus="1.0" nginx
```

### Mantener Docker actualizado

```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade

# Fedora/RHEL
sudo dnf update
```

### Escanear vulnerabilidades en imágenes

```bash
# Instalar Trivy (escáner de vulnerabilidades)
# Para Ubuntu/Debian
sudo apt install trivy

# Escanear una imagen
trivy image nginx:latest
```

## Solución de problemas comunes

### El servicio de Docker no inicia

```bash
# Verificar el estado
sudo systemctl status docker

# Ver logs
sudo journalctl -u docker.service
```

### Problemas de permisos

Si obtienes errores de "permission denied" al intentar conectarte al socket de Docker:

```bash
# Verificar pertenencia al grupo docker
groups $USER

# Si no estás en el grupo, añadirte de nuevo
sudo usermod -aG docker $USER
```

### Limpiar espacio en disco

Con el tiempo, Docker puede consumir mucho espacio en disco. Para limpiarlo:

```bash
# Eliminar contenedores detenidos, redes no utilizadas, imágenes sin usar y caché de construcción
docker system prune -a

# Para incluir también los volúmenes sin usar (¡ten cuidado!)
docker system prune -a --volumes
```

## Comparación con Windows y macOS

A diferencia de [Windows](/blog/instalar-configurar-docker-windows-terminal#docker-cli-vs-docker-desktop-cuál-elegir) y macOS donde Docker utiliza una máquina virtual para ejecutar los contenedores, en Linux:

- Los contenedores se ejecutan de forma nativa (mejor rendimiento)
- No hay límites arbitrarios de memoria o CPU
- No se necesita Docker Desktop (ahorrando recursos y evitando licencias comerciales)
- Mejor integración con el sistema anfitrión

Esta ventaja hace que Linux sea la plataforma preferida para Docker en entornos de producción.

## Conclusión

Docker en Linux ofrece la experiencia más pura y eficiente para trabajar con contenedores. La instalación es sencilla, y una vez configurado correctamente, podrás aprovechar toda la potencia de la contenerización en tus proyectos.

Si vienes de [Windows](/blog/instalar-configurar-docker-windows-terminal) o macOS, notarás una mejora significativa en rendimiento y en la simplicidad de la configuración. Y lo mejor es que los comandos y conceptos son exactamente los mismos, por lo que tu conocimiento es transferible entre plataformas.

¿Ya utilizas Docker en Linux? ¿Has notado la diferencia respecto a otras plataformas? Comparte tu experiencia en los comentarios.

## Recursos adicionales

- [Documentación oficial de Docker](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/) para encontrar imágenes
- [Awesome Docker](https://github.com/veggiemonk/awesome-docker) - Colección de recursos
- [Instalar y configurar Docker en Windows](/blog/instalar-configurar-docker-windows-terminal) - Nuestro artículo sobre Docker en Windows
