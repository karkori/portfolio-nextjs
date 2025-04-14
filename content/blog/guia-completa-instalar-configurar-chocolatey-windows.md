---
title: Guía Completa para Instalar y Configurar Chocolatey en Windows en 2025
date: 2025-04-14
thumbnail: /images/blog/chocolatey-windows.png
description: Aprende a instalar, configurar y utilizar eficientemente Chocolatey, el gestor de paquetes más potente para Windows que te ahorrará horas de trabajo en la instalación y actualización de software.
category: Dev-tools
tags:
  - chocolatey
  - windows
  - gestor-paquetes
  - Dev-tools
  - terminal
---

## Introducción: ¿Qué es Chocolatey y por qué deberías utilizarlo?

Si vienes del mundo Linux, seguramente estás acostumbrado a la comodidad de instalar aplicaciones con un simple comando. En Windows, tradicionalmente hemos tenido que navegar por páginas web, descargar instaladores, hacer clic en "Siguiente, siguiente, siguiente..." y repetir este proceso para cada programa. ¡Qué pérdida de tiempo!

Aquí es donde entra **Chocolatey**: un gestor de paquetes para Windows que revoluciona la forma en que instalamos y mantenemos software. Con un simple comando en la terminal, puedes instalar casi cualquier aplicación popular. Además, mantener todo actualizado es tan sencillo como ejecutar `choco upgrade all`.

Llevo usando Chocolatey desde hace años, y puedo decirte que ha sido un cambio radical en mi flujo de trabajo. Recuerdo cuando formateé mi PC por última vez - en lugar de pasar horas reinstalando programas uno por uno, ejecuté un script con todos mis programas favoritos y me fui a tomar un café. Al volver, ¡todo estaba listo!

En este artículo te mostraré paso a paso cómo instalar Chocolatey, configurarlo correctamente, y aprovechar todo su potencial para optimizar tu experiencia en Windows.

## Requisitos previos

Antes de comenzar con la instalación, asegúrate de cumplir con estos requisitos:

- Windows 7+ / Windows Server 2003+ (aunque recomiendo Windows 10 o 11 para mejor experiencia)
- PowerShell v2+ (PowerShell v5+ recomendado)
- .NET Framework 4.8+ (para Chocolatey 2.0+)
- Acceso de administrador

## Instalación de Chocolatey

La instalación de Chocolatey es sorprendentemente sencilla. Sigue estos pasos:

### Método 1: Instalación mediante PowerShell (recomendado)

1. Abre PowerShell como administrador:
   - Presiona `Win + X` y selecciona "Windows PowerShell (Administrador)" o "Terminal (Administrador)" en Windows 11.
   - Alternativamente, busca "PowerShell" en el menú de inicio, haz clic derecho y selecciona "Ejecutar como administrador".

2. Primero, verifica la política de ejecución con el siguiente comando:

```powershell
Get-ExecutionPolicy
```

3. Si el resultado es "Restricted", necesitarás cambiar la política de ejecución temporalmente. Ejecuta:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
```

4. Ahora, ejecuta el siguiente comando para instalar Chocolatey:

```powershell
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

5. Espera a que la instalación termine. Verás un mensaje indicando que Chocolatey ha sido instalado exitosamente.

### Método 2: Instalación mediante CMD

Si prefieres usar el Símbolo del sistema (CMD):

1. Abre CMD como administrador.

2. Ejecuta este comando:

```cmd
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "[System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
```

## Verificando la instalación

Para asegurarte de que Chocolatey se ha instalado correctamente, puedes realizar una simple comprobación:

1. Cierra y vuelve a abrir tu terminal con permisos de administrador.
2. Ejecuta el comando `choco` o `choco -?`.
3. Deberías ver la ayuda y la versión de Chocolatey.

Si ves la información sobre los comandos disponibles, ¡felicidades! Chocolatey está correctamente instalado.

## Configuración básica de Chocolatey

Ahora que tienes Chocolatey instalado, podemos realizar algunas configuraciones básicas para optimizar su funcionamiento.

### Cambiar la ubicación de la caché

Por defecto, Chocolatey utiliza la carpeta TEMP para almacenar las descargas. Esto puede ser problemático por varias razones:

- El directorio TEMP se limpia periódicamente
- Puede estar bloqueado por políticas de grupo en entornos empresariales
- Normalmente está en la unidad C:, que puede tener espacio limitado

Te recomiendo cambiar la ubicación de la caché a una carpeta permanente. Yo creé una carpeta dedicada en mi segunda unidad (D:) para esto:

```powershell
choco config set cacheLocation "D:\ChocolateyCache"
```

### Configurar timeouts de comandos

Si tienes una conexión a internet lenta o instalas paquetes grandes, es buena idea aumentar el tiempo de espera para los comandos:

```powershell
choco config set commandExecutionTimeoutSeconds 14400
```

Esto establece el timeout a 4 horas (14400 segundos) en lugar del valor predeterminado de 45 minutos (2700 segundos).

### Configurar un proxy (si es necesario)

Si estás detrás de un proxy, necesitarás configurarlo:

```powershell
choco config set proxy "http://tu-servidor-proxy:puerto"
choco config set proxyUser "usuario"
choco config set proxyPassword "contraseña"
```

Para desactivar el proxy más tarde:

```powershell
choco config unset proxy
```

## Comandos básicos de Chocolatey

Ahora que tienes Chocolatey instalado y configurado, es hora de aprender los comandos más útiles para el día a día:

### Buscar paquetes

Para buscar un paquete:

```powershell
choco search nombre-del-paquete
```

Por ejemplo:

```powershell
choco search firefox
```

### Instalar paquetes

Para instalar un paquete:

```powershell
choco install nombre-del-paquete -y
```

El parámetro `-y` confirma automáticamente cualquier pregunta durante la instalación.

Por ejemplo, para instalar Google Chrome:

```powershell
choco install googlechrome -y
```

También puedes instalar varios paquetes a la vez:

```powershell
choco install firefox vscode 7zip git -y
```

### Actualizar paquetes

Para actualizar un paquete específico:

```powershell
choco upgrade nombre-del-paquete -y
```

Para actualizar todos los paquetes instalados:

```powershell
choco upgrade all -y
```

### Listar paquetes instalados

Para ver qué paquetes tienes instalados mediante Chocolatey:

```powershell
choco list --local-only
# o la versión corta
choco list -lo
```

### Desinstalar paquetes

Para desinstalar un paquete:

```powershell
choco uninstall nombre-del-paquete -y
```

## Configuraciones avanzadas

### Cambiar la configuración de Chocolatey

El archivo de configuración de Chocolatey se encuentra en `C:\ProgramData\chocolatey\config\chocolatey.config`. Sin embargo, no es recomendable editar este archivo directamente. En su lugar, utiliza el comando `choco config` como hemos visto anteriormente.

Para ver todas las configuraciones actuales:

```powershell
choco config list
```

### Crear script de instalación automatizada

Una de las cosas más útiles que puedes hacer con Chocolatey es crear un script para automatizar la instalación de todas tus aplicaciones favoritas. Esto es extremadamente útil cuando configuras un nuevo equipo:

Crea un archivo `instalar-apps.ps1` con el siguiente contenido:

```powershell
# Primero, asegúrate de que Chocolatey está instalado
if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
}

# Lista de aplicaciones a instalar
$apps = @(
    # Navegadores
    "googlechrome",
    "firefox",
    
    # Desarrollo
    "vscode",
    "git",
    "nodejs-lts",
    
    # Utilidades
    "7zip",
    "vlc",
    "notepadplusplus",
    
    # Tus aplicaciones favoritas aquí...
)

# Instalar todas las aplicaciones
foreach ($app in $apps) {
    choco install $app -y
}

Write-Host "¡Todas las aplicaciones se han instalado correctamente!" -ForegroundColor Green
```

Simplemente guarda este archivo y ejecútalo como administrador cuando necesites configurar un nuevo equipo.

## Solución de problemas comunes

### "The request was aborted: Could not create SSL/TLS secure channel."

Este error ocurre porque la Community Repository de Chocolatey requiere TLS 1.2 como mínimo. Si ves este error, seguramente estás usando un sistema operativo más antiguo.

**Solución**: Actualiza .NET Framework a la versión 4.8 o superior, o actualiza tu sistema operativo.

### "The underlying connection was closed"

Similar al problema anterior, este error está relacionado con TLS. Asegúrate de que tu sistema soporte TLS 1.2.

### Error 403 Forbidden

Si obtienes un error 403 al intentar instalar Chocolatey, puede ser debido a restricciones de seguridad en tu red.

**Solución**: Verifica si estás detrás de un proxy o firewall que bloquee el acceso. Configura el proxy como se mostró anteriormente.

### Los paquetes no se actualizan automáticamente

Chocolatey no actualiza los paquetes automáticamente por defecto.

**Solución**: Puedes programar una tarea en el Programador de tareas de Windows para ejecutar `choco upgrade all -y` diariamente o semanalmente.

## Comparativa: Chocolatey vs. Winget vs. Scoop

En 2025, Windows cuenta con varios gestores de paquetes. Veamos cómo se compara Chocolatey con las alternativas más populares:

### Chocolatey

**Pros**:
- Mayor catálogo de paquetes
- Mejor integración con sistemas de automatización (Puppet, Chef, etc.)
- Más maduro y estable
- Versión comercial disponible con características avanzadas

**Contras**:
- Algunas funcionalidades avanzadas requieren la versión de pago
- Requiere permisos de administrador por defecto

### Winget (Gestor de paquetes oficial de Microsoft)

**Pros**:
- Integrado en Windows 11
- Interfaz más sencilla
- No requiere instalación adicional en sistemas modernos
- Puede instalar aplicaciones de Microsoft Store

**Contras**:
- Catálogo más limitado (aunque creciendo rápidamente)
- Menos opciones de configuración
- Relativamente nuevo, por lo que puede tener menos estabilidad

### Scoop

**Pros**:
- No requiere permisos de administrador
- Instala aplicaciones en el directorio del usuario
- Enfocado en herramientas para desarrolladores

**Contras**:
- Catálogo más pequeño
- Menos adecuado para aplicaciones comerciales grandes
- Menos opciones para automatización

En mi experiencia, **Chocolatey sigue siendo la mejor opción para la mayoría de los usuarios**, especialmente si quieres automatizar la instalación de software en múltiples máquinas o necesitas un catálogo amplio. Sin embargo, Winget está evolucionando rápidamente y vale la pena seguir su desarrollo.

## Conclusión: Chocolatey como parte esencial de tu flujo de trabajo

Después de años utilizando Chocolatey, puedo decir que ha cambiado completamente mi forma de trabajar en Windows. Lo que antes tomaba horas ahora se resuelve en minutos, y mantener mis aplicaciones actualizadas ya no es una tarea tediosa.

Lo más valioso para mí sigue siendo la posibilidad de restaurar rápidamente mi entorno de trabajo después de formatear o cuando configuro un nuevo equipo. Con un simple script, tengo todas mis herramientas de desarrollo listas en tiempo récord.

Si todavía no usas un gestor de paquetes en Windows, te animo a que pruebes Chocolatey. La curva de aprendizaje es mínima, y los beneficios son enormes, especialmente para desarrolladores y profesionales de TI.

¿Ya utilizas Chocolatey? ¿Qué paquetes consideras imprescindibles en tu flujo de trabajo? ¿O prefieres otras alternativas como Winget o Scoop? ¡Comparte tu experiencia en los comentarios!

En futuros artículos, referenciaré esta guía al usar Chocolatey para instalar herramientas específicas de desarrollo, así que asegúrate de guardarla como referencia.

## Recursos adicionales

- [Documentación oficial de Chocolatey](https://docs.chocolatey.org/)
- [Repositorio de paquetes de Chocolatey](https://community.chocolatey.org/packages)
- [Comparación detallada entre gestores de paquetes para Windows](https://www.xda-developers.com/chocolatey-vs-winget-vs-scoop/)
