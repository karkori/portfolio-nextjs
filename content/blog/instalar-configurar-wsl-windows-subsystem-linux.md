---
title: Guía Completa para Instalar y Configurar WSL en Windows en 2025
date: 2025-04-14T17:15:00.000Z
thumbnail: /images/blog/wsl-windows-linux.png
description: Aprende a instalar, configurar y optimizar Windows Subsystem for Linux (WSL) para ejecutar distribuciones Linux en Windows con un rendimiento óptimo y funcionalidades avanzadas.
category: desarrollo
tags:
  - windows
  - linux
  - wsl
  - desarrollo
  - terminal
---

## Introducción: El poder de Linux en Windows

Durante años, los desarrolladores que trabajaban en entornos Windows tenían que decidir: usar herramientas nativas de Windows o recurrir a máquinas virtuales para acceder a las potentes herramientas de desarrollo de Linux. Con Windows Subsystem for Linux (WSL), Microsoft revolucionó esta dinámica permitiendo ejecutar distribuciones Linux directamente en Windows.

Como desarrollador que ha trabajado en múltiples plataformas, WSL ha transformado mi flujo de trabajo. Recuerdo cuando tenía que mantener una máquina virtual completa solo para ejecutar algunos comandos de Linux o probar código en entornos Unix. Ahora, con WSL, puedo cambiar entre entornos Windows y Linux sin problemas.

En 2025, WSL ha evolucionado significativamente desde sus primeras versiones. En este artículo, te mostraré cómo instalar, configurar y optimizar WSL para aprovechar al máximo esta poderosa herramienta en tu flujo de trabajo de desarrollo.

## WSL 1 vs WSL 2: Entendiendo las diferencias

Antes de comenzar la instalación, es importante entender las diferencias entre WSL 1 y WSL 2, ya que esto afectará a tu experiencia:

### WSL 1
- Usa una capa de traducción para convertir llamadas del sistema Linux a equivalentes en Windows
- Menor uso de recursos
- Mejor rendimiento al acceder a archivos en unidades de Windows (/mnt/c/)
- Compatible con más hardware (no requiere virtualización)

### WSL 2
- Utiliza un kernel Linux real en una máquina virtual ligera
- Mejor rendimiento de I/O del sistema de archivos Linux
- Compatibilidad total con llamadas al sistema Linux
- Soporte para Docker y otras herramientas que requieren funcionalidades avanzadas del kernel
- Soporte para aplicaciones gráficas (GUI) de Linux

**En 2025, WSL 2 es la versión recomendada** por su mayor compatibilidad y rendimiento, aunque en algunos casos específicos WSL 1 puede seguir siendo útil.

## Requisitos previos

Para instalar WSL 2 en Windows, necesitarás:

- Windows 10 versión 2004 (Build 19041) o superior, o Windows 11
- Un procesador con soporte para virtualización (la mayoría de CPUs modernas lo tienen)
- Al menos 4GB de RAM (recomendado 8GB o más)
- Virtualización habilitada en la BIOS/UEFI

## Instalación de WSL

En 2025, Microsoft ha simplificado enormemente la instalación de WSL. Lo que antes requería múltiples pasos ahora se puede hacer con un solo comando.

### Método 1: Instalación con un solo comando (Recomendado)

Abre PowerShell o el Símbolo del sistema como administrador y ejecuta:

```powershell
wsl --install
```

Este comando realiza automáticamente las siguientes acciones:
- Habilita las características opcionales necesarias
- Descarga e instala el kernel de Linux más reciente
- Establece WSL 2 como versión predeterminada
- Instala Ubuntu como distribución predeterminada

Después de ejecutar el comando, necesitarás reiniciar tu sistema. Cuando vuelvas a iniciar, Windows completará la instalación y te pedirá que configures un nombre de usuario y contraseña para tu distribución de Linux.

### Método 2: Instalación de una distribución específica

Si prefieres instalar una distribución diferente a Ubuntu (la predeterminada), puedes usar:

```powershell
wsl --list --online
```

Este comando mostrará todas las distribuciones disponibles. Para instalar una específica:

```powershell
wsl --install -d <Nombre_Distribución>
```

Por ejemplo, para instalar Debian:

```powershell
wsl --install -d Debian
```

### Método 3: Instalación manual para más control

Si prefieres un enfoque más detallado o estás en una versión anterior de Windows, puedes seguir estos pasos:

1. Habilitar la característica opcional WSL:

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

2. Habilitar la característica de Plataforma de Máquina Virtual:

```powershell
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

3. Reiniciar el sistema

4. Descargar e instalar el paquete de actualización del kernel de Linux:
   [Descargar paquete de actualización](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)

5. Establecer WSL 2 como versión predeterminada:

```powershell
wsl --set-default-version 2
```

6. Instalar una distribución desde Microsoft Store o usando comandos de PowerShell

## Configuración básica post-instalación

Una vez instalado WSL, hay algunas configuraciones iniciales que recomiendo realizar para mejorar tu experiencia:

### 1. Actualizar tu sistema Linux

Lo primero que debes hacer después de instalar cualquier distribución Linux es actualizar sus paquetes:

```bash
# Para distribuciones basadas en Debian (Ubuntu, Debian, Kali, etc.)
sudo apt update && sudo apt upgrade -y

# Para distribuciones basadas en Fedora (Fedora Remix para WSL)
sudo dnf update -y

# Para distribuciones basadas en SUSE (openSUSE)
sudo zypper update
```

### 2. Configurar la integración con Windows Terminal

Windows Terminal ofrece una excelente integración con WSL. Si aún no lo tienes instalado, puedes descargarlo desde la [Microsoft Store](https://apps.microsoft.com/detail/9n0dx20hk701).

Después de instalarlo, Windows Terminal detectará automáticamente tus distribuciones de WSL y las mostrará en el menú desplegable. Puedes personalizar cada perfil de distribución desde la configuración de Windows Terminal para cambiar el icono, el esquema de colores, la fuente y más.

### 3. Habilitar systemd (si tu distribución lo soporta)

A partir de 2023, WSL comenzó a soportar systemd, lo que permite ejecutar servicios como bases de datos, servidores web y otras aplicaciones que dependen de este sistema. Para habilitarlo en tu distribución, edita el archivo `/etc/wsl.conf`:

```bash
sudo nano /etc/wsl.conf
```

Y añade lo siguiente:

```ini
[boot]
systemd=true
```

Guarda el archivo (Ctrl+O, Enter) y sal del editor (Ctrl+X). Luego reinicia tu distribución de WSL:

```powershell
wsl --shutdown
```

La próxima vez que inicies tu distribución, systemd estará habilitado.

## Configuración avanzada con archivos de configuración

WSL ofrece dos archivos de configuración principales para personalizar tu experiencia:

### 1. Archivo .wslconfig (Configuración global de WSL)

Este archivo se ubica en tu directorio de usuario de Windows (`C:\Users\<TuUsuario>\.wslconfig`) y afecta a todas las distribuciones de WSL 2. Algunas configuraciones útiles:

```ini
[wsl2]
# Asigna memoria a WSL2 (en GB)
memory=8GB
# Asigna núcleos de CPU
processors=4
# Personaliza la ruta del kernel de Linux
# kernel=C:\\temp\\myCustomKernel
# Habilita soporte para GPU (disponible a partir de 2021)
gpuSupport=true
# Configura la carga de trabajo de la GPU (Directx o Compute)
# guiApplications=true
# Asigna espacio de swap
swap=4GB
# Deshabilita la hibernación de WSL para mejor rendimiento
# (puede aumentar el uso de RAM)
localhostForwarding=true
# Deshabilita paginación anidada para mejor rendimiento
nestedVirtualization=true
# Habilita DNS Proxy
# dnsTunneling=true
# Habilita el soporte de firewall
# firewallSupport=true
```

### 2. Archivo wsl.conf (Configuración por distribución)

Este archivo se ubica dentro de cada distribución Linux en `/etc/wsl.conf` y controla configuraciones específicas de esa distribución:

```ini
[automount]
# Monta unidades de Windows en un directorio personalizado
root = /mnt/
# Opciones de montaje para las unidades de Windows
options = "metadata,umask=22,fmask=11"
# Monta automáticamente unidades de red de Windows
mountFsTab = true

[network]
# Genera resolv.conf desde /etc/wsl.conf
generateResolvConf = true
# Establece un hostname personalizado
hostname = wsl-dev

[interop]
# Habilita la ejecución de comandos de Windows desde Linux
enabled = true
# Añade binarios de Windows al PATH de Linux
appendWindowsPath = true

[boot]
# Habilita systemd
systemd = true

[user]
# Usuario predeterminado para iniciar sesión
default = tuusuario
```

Después de editar cualquiera de estos archivos, debes reiniciar WSL para aplicar los cambios:

```powershell
wsl --shutdown
```

## Instalación y uso de aplicaciones GUI de Linux

Una de las características más impresionantes de WSL en 2025 es el soporte mejorado para aplicaciones gráficas de Linux, que ahora se integran perfectamente con el escritorio de Windows.

### 1. Requisitos previos

Para usar aplicaciones GUI de Linux, necesitas:
- WSL 2 actualizado (`wsl --update`)
- Un controlador de GPU actualizado compatible con WSLg

### 2. Instalación de aplicaciones gráficas populares

Aquí hay algunos ejemplos de aplicaciones gráficas útiles para desarrolladores:

```bash
# Editor de texto/IDE
sudo apt install gedit code -y

# Herramientas gráficas de Git
sudo apt install gitk git-gui -y

# Navegador de archivos
sudo apt install nautilus -y

# Herramientas de imagen
sudo apt install gimp -y

# Navegador web
sudo apt install firefox -y
```

Estas aplicaciones aparecerán en tu menú de inicio de Windows bajo la categoría de tu distribución Linux, y puedes anclarlas a la barra de tareas como cualquier aplicación de Windows.

## Personalización del entorno de desarrollo

Para convertir tu instalación de WSL en un entorno de desarrollo potente, aquí hay algunas configuraciones adicionales:

### 1. Configurar Git para que funcione en ambos sistemas

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tuemail@ejemplo.com"
git config --global credential.helper "/mnt/c/Program\ Files/Git/mingw64/bin/git-credential-manager.exe"
```

Esta configuración permite compartir credenciales entre Windows y WSL.

### 2. Instalar herramientas de desarrollo esenciales

```bash
# Herramientas básicas de compilación
sudo apt install build-essential -y

# Python y herramientas
sudo apt install python3 python3-pip python3-venv -y

# Node.js y npm (versión LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# Docker (usando el cliente Docker en WSL conectado al motor Docker en Windows)
sudo apt install docker.io -y
```

### 3. Configurar Visual Studio Code con WSL

Visual Studio Code tiene una excelente integración con WSL a través de la extensión "Remote - WSL". Para instalarla:

1. Instala VS Code en Windows
2. Abre VS Code
3. Ve a la pestaña de extensiones (o presiona Ctrl+Shift+X)
4. Busca y instala "Remote - WSL"

Ahora puedes abrir cualquier directorio en WSL directamente desde VS Code:
- Desde la terminal de WSL, navega al directorio y escribe `code .`
- O desde VS Code, usa el comando "WSL: Connect to WSL" (F1 → escribir "WSL")

## Optimización de rendimiento

Para asegurarte de que WSL funcione de manera óptima, considera estas recomendaciones:

### 1. Ubicación de archivos

Los archivos ubicados en el sistema de archivos de Linux (`/home/<usuario>/...`) tendrán un rendimiento mucho mejor que los archivos en el sistema de Windows (`/mnt/c/...`). Siempre que sea posible, mantén tus proyectos en el sistema de archivos de Linux.

### 2. Ajustes de memoria y CPU

Si tu sistema tiene suficientes recursos, aumenta la asignación de memoria y CPU para WSL editando el archivo `.wslconfig` como se mostró anteriormente.

### 3. Evitar operaciones intensivas en directorios montados

Las operaciones como búsquedas recursivas de archivos (`find`, `grep -r`, etc.) o compilaciones que generan muchos archivos temporales pueden ser muy lentas en directorios montados desde Windows. Usa el sistema de archivos nativo de Linux para estas operaciones.

### 4. Usar SSD para almacenamiento

WSL tiene un rendimiento significativamente mejor cuando se ejecuta desde una unidad SSD en comparación con un disco duro tradicional.

## Integración con Docker

Docker funciona excepcionalmente bien con WSL 2. Hay dos enfoques principales:

### 1. Docker Desktop para Windows con integración WSL 2

Esta es la opción más sencilla y recomendada:

1. Instala [Docker Desktop para Windows](https://www.docker.com/products/docker-desktop/)
2. En la configuración de Docker Desktop, habilita la integración con WSL 2
3. Selecciona las distribuciones con las que quieres integrar Docker

Con esta configuración, puedes usar los comandos Docker directamente desde tu distribución de WSL sin necesidad de instalar Docker dentro de Linux.

### 2. Docker nativo en WSL 2

Alternativamente, puedes instalar Docker directamente en tu distribución de WSL:

```bash
# Instalar dependencias
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common

# Añadir la clave GPG oficial de Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Añadir el repositorio de Docker
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Instalar Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io

# Añadir tu usuario al grupo docker (para ejecutar Docker sin sudo)
sudo usermod -aG docker $USER

# Iniciar el servicio Docker (requiere systemd habilitado)
sudo systemctl enable --now docker
```

## Solución de problemas comunes

### Problema 1: Error "WslRegisterDistribution failed with error: 0x80370102"

Este error indica un problema con la virtualización:

**Solución:**
1. Asegúrate de que la virtualización esté habilitada en la BIOS/UEFI
2. Verifica que no haya otro hipervisor (como VirtualBox) interfiriendo
3. En PowerShell, ejecuta:
   ```powershell
   Enable-WindowsOptionalFeature -Online -FeatureName VirtualMachinePlatform -NoRestart
   ```

### Problema 2: No se pueden ejecutar aplicaciones GUI

**Solución:**
1. Asegúrate de tener WSL actualizado: `wsl --update`
2. Verifica que estés usando WSL 2: `wsl -l -v`
3. Actualiza los controladores de tu GPU
4. Intenta crear un archivo ~/.bashrc y añadir: `export DISPLAY=:0`

### Problema 3: Rendimiento lento en directorios de Windows

**Solución:**
1. Mueve tus proyectos al sistema de archivos de Linux (`/home/username/...`)
2. Si necesitas trabajar en directorios de Windows, considera usar montajes DrvFs con opciones de caché:
   ```ini
   [automount]
   options = "metadata,uid=1000,gid=1000,umask=22,fmask=111,case=off"
   ```

### Problema 4: WSL consume demasiada memoria

**Solución:**
1. Limita la memoria de WSL en el archivo `.wslconfig`:
   ```ini
   [wsl2]
   memory=4GB
   swap=2GB
   ```
2. Cierra WSL cuando no lo uses: `wsl --shutdown`

## Actualizaciones y mantenimiento

### Actualizar el kernel de WSL

Para actualizar el kernel de WSL y otros componentes:

```powershell
wsl --update
```

Para verificar la versión actual del kernel:

```bash
uname -r
```

### Gestionar distribuciones de WSL

Listar todas las distribuciones instaladas:

```powershell
wsl --list --verbose
```

Establecer una distribución como predeterminada:

```powershell
wsl --set-default <Nombre_Distribución>
```

Exportar una distribución (crear respaldo):

```powershell
wsl --export <Nombre_Distribución> <Ruta_Archivo.tar>
```

Importar una distribución desde un respaldo:

```powershell
wsl --import <Nombre_Nueva_Distribución> <Ruta_Instalación> <Ruta_Archivo.tar>
```

Desinstalar una distribución:

```powershell
wsl --unregister <Nombre_Distribución>
```

## Conclusión y reflexiones finales

Windows Subsystem for Linux ha evolucionado hasta convertirse en una herramienta indispensable para desarrolladores que necesitan trabajar con entornos Linux y Windows simultáneamente. Con la llegada de WSL 2 y sus mejoras continuas hasta 2025, ya no es necesario elegir entre sistemas operativos para desarrollo.

La integración fluida con Windows, el soporte para aplicaciones GUI, y el rendimiento casi nativo hacen que WSL sea una opción mejor que las máquinas virtuales tradicionales para muchos casos de uso. Como he experimentado en mi propio flujo de trabajo, la capacidad de ejecutar comandos de Linux, servidores de desarrollo, contenedores Docker y aplicaciones gráficas sin salir de Windows es un cambio de juego.

¿Ya utilizas WSL en tu flujo de trabajo? ¿Qué configuraciones personalizadas has implementado? Comparte tu experiencia en los comentarios y hagamos de esta comunidad un recurso valioso para todos los desarrolladores que quieran aprovechar al máximo WSL.

## Recursos adicionales

- [Documentación oficial de WSL](https://learn.microsoft.com/es-es/windows/wsl/)
- [GitHub de WSL](https://github.com/microsoft/WSL)
- [WSL en Visual Studio Code](https://code.visualstudio.com/docs/remote/wsl)
- [Awesome WSL](https://github.com/sirredbeard/Awesome-WSL) - Una lista curada de recursos de WSL
- [Configurar Docker con WSL 2](/blog/instalar-configurar-docker-windows-terminal)
