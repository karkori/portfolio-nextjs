---
title: Microservicios con Spring Cloud - Arquitectura completa paso a paso
date: 2025-04-11T10:00:00.000Z
thumbnail: /images/blog/spring-cloud-microservices.png
description: Implementa una arquitectura de microservicios robusta usando Spring Cloud, desde la configuración básica hasta el despliegue en Kubernetes.
category: backend
tags:
  - java
  - spring
  - microservicios
  - spring-cloud
  - kubernetes
---
## Mi travesía desde el monolito a los microservicios

Hace unos años, cuando dirigía el desarrollo de una plataforma de comercio electrónico para un cliente importante, nos enfrentamos a un monolito de más de 200.000 líneas de código que se había vuelto completamente inmanejable. Cada despliegue era una pesadilla: una simple corrección podía llevar días de pruebas y una regresión inesperada podía tirar abajo todo el sistema.

Tras una noche particularmente desastrosa en la que tuvimos que hacer un rollback de emergencia a las 3 de la mañana, tomé la decisión de migrar a microservicios. Lo que comenzó como un experimento con un único servicio de catálogo extraído del monolito, se convirtió en una transformación completa de nuestra arquitectura utilizando Spring Cloud.

No voy a mentir, el camino estuvo lleno de obstáculos. Desde servicios demasiado granulares que generaban una sobrecarga de comunicación, hasta problemas de consistencia de datos que nos costó semanas resolver. Pero una vez que establecimos los patrones correctos, nuestra productividad se disparó y los despliegues pasaron de ser eventos traumáticos a rutinas cotidianas sin incidentes.

En este artículo os compartiré exactamente cómo construir una arquitectura de microservicios con Spring Cloud desde cero, incluyendo todos los componentes necesarios y las lecciones que he aprendido por las malas.

## Índice
- [¿Qué vamos a construir?](#qué-vamos-a-construir)
- [Prerrequisitos](#prerrequisitos)
- [Paso 1: Entendiendo los componentes clave de Spring Cloud](#paso-1-entendiendo-los-componentes-clave-de-spring-cloud)
- [Paso 2: Creando la base de nuestro proyecto](#paso-2-creando-la-base-de-nuestro-proyecto)
- [Paso 3: Construyendo los microservicios](#paso-3-construyendo-los-microservicios)
- [Paso 4: Implementando patrones avanzados](#paso-4-implementando-patrones-avanzados)
- [Paso 5: Desplegando en Kubernetes](#paso-5-desplegando-en-kubernetes)
- [Paso 6: Observabilidad y monitorización](#paso-6-observabilidad-y-monitorización)
- [Errores comunes y lecciones aprendidas](#errores-comunes-y-lecciones-aprendidas)
- [Comparativa de tecnologías](#comparativa-de-tecnologías)
- [Conclusión](#conclusión)
- [Recursos adicionales](#recursos-adicionales)

## ¿Qué vamos a construir?

Una arquitectura de microservicios completa basada en Spring Cloud que incluye:

1. Service Discovery para localizar servicios dinámicamente
2. Configuración centralizada con Config Server
3. API Gateway para enrutar y filtrar solicitudes
4. Circuit Breaker para manejar fallos graciosamente
5. Monitorización y observabilidad
6. Despliegue en Kubernetes

Usaremos Spring Cloud porque, tras haber probado diferentes frameworks, he comprobado que proporciona la integración más sencilla y completa para Java. Aunque los conceptos son aplicables a otras tecnologías, los ejemplos serán con Spring Boot y Spring Cloud.

## Prerrequisitos

Para seguir este tutorial necesitarás:
- JDK 17 o superior
- Maven o Gradle
- Docker y Docker Compose
- Conocimientos básicos de Spring Boot
- IDE de tu preferencia (yo uso IntelliJ IDEA)
- Kubernetes local (Minikube o Docker Desktop) para la parte final

## Paso 1: Entendiendo los componentes clave de Spring Cloud

Antes de sumergirnos en el código, es esencial comprender los componentes principales que forman una arquitectura de microservicios con Spring Cloud.

### 1.1 Service Discovery: El directorio de servicios

El Service Discovery es como una guía telefónica para tus microservicios. Sin él, cada servicio necesitaría conocer la ubicación exacta (host:puerto) de todos los demás servicios con los que necesita comunicarse, lo que sería imposible de mantener en un entorno dinámico.

En Spring Cloud tenemos principalmente dos opciones:

**Spring Cloud Netflix Eureka**: La opción más tradicional y ampliamente utilizada en el ecosistema Spring.
**Consul**: Una alternativa más versátil que ofrece capacidades adicionales como gestión de configuración y segmentación de red.

Tras usar ambas en producción, os recomiendo:
- **Eureka** para empezar: integración perfecta con Spring y configuración sencilla
- **Consul** para entornos multi-datacenter o si necesitáis más características avanzadas como comprobaciones de salud personalizadas

### 1.2 Config Server: Configuración centralizada

Cuando pasé de gestionar 1 aplicación a 15+ microservicios, rápidamente me di cuenta de que la gestión de configuración era un desafío enorme. Spring Cloud Config Server resolvió este problema centralizando toda la configuración en un único lugar, típicamente un repositorio Git.

Las ventajas que he experimentado:
- Propagar cambios de configuración sin necesidad de reiniciar servicios
- Mantener configuraciones específicas para diferentes entornos
- Versionar la configuración junto con el código
- Auditar quién cambió qué y cuándo

### 1.3 API Gateway: La puerta de entrada

El API Gateway actúa como punto de entrada único para todos los clientes, enrutando las solicitudes a los servicios apropiados. Spring Cloud Gateway sustituyó a Zuul (ahora en modo mantenimiento) y ofrece:

- Enrutamiento dinámico basado en diversos criterios
- Filtros pre y post para manipular solicitudes/respuestas
- Integración con Service Discovery
- Balanceo de carga

En proyectos complejos, el API Gateway me ha salvado de innumerables dolores de cabeza, especialmente al implementar funcionalidades transversales como autenticación, limitación de tasas y transformación de respuestas.

### 1.4 Circuit Breaker: Manejo de fallos

Una de las lecciones más duras que aprendí con microservicios fue que los fallos en cascada pueden derribar todo el sistema. Imaginad un servicio lento que causa tiempos de espera en sus dependientes, provocando una reacción en cadena de fallos.

Spring Cloud Circuit Breaker, utilizando Resilience4J (reemplazo de Hystrix), evita este escenario:
- Detecta servicios que están fallando
- Evita llamadas innecesarias a servicios caídos
- Proporciona respuestas fallback
- Se recupera gradualmente cuando el servicio vuelve a estar disponible

## Paso 2: Creando la base de nuestro proyecto

Vamos a crear una arquitectura con servicios de ejemplo que demuestren todos los conceptos importantes.

### 2.1 Estructura del proyecto multi-módulo

Aunque en producción cada microservicio tendría su propio repositorio, para este tutorial usaremos un proyecto multi-módulo para mayor claridad:

```
microservicios-spring-cloud/
├── discovery-server/       # Eureka Server
├── config-server/          # Config Server
├── api-gateway/            # Spring Cloud Gateway
├── servicio-productos/     # Microservicio de productos
├── servicio-pedidos/       # Microservicio de pedidos
├── servicio-usuarios/      # Microservicio de usuarios
└── servicio-notificaciones/# Microservicio de notificaciones
```

### 2.2 Configurando el Discovery Server

El Discovery Server será el primer componente que crearemos:

```java
// En discovery-server/src/main/java/com/tuempresa/discoveryserver/DiscoveryServerApplication.java
package com.tuempresa.discoveryserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class DiscoveryServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(DiscoveryServerApplication.class, args);
    }
}
```

Y su configuración:

```yaml
# En discovery-server/src/main/resources/application.yml
server:
  port: 8761

spring:
  application:
    name: discovery-server

eureka:
  client:
    registerWithEureka: false
    fetchRegistry: false
  server:
    enableSelfPreservation: false  # Desactivado para desarrollo, activar en producción
```

### 2.3 Creando el Config Server

A continuación, configuraremos el Config Server para centralizar todas las configuraciones:

```java
// En config-server/src/main/java/com/tuempresa/configserver/ConfigServerApplication.java
package com.tuempresa.configserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;

@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }
}
```

La configuración:

```yaml
# En config-server/src/main/resources/application.yml
server:
  port: 8888

spring:
  application:
    name: config-server
  cloud:
    config:
      server:
        git:
          uri: https://github.com/tuusuario/microservicios-config
          default-label: main
          search-paths: "{application}"

eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
```



### 2.4 Implementando el API Gateway

El API Gateway será nuestro punto de entrada para todas las solicitudes externas. Primero, añadimos las dependencias necesarias:

```xml
<!-- En api-gateway/pom.xml -->
<dependencies>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
</dependencies>
```

La clase principal con la anotación necesaria:

```java
// En api-gateway/src/main/java/com/tuempresa/apigateway/ApiGatewayApplication.java
package com.tuempresa.apigateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}
```

Configuración del enrutamiento:

```yaml
# En api-gateway/src/main/resources/application.yml
server:
  port: 8080

spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      discovery:
        locator:
          enabled: true
          lowerCaseServiceId: true
      routes:
        - id: servicio-productos
          uri: lb://servicio-productos
          predicates:
            - Path=/api/productos/**
        - id: servicio-pedidos
          uri: lb://servicio-pedidos
          predicates:
            - Path=/api/pedidos/**
        - id: servicio-usuarios
          uri: lb://servicio-usuarios
          predicates:
            - Path=/api/usuarios/**

eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
```

## Paso 3: Construyendo los microservicios

Ahora vamos a implementar los microservicios básicos. Os mostraré el servicio de productos como ejemplo y los demás seguirían un enfoque similar.

### 3.1 Servicio de Productos

Primero, configuramos la dependencia de Spring Cloud:

```xml
<!-- En servicio-productos/pom.xml -->
<dependencies>
    <!-- Spring Boot -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- Spring Cloud -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-config</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-circuitbreaker-resilience4j</artifactId>
    </dependency>
    
    <!-- Base de datos -->
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Utilidades -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```

La clase principal:

```java
// En servicio-productos/src/main/java/com/tuempresa/productos/ProductosApplication.java
package com.tuempresa.productos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ProductosApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProductosApplication.class, args);
    }
}
```

Entidad Producto:

```java
// En servicio-productos/src/main/java/com/tuempresa/productos/model/Producto.java
package com.tuempresa.productos.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Producto {
    @Id
    @GeneratedValue
    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Integer stock;
    private boolean activo;
}
```

Repositorio:

```java
// En servicio-productos/src/main/java/com/tuempresa/productos/repository/ProductoRepository.java
package com.tuempresa.productos.repository;

import com.tuempresa.productos.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByActivoTrue();
}
```

Servicio:

```java
// En servicio-productos/src/main/java/com/tuempresa/productos/service/ProductoService.java
package com.tuempresa.productos.service;

import com.tuempresa.productos.model.Producto;
import com.tuempresa.productos.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductoService {
    private final ProductoRepository productoRepository;
    
    public List<Producto> findAll() {
        return productoRepository.findByActivoTrue();
    }
    
    public Optional<Producto> findById(Long id) {
        return productoRepository.findById(id);
    }
    
    public Producto save(Producto producto) {
        return productoRepository.save(producto);
    }
    
    public void deleteById(Long id) {
        productoRepository.deleteById(id);
    }
    
    public boolean actualizarStock(Long id, int cantidad) {
        return productoRepository.findById(id)
            .map(p -> {
                int nuevoStock = p.getStock() - cantidad;
                if (nuevoStock < 0) return false;
                p.setStock(nuevoStock);
                productoRepository.save(p);
                return true;
            })
            .orElse(false);
    }
}
```

Controlador:

```java
// En servicio-productos/src/main/java/com/tuempresa/productos/controller/ProductoController.java
package com.tuempresa.productos.controller;

import com.tuempresa.productos.model.Producto;
import com.tuempresa.productos.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {
    private final ProductoService productoService;
    
    @GetMapping
    public List<Producto> listarProductos() {
        return productoService.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Producto> getProducto(@PathVariable Long id) {
        return productoService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Producto crearProducto(@RequestBody Producto producto) {
        return productoService.save(producto);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id, @RequestBody Producto producto) {
        return productoService.findById(id)
            .map(p -> {
                producto.setId(id);
                return ResponseEntity.ok(productoService.save(producto));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productoService.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/{id}/stock")
    public ResponseEntity<?> actualizarStock(@PathVariable Long id, @RequestParam int cantidad) {
        boolean actualizado = productoService.actualizarStock(id, cantidad);
        return actualizado
            ? ResponseEntity.ok().build()
            : ResponseEntity.badRequest().body("Stock insuficiente o producto no encontrado");
    }
}
```

Configuración bootstrap:

```yaml
# En servicio-productos/src/main/resources/bootstrap.yml
spring:
  application:
    name: servicio-productos
  cloud:
    config:
      discovery:
        enabled: true
        service-id: config-server
      fail-fast: true
      retry:
        max-attempts: 20
        initial-interval: 1500

eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
```

### 3.2 Implementando comunicación entre servicios

Uno de los desafíos más complejos en microservicios es la comunicación entre ellos. Aquí os muestro cómo implementarla en el servicio de pedidos, que necesita consultar productos.

Primero, configuramos un cliente con Feign:

```java
// En servicio-pedidos/src/main/java/com/tuempresa/pedidos/client/ProductoClient.java
package com.tuempresa.pedidos.client;

import com.tuempresa.pedidos.model.Producto;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "servicio-productos")
public interface ProductoClient {
    
    @GetMapping("/api/productos/{id}")
    @CircuitBreaker(name = "productoService", fallbackMethod = "getProductoFallback")
    Producto getProducto(@PathVariable Long id);
    
    @PutMapping("/api/productos/{id}/stock")
    @CircuitBreaker(name = "productoService", fallbackMethod = "actualizarStockFallback")
    boolean actualizarStock(@PathVariable Long id, @RequestParam int cantidad);
    
    default Producto getProductoFallback(Long id, Exception e) {
        // Producto por defecto o caché
        return new Producto(id, "Producto temporal", "Información no disponible temporalmente", 
                            new BigDecimal("0.0"), 0, true);
    }
    
    default boolean actualizarStockFallback(Long id, int cantidad, Exception e) {
        // Podríamos registrar la operación para procesarla más tarde
        return false;
    }
}
```

Y lo utilizamos en el servicio de pedidos:

```java
// En servicio-pedidos/src/main/java/com/tuempresa/pedidos/service/PedidoService.java
package com.tuempresa.pedidos.service;

import com.tuempresa.pedidos.client.ProductoClient;
import com.tuempresa.pedidos.model.Pedido;
import com.tuempresa.pedidos.model.Producto;
import com.tuempresa.pedidos.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PedidoService {
    private final PedidoRepository pedidoRepository;
    private final ProductoClient productoClient;
    
    public List<Pedido> findAll() {
        return pedidoRepository.findAll();
    }
    
    public Optional<Pedido> findById(Long id) {
        return pedidoRepository.findById(id);
    }
    
    public Pedido save(Pedido pedido) {
        // Verificamos disponibilidad de productos
        boolean stockDisponible = pedido.getItems().stream()
            .allMatch(item -> {
                Producto producto = productoClient.getProducto(item.getProductoId());
                return producto != null && producto.getStock() >= item.getCantidad();
            });
        
        if (!stockDisponible) {
            throw new RuntimeException("Stock insuficiente para algunos productos");
        }
        
        // Actualizamos el stock
        pedido.getItems().forEach(item -> 
            productoClient.actualizarStock(item.getProductoId(), item.getCantidad())
        );
        
        // Guardamos el pedido
        return pedidoRepository.save(pedido);
    }
}
```

Este es un patrón que he usado con éxito, pero también me gustaría destacar un error común:

> Un error que cometí al principio fue usar comunicación síncrona para **todo**. Esto creó dependencias rígidas entre servicios y generó problemas de rendimiento. Para operaciones asíncronas como notificaciones, ahora uso mensajería con Kafka o RabbitMQ.

## Paso 4: Implementando patrones avanzados

### 4.1 Circuit Breaker con Resilience4J

El Circuit Breaker es fundamental para evitar fallos en cascada. Configurémoslo en nuestro servicio de pedidos:

```java
// En servicio-pedidos/src/main/java/com/tuempresa/pedidos/config/Resilience4JConfig.java
package com.tuempresa.pedidos.config;

import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.timelimiter.TimeLimiterConfig;
import org.springframework.cloud.circuitbreaker.resilience4j.Resilience4JCircuitBreakerFactory;
import org.springframework.cloud.circuitbreaker.resilience4j.Resilience4JConfigBuilder;
import org.springframework.cloud.client.circuitbreaker.Customizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class Resilience4JConfig {

    @Bean
    public Customizer<Resilience4JCircuitBreakerFactory> defaultCustomizer() {
        return factory -> factory.configureDefault(id -> new Resilience4JConfigBuilder(id)
                .timeLimiterConfig(TimeLimiterConfig.custom()
                        .timeoutDuration(Duration.ofSeconds(3))
                        .build())
                .circuitBreakerConfig(CircuitBreakerConfig.custom()
                        .slidingWindowSize(10)
                        .failureRateThreshold(50)
                        .waitDurationInOpenState(Duration.ofSeconds(10))
                        .permittedNumberOfCallsInHalfOpenState(5)
                        .slowCallRateThreshold(50)
                        .slowCallDurationThreshold(Duration.ofSeconds(2))
                        .build())
                .build());
    }
}
```

Esta configuración:
- Establece un timeout de 3 segundos para las llamadas
- Abre el circuito cuando la tasa de fallos supera el 50%
- Mantiene el circuito abierto durante 10 segundos
- Considera llamadas "lentas" aquellas que duran más de 2 segundos

### 4.2 Coreografía de servicios con Event-Driven Architecture

Para evitar acoplamiento entre servicios, empecé a utilizar arquitecturas basadas en eventos con Spring Cloud Stream y Kafka:

```xml
<!-- En servicio-notificaciones/pom.xml -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-stream</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-stream-binder-kafka</artifactId>
</dependency>
```

Configuración:

```yaml
# En servicio-notificaciones/src/main/resources/application.yml
spring:
  cloud:
    stream:
      function:
        definition: procesarPedidoCreado
      bindings:
        procesarPedidoCreado-in-0:
          destination: pedidos-creados
          group: notificaciones-service
      kafka:
        binder:
          brokers: localhost:9092
```

Consumidor del evento:

```java
// En servicio-notificaciones/src/main/java/com/tuempresa/notificaciones/stream/EventConsumer.java
package com.tuempresa.notificaciones.stream;

import com.tuempresa.notificaciones.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.function.Consumer;

@Component
@RequiredArgsConstructor
@Slf4j
public class EventConsumer {

    private final NotificacionService notificacionService;

    @Bean
    public Consumer<PedidoEvent> procesarPedidoCreado() {
        return pedidoEvent -> {
            log.info("Recibido evento de pedido creado: {}", pedidoEvent);
            notificacionService.enviarNotificacionPedido(
                pedidoEvent.getUsuarioId(), 
                pedidoEvent.getPedidoId(),
                pedidoEvent.getTotal()
            );
        };
    }
}
```

Productor en el servicio de pedidos:

```java
// En servicio-pedidos/src/main/java/com/tuempresa/pedidos/service/PedidoService.java
@Service
@RequiredArgsConstructor
public class PedidoService {
    // ... otras dependencias
    private final StreamBridge streamBridge;
    
    public Pedido save(Pedido pedido) {
        // ... validación y lógica anterior
        
        // Guardamos el pedido
        Pedido pedidoGuardado = pedidoRepository.save(pedido);
        
        // Publicamos evento
        streamBridge.send("pedidos-creados", new PedidoEvent(
            pedidoGuardado.getId(),
            pedidoGuardado.getUsuarioId(),
            pedidoGuardado.getTotal()
        ));
        
        return pedidoGuardado;
    }
}
```

## Paso 5: Desplegando en Kubernetes

Kubernetes se ha convertido en el estándar de facto para desplegar microservicios. Aunque configurarlo correctamente lleva tiempo, el resultado merece la pena.

### 5.1 Dockerización de los servicios

Para cada servicio, creamos un Dockerfile similar a este:

```dockerfile
# En servicio-productos/Dockerfile
FROM eclipse-temurin:17-jdk-alpine as build
WORKDIR /workspace/app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN ./mvnw package -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

FROM eclipse-temurin:17-jre-alpine
VOLUME /tmp
ARG DEPENDENCY=/workspace/app/target/dependency

COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

ENTRYPOINT ["java","-cp","app:app/lib/*","com.tuempresa.productos.ProductosApplication"]
```

### 5.2 Manifiestos de Kubernetes

Para cada servicio, necesitamos al menos un Deployment y un Service. Veamos el ejemplo del discovery-server:

```yaml
# En k8s/discovery-server.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: discovery-server
spec:
  replicas: 1
  selector:
    matchLabels:
      app: discovery-server
  template:
    metadata:
      labels:
        app: discovery-server
    spec:
      containers:
        - name: discovery-server
          image: tuusuario/discovery-server:latest
          ports:
            - containerPort: 8761
          env:
            - name: SPRING_PROFILES_ACTIVE
              value: "kubernetes"
---
apiVersion: v1
kind: Service
metadata:
  name: discovery-server
spec:
  selector:
    app: discovery-server
  ports:
    - port: 8761
      targetPort: 8761
  type: ClusterIP
```

Para el API Gateway, necesitaremos exponerlo externamente:

```yaml
# En k8s/api-gateway.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
spec:
  replicas: 2  # Alta disponibilidad
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
        - name: api-gateway
          image: tuusuario/api-gateway:latest
          ports:
            - containerPort: 8080
          env:
            - name: SPRING_PROFILES_ACTIVE
              value: "kubernetes"
          resources:
            requests:
              memory: "256Mi"
              cpu: "100m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          readinessProbe:
            httpGet:
              path: /actuator/health/readiness
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /actuator/health/liveness
              port: 8080
            initialDelaySeconds: 60
            periodSeconds: 15
---
apiVersion: v1
kind: Service
metadata:
  name: api-gateway
spec:
  selector:
    app: api-gateway
  ports:
    - port: 80
      targetPort: 8080
  type: LoadBalancer
```

### 5.3 ConfigMaps para configuración en Kubernetes

Aunque tenemos Spring Cloud Config, para las configuraciones específicas de Kubernetes podemos usar ConfigMaps:

```yaml
# En k8s/config-maps.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: microservices-config
data:
  EUREKA_SERVER_URL: "http://discovery-server:8761/eureka/"
  CONFIG_SERVER_URL: "http://config-server:8888"
  KAFKA_URL: "kafka-broker:9092"
```

Y referenciarlo en nuestros deployments:

```yaml
env:
  - name: SPRING_PROFILES_ACTIVE
    value: "kubernetes"
  - name: EUREKA_CLIENT_SERVICEURL_DEFAULTZONE
    valueFrom:
      configMapKeyRef:
        name: microservices-config
        key: EUREKA_SERVER_URL
```

### 5.4 Secretos para información sensible

Para contraseñas, tokens y otra información sensible, usamos Kubernetes Secrets:

```yaml
# En k8s/secrets.yaml (esto debería ser creado con valores codificados en base64)
apiVersion: v1
kind: Secret
metadata:
  name: microservices-secrets
type: Opaque
data:
  database-password: cGFzc3dvcmQ=  # 'password' en base64
  api-key: c2VjcmV0LWtleQ==        # 'secret-key' en base64
```

Y referenciarlo:

```yaml
env:
  - name: SPRING_DATASOURCE_PASSWORD
    valueFrom:
      secretKeyRef:
        name: microservices-secrets
        key: database-password
```

## Paso 6: Observabilidad y monitorización

La observabilidad es crucial en arquitecturas de microservicios. Con servicios distribuidos, necesitamos visibilidad completa sobre lo que está ocurriendo.

### 6.1 Distributed Tracing con Spring Cloud Sleuth y Zipkin

Spring Cloud Sleuth nos ayuda a rastrear solicitudes a través de múltiples servicios:

```xml
<!-- En pom.xml de cada servicio -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-sleuth</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-sleuth-zipkin</artifactId>
</dependency>
```

Configuración:

```yaml
# En application.yml de cada servicio
spring:
  sleuth:
    sampler:
      probability: 1.0  # En producción, usar un valor menor como 0.1
  zipkin:
    base-url: http://zipkin-server:9411
```

### 6.2 Métricas con Prometheus y Grafana

Para monitorización en tiempo real:

```xml
<!-- En pom.xml de cada servicio -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

Configuración:

```yaml
# En application.yml de cada servicio
management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus
  metrics:
    export:
      prometheus:
        enabled: true
  health:
    circuitbreakers:
      enabled: true
    ratelimiters:
      enabled: true
```

Después, configuramos Prometheus para recopilar estas métricas:

```yaml
# En prometheus.yml
scrape_configs:
  - job_name: 'spring-actuator'
    metrics_path: '/actuator/prometheus'
    scrape_interval: 5s
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
```

### 6.3 Logging centralizado con ELK Stack

Para centralizar logs:

```xml
<!-- En pom.xml de cada servicio -->
<dependency>
    <groupId>net.logstash.logback</groupId>
    <artifactId>logstash-logback-encoder</artifactId>
    <version>7.3</version>
</dependency>
```

Configuración de Logback:

```xml
<!-- En logback-spring.xml -->
<appender name="LOGSTASH" class="net.logstash.logback.appender.LogstashTcpSocketAppender">
    <destination>logstash:5000</destination>
    <encoder class="net.logstash.logback.encoder.LogstashEncoder">
        <includeMdc>true</includeMdc>
        <customFields>{"app_name":"${spring.application.name}"}</customFields>
    </encoder>
</appender>

<root level="INFO">
    <appender-ref ref="CONSOLE" />
    <appender-ref ref="LOGSTASH" />
</root>
```

## Errores comunes y lecciones aprendidas

Después de implementar varias arquitecturas de microservicios con Spring Cloud, he identificado algunos errores comunes:

### Granularidad incorrecta

Mi error más costoso fue comenzar con microservicios demasiado pequeños. Cada entidad se convirtió en un microservicio, lo que generó una sobrecarga de comunicaciones y complejidad innecesaria.

**Lección**: Define los límites de tus microservicios basándote en dominios de negocio, no en entidades técnicas. Un microservicio debe representar una capacidad de negocio completa.

### Transacciones distribuidas

Intenté mantener la consistencia ACID entre microservicios, lo que resultó en mecanismos complejos de compensación y coordinación.

**Lección**: Adopta la consistencia eventual donde sea posible. Usa patrones como Saga o Event Sourcing para gestionar transacciones que atraviesan múltiples servicios.

### Insuficiente observabilidad

Al principio, no invertí suficiente en herramientas de observabilidad y me encontré "a ciegas" cuando surgían problemas en producción.

**Lección**: Implementa una estrategia de observabilidad desde el primer día. Logs, métricas y trazas distribuidas son esenciales, no opcionales.

### Ausencia de automatización

Los despliegues manuales se volvieron imposibles de gestionar con decenas de microservicios.

**Lección**: Automatiza todo desde el principio. CI/CD, pruebas, aprovisionamiento de infraestructura y despliegues deben ser completamente automatizados.

## Comparativa de tecnologías

| Característica | Spring Cloud Netflix | Spring Cloud Kubernetes | Ventaja |
|----------------|----------------------|-------------------------|---------|
| Service Discovery | Eureka | Kubernetes Service Discovery | Kubernetes en entornos cloud |
| Configuración | Config Server | ConfigMaps y Secrets | Config Server para actualizaciones sin reinicio |
| API Gateway | Spring Cloud Gateway | Ingress o Istio | Istio para capacidades avanzadas de service mesh |
| Circuit Breaking | Resilience4J | Istio | Resilience4J para control fino desde código |
| Observabilidad | Zipkin, Prometheus | Istio, Jaeger | Istio para observabilidad sin código adicional |

## Conclusión

Implementar una arquitectura de microservicios con Spring Cloud es un viaje que requiere paciencia, aprendizaje continuo y una buena dosis de pragmatismo. No hay una solución única para todos los casos, y a menudo las mejores decisiones surgen después de cometer algunos errores.

Mi consejo más valioso: comenzad con un monolito bien diseñado y extraed microservicios gradualmente cuando tengáis un buen entendimiento de los límites del dominio. No saltéis a microservicios solo porque está de moda; hacedlo cuando tengáis un problema real que solucionar.

Los beneficios que he experimentado incluyen:
- Despliegues independientes que redujeron nuestro tiempo de entrega de semanas a horas
- Escalabilidad selectiva para los componentes que realmente lo necesitaban
- Mayor resiliencia, donde la caída de un servicio no afectaba al sistema completo
- Equipos autónomos trabajando en paralelo sin pisarse unos a otros

¿Estáis planteándoos implementar microservicios? ¿O quizá ya tenéis experiencia con Spring Cloud? Me encantaría leer vuestras experiencias y responder a vuestras preguntas en los comentarios.

## Recursos adicionales

- [Documentación oficial de Spring Cloud](https://spring.io/projects/spring-cloud)
- [Patrones de microservicios](https://microservices.io/patterns/index.html)
- [Kubernetes para desarrolladores Java](https://kubernetes.io/docs/tutorials/)
- [Event Sourcing y CQRS](https://microservices.io/patterns/data/event-sourcing.html)
- [Observabilidad en microservicios](https://opentelemetry.io/)
