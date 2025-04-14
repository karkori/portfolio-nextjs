---
title: Cómo Instalar y Configurar Docker en Windows desde la Terminal
date: 2025-04-14T13:15:00.000Z
thumbnail: /images/blog/docker-windows-terminal.png
description: Aprende a instalar Docker en Windows utilizando comandos de terminal, configurar el daemon, y administrar eficientemente contenedores sin necesidad de utilizar la interfaz gráfica.
category: Dev-tools
tags:
  - docker
  - windows
  - terminal
  - devops
  - dev-tools
---

## Introducción: Docker en Windows desde la línea de comandos

La virtualización y los contenedores han revolucionado la forma en que desarrollamos y desplegamos aplicaciones. Docker se ha convertido en el estándar de facto para la creación, distribución y ejecución de contenedores, y aunque muchos usuarios de Windows prefieren utilizar Docker Desktop con su interfaz gráfica, existe un enfoque más ligero y potente: trabajar con Docker directamente desde la terminal.

En mis años como desarrollador, he notado que muchos de mis colegas desconocen que pueden instalar y gestionar Docker completamente desde la línea de comandos en Windows. Esta aproximación no solo te da un mayor control sobre la configuración, sino que también puede ser más eficiente en términos de recursos del sistema, especialmente en máquinas con especificaciones modestas.

En este artículo, te mostraré paso a paso cómo instalar Docker en Windows utilizando herramientas como Chocolatey y Winget, configurar el daemon de Docker, y empezar a trabajar con contenedores sin necesidad de la interfaz gráfica de Docker Desktop. Además, explicaré las diferencias entre Docker CLI (línea de comandos) y Docker Desktop para que puedas elegir la opción que mejor se adapte a tus necesidades.

## Docker CLI vs Docker Desktop: ¿Cuál elegir?

Antes de sumergirnos en la instalación, es importante entender las diferencias entre las dos opciones principales para trabajar con Docker en Windows:

### Docker CLI (Línea de Comandos)

**Ventajas:**
- Menor consumo de recursos
- Mayor control sobre la configuración
- Ideal para servidores o entornos de CI/CD
- Perfecto para automatizar tareas con scripts
- No requiere licencia comercial para empresas grandes

**Desventajas:**
- Curva de aprendizaje más pronunciada
- Sin interfaz visual para monitorización
- Configuración manual más detallada

### Docker Desktop

**Ventajas:**
- Interfaz gráfica intuitiva
- Fácil monitorización de contenedores, imágenes y volúmenes
- Integración con Kubernetes
- Actualizaciones automáticas
- Configuración simplificada

**Desventajas:**
- Mayor consumo de recursos
- Requiere licencia comercial para empresas con más de 250 empleados o ingresos superiores a $10 millones
- Posibles conflictos con otras herramientas de virtualización

En mi experiencia, Docker CLI es la opción ideal si trabajas frecuentemente con scripts de automatización, valoras la eficiencia de recursos, o simplemente prefieres el control que ofrece la línea de comandos. Por otro lado, si estás comenzando con Docker o prefieres una experiencia más visual, Docker Desktop puede ser más adecuado.

## Requisitos previos

Antes de comenzar con la instalación, asegúrate de cumplir con estos requisitos:

1. **Sistema operativo compatible:**
   - Windows 10 64-bit: Pro, Enterprise o Education (Build 18363 o posterior)
   - Windows 11 64-bit: Home, Pro, Enterprise o Education

2. **Características de Windows necesarias:**
   - WSL 2 (Windows Subsystem for Linux)
   - Virtualización habilitada en la BIOS/UEFI

3. **Hardware mínimo:**
   - Procesador de 64-bit con soporte para virtualización (SLAT)
   - 4GB de RAM como mínimo (8GB recomendado)
   - Virtualización habilitada en la BIOS/UEFI

Para habilitar WSL 2 y la plataforma de máquina virtual, puedes abrir PowerShell como administrador y ejecutar:

```powershell
# Habilitar la característica WSL
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# Habilitar la característica de plataforma de máquina virtual
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Reiniciar el sistema después de ejecutar estos comandos
```

## Opción 1: Instalación con WinGet (Recomendado para Windows 11)

WinGet es el gestor de paquetes oficial de Microsoft introducido en Windows 10 y mejorado en Windows 11. Es una forma rápida y sencilla de instalar Docker.

### Verificar si WinGet está instalado

Abre PowerShell o la Terminal de Windows y ejecuta:

```powershell
winget --version
```

Si no está instalado, puedes instalarlo desde la Microsoft Store buscando "App Installer".

### Instalar Docker Desktop con WinGet

Para instalar Docker Desktop completo (incluye Docker CLI):

```powershell
winget install Docker.DockerDesktop
```

Si solo quieres instalar Docker CLI sin la interfaz gráfica:

```powershell
winget install Docker.DockerCLI
```

Tras la instalación, reinicia tu sistema para asegurar que todos los componentes se inicialicen correctamente.

## Opción 2: Instalación con Chocolatey

Si ya tienes [Chocolatey](https://community.chocolatey.org/packages/chocolatey) instalado en tu sistema (como vimos en nuestro [artículo anterior](/blog/guia-completa-instalar-configurar-chocolatey-windows)), puedes utilizarlo para instalar Docker.

### Instalar Docker Desktop completo

```powershell
choco install docker-desktop -y
```

### Instalar solo Docker CLI

Si prefieres instalar únicamente la versión de línea de comandos:

```powershell
choco install docker-cli -y
```

Para una instalación más completa sin Docker Desktop, puedes instalar también Docker Machine y Docker Compose:

```powershell
choco install docker-cli docker-machine docker-compose -y
```

## Opción 3: Instalación manual desde el archivo ejecutable

Para quienes prefieren el método tradicional:

1. Descarga el instalador de Docker Desktop desde [la página oficial](https://docs.docker.com/desktop/install/windows-install/).
2. Ejecuta el instalador como administrador.
3. Sigue las instrucciones en pantalla, asegurándote de seleccionar "Usar WSL 2" cuando se te solicite.
4. Completa la instalación y reinicia el sistema.

Si quieres instalar Docker Desktop desde la línea de comandos después de descargar el instalador:

```powershell
# Reemplaza la ruta con la ubicación donde descargaste el instalador
Start-Process 'C:\ruta\Docker Desktop Installer.exe' -Wait -ArgumentList 'install', '--quiet', '--accept-license'
```

## Configuración del daemon de Docker

Una vez instalado Docker, podemos configurar el daemon para personalizar su comportamiento. En Windows, la configuración se realiza principalmente a través del archivo `daemon.json`.

### Ubicación del archivo de configuración

El archivo de configuración se encuentra en `C:\ProgramData\Docker\config\daemon.json`. Si no existe, puedes crearlo manualmente.

### Configuraciones comunes

Aquí hay algunas configuraciones útiles que puedes añadir al archivo `daemon.json`:

```json
{
  "data-root": "D:\\Docker",
  "hosts": ["tcp://0.0.0.0:2375", "npipe://"],
  "registry-mirrors": ["https://mirror.gcr.io"],
  "dns": ["8.8.8.8", "8.8.4.4"],
  "experimental": true,
  "debug": true,
  "log-level": "info"
}
```

Expliquemos estas configuraciones:
- `data-root`: Cambia la ubicación donde Docker almacena sus datos (útil para moverlo a un disco con más espacio).
- `hosts`: Define cómo se puede acceder al daemon de Docker (el valor predeterminado en Windows es solo `npipe://`).
- `registry-mirrors`: Espejos para acelerar la descarga de imágenes.
- `dns`: Servidores DNS a utilizar para la resolución de nombres.
- `experimental`: Habilita características experimentales.
- `debug` y `log-level`: Controla la verbosidad de los logs.

### Aplicar cambios de configuración

Después de modificar el archivo `daemon.json`, necesitas reiniciar el servicio de Docker:

```powershell
# Detener el servicio
Stop-Service docker

# Iniciar el servicio
Start-Service docker
```

## Comandos básicos de Docker

Una vez instalado y configurado Docker, aquí tienes algunos comandos esenciales para comenzar a trabajar:

### Comprobar la instalación

```powershell
# Verificar la versión de Docker
docker --version

# Verificar que Docker puede crear contenedores
docker run hello-world
```

### Gestión de imágenes

```powershell
# Listar imágenes
docker images

# Descargar una imagen
docker pull ubuntu:latest

# Eliminar una imagen
docker rmi ubuntu:latest
```

### Gestión de contenedores

```powershell
# Crear y ejecutar un contenedor
docker run -it --name mi_ubuntu ubuntu:latest bash

# Listar contenedores en ejecución
docker ps

# Listar todos los contenedores (incluidos los detenidos)
docker ps -a

# Detener un contenedor
docker stop mi_ubuntu

# Iniciar un contenedor detenido
docker start mi_ubuntu

# Eliminar un contenedor
docker rm mi_ubuntu
```

### Redes y volúmenes

```powershell
# Crear una red
docker network create mi_red

# Listar redes
docker network ls

# Crear un volumen
docker volume create mi_volumen

# Listar volúmenes
docker volume ls
```

## Configuraciones avanzadas

### Configurar Docker para usar un proxy

Si estás detrás de un proxy corporativo, puedes configurarlo en el archivo `daemon.json`:

```json
{
  "proxies": {
    "http-proxy": "http://proxy.ejemplo.com:8080",
    "https-proxy": "http://proxy.ejemplo.com:8080",
    "no-proxy": "localhost,127.0.0.1"
  }
}
```

También puedes configurar el proxy para el cliente Docker en tu perfil de PowerShell:

```powershell
[Environment]::SetEnvironmentVariable("HTTP_PROXY", "http://proxy.ejemplo.com:8080", [EnvironmentVariableTarget]::Machine)
[Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://proxy.ejemplo.com:8080", [EnvironmentVariableTarget]::Machine)
[Environment]::SetEnvironmentVariable("NO_PROXY", "localhost,127.0.0.1", [EnvironmentVariableTarget]::Machine)
```

### Configurar acceso remoto al daemon de Docker

Para permitir conexiones remotas al daemon de Docker, modifica el archivo `daemon.json`:

```json
{
  "hosts": ["tcp://0.0.0.0:2375", "npipe://"]
}
```

También puedes configurarlo mediante el servicio de Windows:

```powershell
# Configurar el servicio para escuchar en TCP
sc config docker binpath= "\"C:\Program Files\docker\dockerd.exe\" --run-service -H tcp://0.0.0.0:2375"
```

> ⚠️ **Advertencia**: Habilitar el acceso remoto sin TLS puede ser un riesgo de seguridad. En entornos de producción, considera configurar TLS.

### Configurar TLS para conexiones seguras

Para mayor seguridad, configura TLS para las conexiones al daemon de Docker:

```json
{
  "hosts": ["tcp://0.0.0.0:2376", "npipe://"],
  "tlsverify": true,
  "tlscacert": "C:\\ProgramData\\docker\\certs.d\\ca.pem",
  "tlscert": "C:\\ProgramData\\docker\\certs.d\\server-cert.pem",
  "tlskey": "C:\\ProgramData\\docker\\certs.d\\server-key.pem"
}
```

## Solución de problemas comunes

### Docker no inicia después de la instalación

**Problema**: Docker no inicia después de la instalación.

**Solución**: Verifica que WSL 2 esté correctamente instalado y configurado:

```powershell
# Verifica la versión de WSL
wsl --status
# Actualiza a WSL 2 si es necesario
wsl --set-default-version 2
```

### Error de conexión al daemon

**Problema**: Recibes un error como "Cannot connect to the Docker daemon".

**Solución**: Verifica que el servicio de Docker esté en ejecución:

```powershell
# Verificar el estado del servicio
Get-Service docker

# Iniciar el servicio si está detenido
Start-Service docker
```

### Problemas con permisos

**Problema**: No tienes permisos para usar Docker.

**Solución**: Asegúrate de que tu usuario esté en el grupo "docker-users":

```powershell
# Añadir usuario al grupo docker-users
net localgroup docker-users $env:USERNAME /add

# Cerrar sesión y volver a iniciarla para que los cambios surtan efecto
```

### Docker consume demasiados recursos

**Problema**: Docker consume demasiada memoria o CPU.

**Solución**: Limita los recursos asignados a WSL 2 creando un archivo `.wslconfig` en tu directorio de usuario:

```
# Archivo: C:\Users\<tu-usuario>\.wslconfig
[wsl2]
memory=4GB
processors=2
```

## Desinstalación de Docker

Si necesitas desinstalar Docker, puedes hacerlo desde la línea de comandos:

### Desinstalar con WinGet

```powershell
winget uninstall Docker.DockerDesktop
```

### Desinstalar con Chocolatey

```powershell
choco uninstall docker-desktop -y
# O para desinstalar solo el CLI
choco uninstall docker-cli -y
```

### Limpieza completa después de la desinstalación

```powershell
# Eliminar redes de Docker
Get-HNSNetwork | Remove-HNSNetwork

# Eliminar datos de Docker
Remove-Item "C:\ProgramData\Docker" -Recurse -Force

# Desactivar la característica de contenedores de Windows
Disable-WindowsOptionalFeature -Online -FeatureName Containers -NoRestart
```

## Conclusión: Docker desde la terminal, potencia y control

Después de varios años utilizando Docker en diferentes entornos, me he dado cuenta de que trabajar con Docker desde la línea de comandos me ofrece un nivel de control y flexibilidad que simplemente no puedo conseguir con la interfaz gráfica. La capacidad de automatizar tareas, crear scripts personalizados y optimizar el rendimiento ha hecho que mi flujo de trabajo sea mucho más eficiente.

Aunque Docker Desktop tiene su lugar, especialmente para usuarios nuevos o para quienes prefieren interfaces visuales, la versión de línea de comandos te proporciona una comprensión más profunda de cómo funciona Docker y te permite aprovechar al máximo su potencial.

Ya sea que elijas Docker CLI o Docker Desktop, lo importante es que ahora conoces ambas opciones y puedes tomar una decisión informada según tus necesidades y preferencias. ¿Ya has decidido qué enfoque vas a utilizar? ¿Prefieres la línea de comandos o la interfaz gráfica? Comparte tu experiencia en los comentarios.

## Recursos adicionales

- [Documentación oficial de Docker](https://docs.docker.com/engine/reference/commandline/cli/)
- [Configuración del daemon de Docker en Windows](https://docs.docker.com/config/daemon/systemd/)
- [WSL 2 y Docker](https://docs.docker.com/desktop/wsl/)
- [Lista completa de comandos de Docker](https://docs.docker.com/engine/reference/commandline/docker/)
