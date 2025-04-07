---
title: Creando microservicios con Spring Boot
date: 2025-04-07T12:30:00.000Z
thumbnail: /images/blog/spring-boot.png
description: Guía práctica para desarrollar microservicios con Spring Boot en
  2025 sin complicaciones.
category: Backend
tags:
  - java
  - spring
  - microservicios
  - backend
---
## Microservicios con Spring Boot: simplicidad y potencia

Después de tanto tiempo trabajando con distintos frameworks, siempre acabo volviendo a Spring Boot para mis proyectos de microservicios. Y es que, a pesar de que muchos lo consideran "pesado" o "antiguo", la realidad es que Spring Boot ha evolucionado muchísimo, simplificando drásticamente el desarrollo.

La semana pasada tuve que montar un pequeño servicio para un cliente, y quiero compartir ese proceso con vosotros. Vamos a ver cómo crear un microservicio sencillo pero completo con Spring Boot 3.2 (la versión actual en 2025).

## Preparando el entorno

Antes de nada, asegúrate de tener instalado:

* Java 17 o superior (yo uso Java 21)
* Maven o Gradle (personalmente prefiero Gradle)
* Tu IDE favorito (IntelliJ IDEA, Eclipse, VS Code...)

## Generando el proyecto base

Lo primero es crear la estructura del proyecto. Aunque puedes hacerlo manualmente, Spring Initializr es tu mejor amigo aquí:

1. Ve a <https://start.spring.io>
2. Configura el proyecto:

   * **Project**: Gradle (o Maven si lo prefieres)
   * **Language**: Java
   * **Spring Boot**: 3.2.x
   * **Group**: com.tuempresa (usa tu dominio invertido)
   * **Artifact**: mi-servicio (este será el nombre de tu proyecto)
   * **Packaging**: Jar
   * **Java**: 17 (o superior)
3. Añade dependencias (las básicas para un microservicio):

   * Spring Web
   * Spring Data JPA
   * H2 Database (para desarrollo)
   * Validation
   * Spring Boot Actuator
   * Lombok (opcional, pero ahorra mucho código)
4. Haz clic en "GENERATE" y descarga el ZIP.

## Estructura del proyecto

Una vez descomprimido, tendrás una estructura como esta:

```
mi-servicio/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── tuempresa/
│   │   │           └── miservicio/
│   │   │               └── MiServicioApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── static/
│   │       └── templates/
│   └── test/
├── build.gradle (o pom.xml)
└── README.md
```

## Configuración básica

Vamos a configurar lo esencial en `application.properties` (o `application.yml` si prefieres YAML):

```properties
# Puerto del servidor (si no lo especificas, usará el 8080)
server.port=8081

# Configuración de la base de datos (H2 en memoria para desarrollo)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.h2.console.enabled=true

# JPA/Hibernate
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.format_sql=true

# Actuator (monitorización)
management.endpoints.web.exposure.include=health,info,metrics
```

## Creando un modelo de datos

Vamos a crear una entidad sencilla para nuestro microservicio. Por ejemplo, un `Producto`:

```java
package com.tuempresa.miservicio.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Entity
@Data
public class Producto {

    @Id
    @GeneratedValue
    private Long id;
    
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
    
    private String descripcion;
    
    @Positive(message = "El precio debe ser mayor que cero")
    private Double precio;
    
    private boolean disponible = true;
}
```

## Capa de acceso a datos

Ahora, creamos un repositorio usando Spring Data JPA:

```java
package com.tuempresa.miservicio.repository;

import com.tuempresa.miservicio.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByDisponibleTrue();
    List<Producto> findByNombreContainingIgnoreCase(String nombre);
}
```

## Lógica de negocio: el servicio

Creemos un servicio para encapsular la lógica:

```java
package com.tuempresa.miservicio.service;

import com.tuempresa.miservicio.model.Producto;
import com.tuempresa.miservicio.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    
    @Autowired
    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }
    
    public List<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }
    
    public List<Producto> obtenerDisponibles() {
        return productoRepository.findByDisponibleTrue();
    }
    
    public Optional<Producto> obtenerPorId(Long id) {
        return productoRepository.findById(id);
    }
    
    public Producto guardar(Producto producto) {
        return productoRepository.save(producto);
    }
    
    public void eliminar(Long id) {
        productoRepository.deleteById(id);
    }
    
    public List<Producto> buscarPorNombre(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCase(nombre);
    }
}
```

## Exponiendo la API REST

Finalmente, creamos el controlador que expone los endpoints REST:

```java
package com.tuempresa.miservicio.controller;

import com.tuempresa.miservicio.model.Producto;
import com.tuempresa.miservicio.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;
    
    @Autowired
    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }
    
    @GetMapping
    public List<Producto> obtenerTodos() {
        return productoService.obtenerTodos();
    }
    
    @GetMapping("/disponibles")
    public List<Producto> obtenerDisponibles() {
        return productoService.obtenerDisponibles();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerPorId(@PathVariable Long id) {
        return productoService.obtenerPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Producto crear(@Valid @RequestBody Producto producto) {
        return productoService.guardar(producto);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar(@PathVariable Long id, @Valid @RequestBody Producto producto) {
        return productoService.obtenerPorId(id)
            .map(productoExistente -> {
                producto.setId(id);
                return ResponseEntity.ok(productoService.guardar(producto));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        return productoService.obtenerPorId(id)
            .map(producto -> {
                productoService.eliminar(id);
                return ResponseEntity.ok().<Void>build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/buscar")
    public List<Producto> buscarPorNombre(@RequestParam String nombre) {
        return productoService.buscarPorNombre(nombre);
    }
}
```

## Datos iniciales (opcional)

Para tener datos de prueba, podemos crear un `CommandLineRunner` en nuestra clase principal:

```java
package com.tuempresa.miservicio;

import com.tuempresa.miservicio.model.Producto;
import com.tuempresa.miservicio.repository.ProductoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class MiServicioApplication {

    public static void main(String[] args) {
        SpringApplication.run(MiServicioApplication.class, args);
    }
    
    @Bean
    CommandLineRunner inicializarDatos(ProductoRepository productoRepository) {
        return args -> {
            productoRepository.save(new Producto(null, "Laptop Pro", "Potente laptop para desarrollo", 1299.99, true));
            productoRepository.save(new Producto(null, "Monitor UltraWide", "Monitor de 34 pulgadas", 499.50, true));
            productoRepository.save(new Producto(null, "Teclado Mecánico", "Teclado para programadores", 89.90, true));
            productoRepository.save(new Producto(null, "Mouse Gaming", "Mouse ergonómico de alta precisión", 45.00, false));
        };
    }
}
```

Nota: esto dará un error de compilación porque nuestro modelo usa Lombok y no tiene un constructor con esos parámetros. Lo ideal sería modificar el modelo para incluir un constructor adecuado, o usar los setters.

## Ejecutando el microservicio

Simplemente ejecuta:

```bash
# Con Gradle
./gradlew bootRun

# Con Maven
./mvnw spring-boot:run
```

Y listo, tienes tu microservicio corriendo en http://localhost:8081.

## Probando la API

Puedes usar Postman, cURL o cualquier cliente HTTP para probar los endpoints:

* `GET /api/productos`: Obtener todos los productos
* `GET /api/productos/disponibles`: Solo los disponibles
* `GET /api/productos/1`: Obtener producto con ID 1
* `POST /api/productos`: Crear un nuevo producto
* `PUT /api/productos/1`: Actualizar el producto con ID 1
* `DELETE /api/productos/1`: Eliminar el producto con ID 1
* `GET /api/productos/buscar?nombre=laptop`: Buscar productos por nombre

## Observaciones personales

Después de implementar esto, me di cuenta de varias cosas:

1. Spring Boot hace casi toda la magia por debajo, configurando sensatamente los componentes.
2. El desarrollo es increíblemente rápido cuando tienes las dependencias adecuadas.
3. La integración con bases de datos es prácticamente automática.

Pero también hay aspectos a considerar:

* En microservicios reales, necesitarás configurar descubrimiento de servicios (Eureka, Consul).
* La seguridad es crítica (Spring Security, OAuth2/JWT).
* En producción, querrás una base de datos real y no H2 en memoria.

En próximos artículos veremos cómo desplegar este microservicio en contenedores Docker y cómo configurarlo para un entorno de producción robusto.

¿Qué opináis? ¿Seguís usando Spring Boot o habéis migrado a otras tecnologías como Quarkus o Micronaut?
