---
title: CI/CD para aplicaciones Java/Spring Boot - Guía completa desde cero hasta producción
date: 2025-04-09T09:30:00.000Z
thumbnail: /images/blog/ci-cd-spring-boot.png
description: Implementa un pipeline de integración y despliegue continuo completo para aplicaciones Spring Boot, desde el desarrollo hasta producción.
category: DevOps
tags:
  - devops
  - java
  - spring
  - github
  - docker
  - kubernetes
---
## Automatización que cambió mi forma de trabajar

Cuando empecé a desarrollar aplicaciones con Spring Boot hace unos años, mi proceso era manual y tedioso: compilaba en local, ejecutaba tests manualmente, construía el JAR, me conectaba al servidor por SSH y desplegaba el archivo copiándolo al directorio correspondiente. Cualquier cambio pequeño significaba repetir todo el proceso.

El día que implementé mi primer pipeline de CI/CD completo, mi productividad se multiplicó. Y no solo eso: la calidad de mis entregas mejoró drásticamente.

En este artículo os voy a mostrar cómo monté mi pipeline de CI/CD para aplicaciones Spring Boot, desde el primer commit hasta el despliegue en producción, incluyendo todos los pasos intermedios. No es teoría abstracta ni conceptos vagos; es exactamente lo que uso en mis proyectos reales.

## ¿Qué vamos a construir?

Un pipeline de CI/CD completo que:
1. Se dispara automáticamente con cada push o pull request
2. Construye la aplicación Spring Boot
3. Ejecuta tests unitarios y de integración
4. Analiza la calidad del código
5. Escanea dependencias en busca de vulnerabilidades
6. Construye y publica una imagen Docker
7. Despliega en diferentes entornos (desarrollo, testing, producción)

Usaremos GitHub Actions como plataforma de CI/CD porque es lo que uso actualmente en mis proyectos, aunque los conceptos son aplicables a Jenkins, GitLab CI o cualquier otra herramienta.

## Prerrequisitos

Para seguir este tutorial necesitarás:
- Una aplicación Spring Boot (usaré una sencilla como ejemplo)
- Una cuenta en GitHub
- Conocimientos básicos de Git
- Docker instalado en tu máquina para pruebas locales
- Un lugar donde desplegar (usaré AWS como ejemplo, pero los conceptos son aplicables a cualquier plataforma)

## Paso 1: Preparando tu aplicación Spring Boot

Antes de configurar el pipeline, debemos asegurarnos de que nuestra aplicación está lista para CI/CD. Esto implica tener:

1. **Tests automatizados**: Sin tests, el CI/CD pierde gran parte de su valor
2. **Configuración externalizada**: Para manejar diferentes entornos
3. **Build reproducible**: Cualquiera debería poder construir el proyecto con los mismos resultados

### 1.1 Estructura de proyecto recomendada

En mis proyectos Spring Boot suelo usar esta estructura:

```
mi-aplicacion/
├── src/
│   ├── main/
│   │   ├── java/
│   │   ├── resources/
│   │   │   ├── application.yml
│   │   │   ├── application-dev.yml
│   │   │   ├── application-test.yml
│   │   │   └── application-prod.yml
│   ├── test/
│       ├── java/  
│       └── resources/
├── Dockerfile
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── pom.xml (o build.gradle)
└── README.md
```

### 1.2 Configuración de Maven/Gradle

Para que tu build sea consistente, necesitas especificar correctamente las versiones de tus dependencias. En Maven, uso el `maven-enforcer-plugin` para asegurarme de que todo el equipo usa la misma versión de Java y Maven:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-enforcer-plugin</artifactId>
    <version>3.3.0</version>
    <executions>
        <execution>
            <id>enforce-maven</id>
            <goals>
                <goal>enforce</goal>
            </goals>
            <configuration>
                <rules>
                    <requireMavenVersion>
                        <version>3.8.6</version>
                    </requireMavenVersion>
                    <requireJavaVersion>
                        <version>17</version>
                    </requireJavaVersion>
                </rules>
            </configuration>
        </execution>
    </executions>
</plugin>
```

### 1.3 Tests automatizados

No puedo enfatizar lo suficiente la importancia de tener buenos tests. En mis proyectos suelo tener:

- **Tests unitarios**: Prueban componentes aislados
- **Tests de integración**: Prueban la interacción entre componentes
- **Tests de API**: Prueban la API REST usando MockMvc o TestRestTemplate

Este es un ejemplo de test unitario para un servicio:

```java
@SpringBootTest
class UsuarioServiceTest {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @MockBean
    private UsuarioRepository usuarioRepository;
    
    @Test
    void dadoUsuarioValido_cuandoCrear_entoncesRetornaUsuarioCreado() {
        // Dado
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombre("Juan");
        nuevoUsuario.setEmail("juan@ejemplo.com");
        
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(nuevoUsuario);
        
        // Cuando
        Usuario resultado = usuarioService.crearUsuario(nuevoUsuario);
        
        // Entonces
        assertNotNull(resultado);
        assertEquals("Juan", resultado.getNombre());
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }
}
```

Y un ejemplo de test de API:

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UsuarioControllerTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void testCrearUsuario() {
        // Dado
        UsuarioDTO nuevoUsuario = new UsuarioDTO();
        nuevoUsuario.setNombre("Ana");
        nuevoUsuario.setEmail("ana@ejemplo.com");
        
        // Cuando
        ResponseEntity<UsuarioDTO> respuesta = restTemplate.postForEntity(
            "/api/usuarios", nuevoUsuario, UsuarioDTO.class);
        
        // Entonces
        assertEquals(HttpStatus.CREATED, respuesta.getStatusCode());
        assertNotNull(respuesta.getBody());
        assertEquals("Ana", respuesta.getBody().getNombre());
    }
}
```

### 1.4 Dockerfile optimizado

Para desplegar nuestra aplicación, usaremos Docker. Este es el Dockerfile que uso en mis proyectos (optimizado para Spring Boot):

```dockerfile
# Etapa de build
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /workspace/app

# Copiar archivos de dependencias y caché de Maven
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

# Construir la aplicación sin tests (los tests se ejecutan en el pipeline)
RUN ./mvnw package -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

# Etapa de ejecución
FROM eclipse-temurin:17-jre-alpine
VOLUME /tmp
ARG DEPENDENCY=/workspace/app/target/dependency

# Copiar las capas desempaquetadas desde la etapa de build
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

# Ejecutar la aplicación
ENTRYPOINT ["java","-cp","app:app/lib/*","com.miempresa.aplicacion.MiAplicacionApplication"]
```

Lo importante aquí es el enfoque multi-etapa, que reduce significativamente el tamaño de la imagen final.

## Paso 2: Configurando GitHub Actions

Aquí es donde empieza la magia del CI/CD. Vamos a configurar un workflow en GitHub Actions que automatice todo nuestro proceso.

### 2.1 Estructura básica del workflow

Creamos el archivo `.github/workflows/ci-cd.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: maven
      - name: Build with Maven
        run: ./mvnw clean package
```

Este es solo el esqueleto básico. Ahora vamos a ir añadiendo cada etapa del pipeline.

### 2.2 Añadiendo tests y cobertura

Ampliamos el workflow para ejecutar tests y medir cobertura:

```yaml
- name: Run Tests
  run: ./mvnw test

- name: Generate JaCoCo Report
  run: ./mvnw jacoco:report

- name: Upload coverage to GitHub
  uses: actions/upload-artifact@v3
  with:
    name: coverage-report
    path: target/site/jacoco/
```

Para que esto funcione, necesitas configurar el plugin JaCoCo en tu `pom.xml`:

```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.10</version>
    <executions>
        <execution>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
        <execution>
            <id>report</id>
            <phase>test</phase>
            <goals>
                <goal>report</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

### 2.3 Análisis estático con SonarQube

Uno de los componentes más valiosos de mi pipeline es el análisis de código. Uso SonarQube (o SonarCloud, su versión en la nube):

```yaml
- name: SonarQube Analysis
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
  run: ./mvnw sonar:sonar -Dsonar.projectKey=mi-aplicacion -Dsonar.host.url=https://sonarcloud.io -Dsonar.organization=mi-organizacion
```

En mi experiencia, SonarQube ha detectado muchos problemas potenciales antes de que llegaran a producción, desde code smells hasta vulnerabilidades de seguridad.

### 2.4 Escaneo de dependencias con OWASP

No escatiméis en seguridad. El plugin OWASP Dependency Check es imprescindible para detectar vulnerabilidades en dependencias:

```yaml
- name: OWASP Dependency Check
  run: ./mvnw org.owasp:dependency-check-maven:check

- name: Upload OWASP Report
  uses: actions/upload-artifact@v3
  with:
    name: dependency-check-report
    path: target/dependency-check-report.html
```

Añade el plugin a tu `pom.xml`:

```xml
<plugin>
    <groupId>org.owasp</groupId>
    <artifactId>dependency-check-maven</artifactId>
    <version>8.2.1</version>
    <configuration>
        <formats>
            <format>HTML</format>
            <format>JSON</format>
        </formats>
    </configuration>
</plugin>
```

### 2.5 Construcción y publicación de imagen Docker

Ahora vamos a construir y publicar la imagen Docker:

```yaml
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v2

- name: Login to DockerHub
  uses: docker/login-action@v2
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_TOKEN }}

- name: Build and push Docker image
  uses: docker/build-push-action@v3
  with:
    context: .
    push: true
    tags: usuario/mi-aplicacion:latest,usuario/mi-aplicacion:${{ github.sha }}
    cache-from: type=registry,ref=usuario/mi-aplicacion:buildcache
    cache-to: type=registry,ref=usuario/mi-aplicacion:buildcache,mode=max
```

El uso de caché es crucial para reducir el tiempo de construcción. En mis pipelines, he conseguido reducir el tiempo de build de 5-6 minutos a 1-2 minutos usando correctamente la caché.

## Paso 3: Estrategia de despliegue multi-entorno

Una vez que tenemos nuestra imagen Docker, necesitamos desplegarla. En mi caso, uso un enfoque de despliegue progresivo:

1. Primero, despliegue automático en desarrollo
2. Luego, despliegue en entorno de pruebas tras aprobación manual
3. Finalmente, despliegue en producción tras otra aprobación

### 3.1 Despliegue en desarrollo

```yaml
deploy-dev:
  needs: build
  runs-on: ubuntu-latest
  steps:
    - name: Deploy to Development
      uses: aws-actions/amazon-ecs-deploy-task-definition@v1
      with:
        task-definition: .aws/task-definition-dev.json
        service: mi-aplicacion-dev
        cluster: dev-cluster
        wait-for-service-stability: true
```

### 3.2 Despliegue en test (con aprobación)

```yaml
deploy-test:
  needs: deploy-dev
  runs-on: ubuntu-latest
  environment:
    name: test
    url: https://test.miapp.com
  steps:
    - name: Deploy to Test
      uses: aws-actions/amazon-ecs-deploy-task-definition@v1
      with:
        task-definition: .aws/task-definition-test.json
        service: mi-aplicacion-test
        cluster: test-cluster
        wait-for-service-stability: true
```

La clave aquí es la sección `environment`, que en GitHub Actions permite configurar aprobaciones manuales.

### 3.3 Despliegue en producción

```yaml
deploy-prod:
  needs: deploy-test
  runs-on: ubuntu-latest
  environment:
    name: production
    url: https://miapp.com
  steps:
    - name: Deploy to Production
      uses: aws-actions/amazon-ecs-deploy-task-definition@v1
      with:
        task-definition: .aws/task-definition-prod.json
        service: mi-aplicacion-prod
        cluster: prod-cluster
        wait-for-service-stability: true
```

## Paso 4: Seguridad en el pipeline

La seguridad no es opcional, especialmente en el pipeline de CI/CD que maneja credenciales y tiene acceso a entornos de producción.

### 4.1 Gestión de secretos

Nunca, NUNCA almacenéis credenciales directamente en vuestro workflow. Usad los secretos de GitHub:

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v1
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: eu-west-1
```

### 4.2 Permisos mínimos

Aplicad el principio de mínimo privilegio. Para cada entorno, cread un usuario específico con sólo los permisos estrictamente necesarios.

### 4.3 Escaneo de vulnerabilidades en imágenes

Las imágenes Docker pueden contener vulnerabilidades. Yo uso Trivy para escanearlas:

```yaml
- name: Scan Docker image
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'usuario/mi-aplicacion:latest'
    format: 'table'
    exit-code: '1'
    ignore-unfixed: true
    vuln-type: 'os,library'
    severity: 'CRITICAL,HIGH'
```

## Paso 5: Optimizaciones avanzadas

Después de implementar muchos pipelines, he aprendido algunos trucos que mejoran significativamente el rendimiento.

### 5.1 Caché de dependencias

Para Maven:

```yaml
- name: Cache Maven packages
  uses: actions/cache@v3
  with:
    path: ~/.m2
    key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
    restore-keys: ${{ runner.os }}-m2
```

Para Gradle:

```yaml
- name: Cache Gradle packages
  uses: actions/cache@v3
  with:
    path: |
      ~/.gradle/caches
      ~/.gradle/wrapper
    key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
    restore-keys: ${{ runner.os }}-gradle
```

### 5.2 Construcción paralela

Si tu proyecto es modular, puedes configurar la construcción paralela:

```yaml
- name: Build with Maven (parallel)
  run: ./mvnw -T 4 clean package
```

Esto reduce sustancialmente el tiempo de build en proyectos grandes.

### 5.3 Ejecución condicional de pasos

No todos los pasos son necesarios en todas las circunstancias. Por ejemplo, podemos desplegar sólo en push a main, pero ejecutar tests en todos los pull requests:

```yaml
- name: Deploy to Development
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
  uses: ...
```

## Paso 6: Monitorización y alertas

La última pieza del puzzle es saber cuándo algo va mal.

### 6.1 Notificaciones

Configuro notificaciones para fallos en el pipeline:

```yaml
- name: Notify team on failure
  if: failure()
  uses: rtCamp/action-slack-notify@v2
  env:
    SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
    SLACK_TITLE: "🚨 Pipeline failed!"
    SLACK_MESSAGE: "Build failed in ${{ github.workflow }}"
    SLACK_COLOR: danger
```

### 6.2 Métricas del pipeline

También es útil recopilar métricas sobre el pipeline: tiempo de ejecución, tasa de éxito, etc. Yo suelo usar Prometheus para esto.

## Casos de uso reales

Para terminar, quiero compartir algunos casos reales donde este enfoque me ha ahorrado tiempo y problemas:

1. **Detección temprana de regresiones**: En un proyecto reciente, un cambio aparentemente menor rompió un caso de uso crítico. El pipeline detectó el problema antes de llegar a producción.

2. **Reducción del tiempo de integración**: En equipos grandes (8+ desarrolladores), pasamos de integraciones problemáticas que consumían días a despliegues automatizados varias veces al día.

3. **Cumplimiento normativo**: En un proyecto bancario, el pipeline generaba automáticamente informes de análisis de seguridad requeridos por los auditores.

## Conclusión

Implementar un pipeline de CI/CD completo requiere tiempo y esfuerzo inicial, pero el retorno de inversión es espectacular. En mis proyectos, he visto cómo:

- El tiempo de entrega se reduce drásticamente
- La calidad aumenta de manera consistente
- El equipo puede centrarse en desarrollar, no en tareas manuales
- Los problemas se detectan antes, cuando son más baratos de corregir

Como desarrollador Java/Spring Boot con experiencia en DevOps, puedo asegurar que un buen pipeline de CI/CD es uno de los mayores multiplicadores de productividad que podéis implementar en vuestros proyectos.

¿Tenéis alguna duda sobre algún aspecto específico? ¿Usáis alguna otra herramienta en vuestros pipelines? ¡Me encantaría leer vuestros comentarios!

## Recursos adicionales

- [Documentación oficial de GitHub Actions](https://docs.github.com/es/actions)
- [Spring Boot con Docker](https://spring.io/guides/topicals/spring-boot-docker/)
- [SonarQube para Java](https://docs.sonarqube.org/latest/analysis/languages/java/)
- [OWASP Top 10 CI/CD Security Risks](https://owasp.org/www-project-top-10-ci-cd-security-risks/)
- [AWS ECS deployment strategies](https://aws.amazon.com/blogs/containers/implementing-canary-deployments-of-amazon-ecs-services-with-aws-codedeploy/)
