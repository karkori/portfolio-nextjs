---
title: Cómo Instalar y Gestionar Múltiples Versiones de Java en Windows
date: 2025-04-14T18:45:00.000Z
thumbnail: /images/blog/java-windows-versiones.png
description: Aprende a instalar, configurar y gestionar varias versiones de Java en Windows con herramientas modernas y un enfoque práctico para desarrolladores.
category: Dev-tools
tags:
  - java
  - windows
  - dev-tools
  - configuration
  - jdk
---

## Introducción: El desafío de las múltiples versiones de Java

Como desarrolladores, frecuentemente nos encontramos en situaciones donde necesitamos trabajar con diferentes versiones de Java. Tal vez estamos manteniendo un proyecto antiguo que requiere Java 8, mientras desarrollamos uno nuevo con Java 21, o necesitamos probar compatibilidad entre versiones.

Hace años, cambiar entre versiones de Java en Windows era un proceso tedioso que implicaba modificar manualmente variables de entorno y rutas del sistema. Por fortuna, en 2025 contamos con herramientas que hacen este proceso mucho más sencillo.

En este artículo, te mostraré cómo instalar y configurar múltiples versiones de Java en Windows, y cómo cambiar entre ellas fácilmente según tus necesidades.

## Métodos para gestionar múltiples versiones de Java

Existen varios enfoques para manejar múltiples versiones de Java en Windows:

1. **Gestores de paquetes**: Utilizando herramientas como Chocolatey, Scoop o WinGet
2. **Gestores específicos de versiones de Java**: Como SDKMAN! o Jabba
3. **Configuración manual**: Modificando las variables de entorno del sistema

En este artículo nos centraremos en los dos primeros métodos, que son los más eficientes y menos propensos a errores.

## Opción 1: Usando gestores de paquetes de Windows

Los gestores de paquetes modernos para Windows ofrecen una forma sencilla de instalar y gestionar software, incluyendo diferentes versiones de Java.

### Instalación con Chocolatey

[Chocolatey](/blog/guia-completa-instalar-configurar-chocolatey-windows) es uno de los gestores de paquetes más populares para Windows.

1. **Instalar Chocolatey** (si aún no lo tienes):

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

2. **Instalar diferentes versiones de Java**:

```powershell
# Instalar Java 11 (LTS)
choco install openjdk11 -y

# Instalar Java 17 (LTS)
choco install openjdk17 -y

# Instalar Java 21 (LTS)
choco install openjdk21 -y
```

Chocolatey instala cada versión en una ubicación diferente y configura los scripts necesarios para cambiar entre ellas.

3. **Cambiar entre versiones**:

```powershell
# Ver las versiones instaladas
choco list --local-only | findstr "jdk|openjdk"

# Configurar Java 11 como predeterminado
refreshenv
$env:JAVA_HOME = "C:\Program Files\OpenJDK\openjdk-11.0.19_7"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
```

### Instalación con Scoop

Scoop es otra excelente alternativa, más liviana y enfocada en instalaciones para el usuario actual en lugar de para todo el sistema.

1. **Instalar Scoop** (si aún no lo tienes):

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

2. **Instalar versiones de Java**:

```powershell
# Agregar el bucket java
scoop bucket add java

# Instalar diferentes versiones
scoop install openjdk11
scoop install openjdk17
scoop install openjdk21
```

3. **Cambiar entre versiones**:

```powershell
# Ver versiones instaladas
scoop list

# Cambiar la versión activa
scoop reset openjdk17
```

El comando `scoop reset` actualiza las variables de entorno necesarias para usar la versión especificada.

### Instalación con WinGet

WinGet es el gestor de paquetes oficial de Microsoft, disponible en Windows 10 y 11.

1. **Verificar que WinGet está instalado**:

```powershell
winget --version
```

Si no está instalado, puedes obtenerlo desde la Microsoft Store buscando "App Installer".

2. **Instalar versiones de Java**:

```powershell
# Buscar paquetes disponibles
winget search "OpenJDK"

# Instalar Java 11
winget install EclipseAdoptium.Temurin.11.JDK

# Instalar Java 17
winget install EclipseAdoptium.Temurin.17.JDK

# Instalar Java 21
winget install EclipseAdoptium.Temurin.21.JDK
```

3. **Para cambiar entre versiones** necesitarás ajustar manualmente las variables de entorno:

```powershell
# Configurar Java 17 como predeterminado
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.8.101-hotspot"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
```

## Opción 2: Herramientas específicas para gestionar versiones de Java

Existen herramientas diseñadas específicamente para gestionar múltiples versiones de Java. Aunque inicialmente se crearon para entornos Unix/Linux, muchas funcionan bien en Windows.

### Jabba

Jabba es una herramienta multiplataforma para gestionar versiones de Java que funciona especialmente bien en Windows.

1. **Instalar Jabba**:

```powershell
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-Expression (
  Invoke-WebRequest https://github.com/shyiko/jabba/raw/master/install.ps1 -UseBasicParsing
).Content
```

2. **Instalar versiones de Java**:

```powershell
# Listar versiones disponibles
jabba ls-remote

# Instalar versiones específicas
jabba install openjdk@1.11.0
jabba install openjdk@17.0.8
jabba install openjdk@21.0.1
```

3. **Cambiar entre versiones**:

```powershell
# Listar versiones instaladas
jabba ls

# Usar una versión específica
jabba use openjdk@17.0.8

# Establecer una versión por defecto
jabba alias default openjdk@17.0.8
```

El comando `jabba use` configura temporalmente la versión para la sesión actual, mientras que `jabba alias default` la establece como predeterminada para nuevas sesiones.

### SDKMAN! con Git Bash

SDKMAN! es una herramienta popular para gestionar SDKs, incluyendo Java. Aunque está diseñada para sistemas Unix, puedes usarla en Windows a través de Git Bash.

1. **Requisitos previos**:
   - Instalar [Git for Windows](https://gitforwindows.org/)
   - Instalar [7-Zip](https://www.7-zip.org/)

2. **Instalar SDKMAN! en Git Bash**:

```bash
# Abre Git Bash y ejecuta
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
```

3. **Instalar versiones de Java**:

```bash
# Listar versiones disponibles
sdk list java

# Instalar versiones específicas
sdk install java 11.0.20-tem
sdk install java 17.0.8-tem
sdk install java 21.0.1-tem
```

4. **Cambiar entre versiones**:

```bash
# Usar una versión específica en la sesión actual
sdk use java 17.0.8-tem

# Establecer una versión por defecto
sdk default java 17.0.8-tem
```

SDKMAN! en Git Bash es una excelente opción si ya estás familiarizado con entornos Unix o prefieres trabajar con la terminal Git Bash.

## Configuración manual: Solución tradicional

Aunque no es la opción más cómoda, conocer cómo configurar Java manualmente es útil para entender cómo funcionan las herramientas automatizadas.

1. **Descargar e instalar** las versiones de Java que necesites desde sitios oficiales como [Eclipse Adoptium](https://adoptium.net/).

2. **Configurar JAVA_HOME y PATH**:
   - Crea un script PowerShell para cada versión:

```powershell
# Guardar como set-java11.ps1
$env:JAVA_HOME = "C:\Program Files\Java\jdk-11.0.20"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
Write-Host "Java 11 está activo" -ForegroundColor Green
java -version
```

3. **Crear funciones en tu perfil de PowerShell**:

```powershell
# Editar tu perfil de PowerShell
if (!(Test-Path $PROFILE)) { New-Item -Type File -Path $PROFILE -Force }
notepad $PROFILE

# Añadir estas funciones
function Set-Java11 {
    $env:JAVA_HOME = "C:\Program Files\Java\jdk-11.0.20"
    $env:Path = "$env:JAVA_HOME\bin;$($env:Path -replace 'C:\\Program Files\\Java\\jdk-[^;]+\\bin;', '')"
    Write-Host "Java 11 está activo" -ForegroundColor Green
    java -version
}

function Set-Java17 {
    $env:JAVA_HOME = "C:\Program Files\Java\jdk-17.0.8"
    $env:Path = "$env:JAVA_HOME\bin;$($env:Path -replace 'C:\\Program Files\\Java\\jdk-[^;]+\\bin;', '')"
    Write-Host "Java 17 está activo" -ForegroundColor Green
    java -version
}

function Set-Java21 {
    $env:JAVA_HOME = "C:\Program Files\Java\jdk-21.0.1"
    $env:Path = "$env:JAVA_HOME\bin;$($env:Path -replace 'C:\\Program Files\\Java\\jdk-[^;]+\\bin;', '')"
    Write-Host "Java 21 está activo" -ForegroundColor Green
    java -version
}
```

Con este enfoque, podrás cambiar entre versiones simplemente escribiendo `Set-Java17` o la función correspondiente a la versión que necesites.

## Uso práctico: Gestión de versiones por proyecto

Para proyectos específicos, puede ser útil configurar automáticamente la versión de Java al entrar al directorio del proyecto. Aquí tienes algunas opciones:

### Usando Direnv (con Git Bash)

[Direnv](https://direnv.net/) es una herramienta que carga variables de entorno según el directorio. Puedes usarla con Git Bash:

1. **Instalar Direnv en Git Bash**:

```bash
curl -sfL https://direnv.net/install.sh | bash
```

2. **Configurar tu .bashrc**:

```bash
echo 'eval "$(direnv hook bash)"' >> ~/.bashrc
```

3. **Crear un archivo .envrc en tu proyecto**:

```bash
# Para un proyecto con Java 17
echo 'export JAVA_HOME="/c/Program Files/Java/jdk-17.0.8"' > .envrc
echo 'export PATH="$JAVA_HOME/bin:$PATH"' >> .envrc
direnv allow
```

### Scripts de PowerShell por proyecto

Otra opción es crear scripts específicos para cada proyecto:

1. **Crear un script `set-java.ps1` en la raíz del proyecto**:

```powershell
# set-java.ps1
$javaVersion = "17" # Cambiar según el proyecto

switch ($javaVersion) {
    "11" { 
        $env:JAVA_HOME = "C:\Program Files\Java\jdk-11.0.20"
    }
    "17" { 
        $env:JAVA_HOME = "C:\Program Files\Java\jdk-17.0.8"
    }
    "21" { 
        $env:JAVA_HOME = "C:\Program Files\Java\jdk-21.0.1"
    }
    default { 
        Write-Error "Versión de Java no configurada"
        exit 1
    }
}

$env:Path = "$env:JAVA_HOME\bin;$($env:Path -replace 'C:\\Program Files\\Java\\jdk-[^;]+\\bin;', '')"
Write-Host "Java $javaVersion está activo para este proyecto" -ForegroundColor Green
java -version
```

2. **Ejecutar el script al entrar al proyecto**:

```powershell
cd C:\Projects\MiProyecto
.\set-java.ps1
```

## Integración con IDEs

La mayoría de los IDEs modernos permiten configurar la versión de Java por proyecto, independientemente de la configuración del sistema.

### IntelliJ IDEA

1. Ve a `File > Project Structure > Project`
2. Configura el SDK de proyecto seleccionando la versión de Java adecuada
3. Si la versión no aparece, haz clic en `Add SDK > JDK` y navega al directorio de instalación

### Eclipse

1. Ve a `Window > Preferences > Java > Installed JREs`
2. Añade las diferentes versiones de JDK
3. En cada proyecto, haz clic derecho en el proyecto > `Properties > Java Build Path > Libraries` y ajusta la biblioteca JRE del sistema

### VS Code

1. Instala la extensión "Extension Pack for Java"
2. En la configuración (`settings.json`), configura la ruta a tus JDKs:

```json
"java.configuration.runtimes": [
  {
    "name": "JavaSE-11",
    "path": "C:\\Program Files\\Java\\jdk-11.0.20",
  },
  {
    "name": "JavaSE-17",
    "path": "C:\\Program Files\\Java\\jdk-17.0.8",
    "default": true
  },
  {
    "name": "JavaSE-21",
    "path": "C:\\Program Files\\Java\\jdk-21.0.1"
  }
]
```

## Solución de problemas comunes

### "java" no es reconocido como un comando interno o externo

**Solución**: Verifica que la ruta al directorio `bin` de tu JDK esté correctamente añadida a la variable PATH:

```powershell
# Verificar el PATH
$env:Path

# Verificar JAVA_HOME
$env:JAVA_HOME

# Verificar si se puede acceder al ejecutable
Test-Path "$env:JAVA_HOME\bin\java.exe"
```

### Versión incorrecta de Java en uso

**Solución**: Comprueba el orden de las entradas en el PATH. La primera ubicación de Java encontrada en el PATH es la que se utilizará:

```powershell
# Verificar dónde está ejecutándose Java desde
Get-Command java

# Forzar el uso de una versión específica modificando el PATH
$env:Path = "$env:JAVA_HOME\bin;$($env:Path -replace 'C:\\Program Files\\Java\\jdk-[^;]+\\bin;', '')"
```

### Herramientas Maven/Gradle usando la versión incorrecta

**Solución**: Configura JAVA_HOME específicamente para tus herramientas de compilación:

```powershell
# Para Maven
$env:MAVEN_OPTS = "-Djava.home=$env:JAVA_HOME"

# Para Gradle (en gradle.properties o en la línea de comandos)
# org.gradle.java.home=C:\\Program Files\\Java\\jdk-17.0.8
```

## Consejos para un flujo de trabajo eficiente

1. **Automatiza el cambio de versión**: Crea aliases o funciones para cambiar rápidamente entre versiones.

2. **Configura por proyecto**: Utiliza configuraciones por proyecto en lugar de cambiar la configuración global cuando sea posible.

3. **Documenta los requisitos**: Incluye en el README de tus proyectos la versión de Java necesaria.

4. **Usa contenedores para casos complejos**: Para proyectos con requisitos muy específicos, considera usar [Docker](/blog/instalar-configurar-docker-windows-terminal) para aislar completamente el entorno.

5. **Actualiza regularmente**: Mantén tus JDKs actualizados, especialmente para obtener parches de seguridad:

```powershell
# Con Chocolatey
choco upgrade openjdk11 -y

# Con Scoop
scoop update openjdk17

# Con WinGet
winget upgrade EclipseAdoptium.Temurin.17.JDK
```

## Conclusión

La gestión de múltiples versiones de Java en Windows ha mejorado significativamente con las herramientas modernas. Ya sea que prefieras usar gestores de paquetes como Chocolatey o Scoop, herramientas específicas como Jabba, o la configuración manual con scripts, tienes varias opciones para trabajar eficientemente con diferentes versiones de Java.

Mi recomendación personal es usar Scoop o Jabba para desarrollo personal, ya que ofrecen la mejor combinación de simplicidad y potencia. Para entornos empresariales, Chocolatey ofrece opciones más robustas de gestión y automatización.

¿Qué método prefieres para gestionar tus versiones de Java? ¿Tienes algún truco adicional que no haya mencionado? ¡Comparte tus experiencias en los comentarios!

## Recursos adicionales

- [Documentación oficial de Java](https://docs.oracle.com/en/java/)
- [Eclipse Adoptium](https://adoptium.net/) - Distribuciones de OpenJDK
- [Configuración de Chocolatey](/blog/guia-completa-instalar-configurar-chocolatey-windows)
- [Documentación de SDKMAN!](https://sdkman.io/usage)
- [Repositorio de Jabba en GitHub](https://github.com/shyiko/jabba)
