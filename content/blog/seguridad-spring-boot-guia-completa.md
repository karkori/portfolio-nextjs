---
title: Seguridad en aplicaciones Spring Boot - Desde autenticación básica hasta OAuth2 y JWT
date: 2025-04-11T10:45:00.000Z
thumbnail: /images/blog/spring-security.png
description: Implementa diferentes niveles de seguridad en tus aplicaciones Spring Boot, desde configuraciones básicas hasta soluciones avanzadas con OAuth2 y JWT.
category: Backend
tags:
  - java
  - spring
  - seguridad
  - backend
  - jwt
---
## Mi evolución con Spring Security: de principiante a experto

Todavía recuerdo mi primer proyecto real con Spring Boot. La aplicación funcionaba perfectamente en desarrollo: los endpoints respondían rápido, la integración con la base de datos era fluida y el cliente estaba encantado... hasta que mencioné que cualquiera con acceso a la URL podía ver todos los datos. "¿No tiene seguridad?", preguntó con cara de espanto. Mi respuesta tímida fue "eso es para la siguiente fase", mientras internamente entraba en pánico pensando en todo lo que desconocía sobre Spring Security.

Mi viaje comenzó con la autenticación básica: usuario y contraseña en memoria, suficiente para salir del paso. Después vinieron los usuarios en base de datos, formularios personalizados y, finalmente, mi primera implementación de JWT. El día que tuve que integrar nuestro sistema con Azure AD mediante OAuth2, pasé tres noches seguidas depurando tokens y redirecciones que no funcionaban.

En este artículo, os compartiré todo lo que he aprendido durante años implementando seguridad en aplicaciones Spring Boot. No es teoría, son soluciones que uso en producción, con ejemplos reales, configuraciones probadas y, lo más importante, explicaciones de por qué cada enfoque es adecuado para diferentes escenarios.

## ¿Qué vamos a abordar?

Un recorrido completo por las opciones de seguridad en Spring Boot:
1. Fundamentos de Spring Security: arquitectura y componentes esenciales
2. Autenticación básica: configuración, almacenamiento de credenciales y limitaciones
3. Autenticación con formularios: personalización y gestión de sesiones
4. Implementación de JWT: generación, validación y renovación de tokens
5. OAuth2 y OpenID Connect: integración con proveedores externos
6. Mejores prácticas y escenarios avanzados: CORS, CSRF, autorización a nivel de método

Al final del artículo, tendrás el conocimiento necesario para implementar cualquiera de estos mecanismos en tus propias aplicaciones, entendiendo sus ventajas y desventajas.

## Prerrequisitos

Para seguir este tutorial necesitarás:
- Conocimientos básicos de Spring Boot
- Java 17 o superior
- Maven o Gradle para gestionar dependencias
- Un IDE como IntelliJ IDEA o Eclipse
- Postman u otra herramienta similar para probar APIs REST

No explicaré conceptos básicos de Spring Boot, así que si eres totalmente nuevo con este framework, te recomiendo familiarizarte primero con sus fundamentos.

## Estructura del proyecto de ejemplo

Usaré una aplicación Spring Boot sencilla pero completa como ejemplo a lo largo del artículo. Para que podáis seguirlo fácilmente, aquí está la estructura básica:

```
secure-app/
├── src/
│   ├── main/
│   │   ├── java/com/example/secureapp/
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   └── JwtConfig.java
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java
│   │   │   │   └── ResourceController.java
│   │   │   ├── model/
│   │   │   │   ├── User.java
│   │   │   │   └── Role.java
│   │   │   ├── repository/
│   │   │   │   └── UserRepository.java
│   │   │   ├── service/
│   │   │   │   ├── UserService.java
│   │   │   │   └── JwtService.java
│   │   │   └── SecureAppApplication.java
│   │   ├── resources/
│   │       ├── application.yml
│   │       └── db/migration/...
│   └── test/
│       └── java/com/example/secureapp/...
├── pom.xml
└── README.md
```

## Fundamentos de Spring Security: arquitectura y componentes esenciales

Antes de sumergirnos en implementaciones específicas, necesitamos entender cómo funciona Spring Security por dentro. Durante años, me costó comprender su arquitectura hasta que finalmente visualicé el flujo completo.

### La cadena de filtros: el corazón de Spring Security

Spring Security se basa fundamentalmente en una **cadena de filtros de servlet** que se ejecuta antes de que las peticiones lleguen a los controladores. Esta es la clave para entender todo el framework.

Cuando una petición HTTP llega a nuestra aplicación, debe pasar por una serie de filtros secuenciales, cada uno con una responsabilidad específica:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // En APIs REST a menudo se deshabilita
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .permitAll()
            );
        
        return http.build();
    }
}
```

Este fragmento de código muestra la configuración básica de Spring Security, donde definimos qué endpoints son públicos, cuáles requieren autenticación y con qué roles. La clase `SecurityFilterChain` es la que determina qué filtros se aplicarán y en qué orden.

### Los componentes esenciales que debes conocer

Durante mis primeros proyectos con Spring Security, me costaba entender qué componentes debía implementar o extender. Aquí están los que considero fundamentales:

#### 1. Authentication

Este objeto representa al usuario autenticado. Contiene:
- Las credenciales (password)
- Los detalles del principal (username normalmente)
- Las autoridades o roles asignados
- Un indicador de si está autenticado

#### 2. AuthenticationManager

Es el componente encargado de procesar la autenticación. Recibe un objeto `Authentication` sin autenticar (con las credenciales proporcionadas) y devuelve uno autenticado.

#### 3. UserDetailsService

Carga la información específica del usuario. Aquí es donde generalmente conectamos con nuestra base de datos:

```java
@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    private final UserRepository userRepository;
    
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
        
        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            user.isEnabled(),
            true, true, true,
            getAuthorities(user.getRoles())
        );
    }
    
    private Collection<? extends GrantedAuthority> getAuthorities(Set<Role> roles) {
        return roles.stream()
            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
            .collect(Collectors.toList());
    }
}
```

#### 4. PasswordEncoder

Se encarga de codificar y verificar contraseñas. **Nunca almacenes contraseñas en texto plano** (aprendí esto por las malas en mis primeros proyectos). Spring Security ofrece varios encoders, pero actualmente recomiendo BCrypt:

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12); // El número es la "fuerza" del algoritmo
}
```

### El flujo completo de autenticación

Para ilustrar mejor cómo funcionan estos componentes juntos, aquí está el flujo típico de autenticación:

1. El usuario envía sus credenciales (username/password)
2. Un filtro de autenticación (como `UsernamePasswordAuthenticationFilter`) crea un token de autenticación sin verificar
3. El token se pasa al `AuthenticationManager`
4. El `AuthenticationManager` delega en un `AuthenticationProvider` adecuado
5. El `AuthenticationProvider` usa el `UserDetailsService` para cargar los detalles del usuario
6. El `PasswordEncoder` verifica la contraseña proporcionada
7. Si la autenticación es exitosa, se crea un objeto `Authentication` completamente autenticado
8. Este objeto se almacena en el `SecurityContext`

En proyectos reales, entender este flujo me ha ayudado a resolver innumerables problemas de configuración y personalización.

## Autenticación básica: configuración, almacenamiento de credenciales y limitaciones

La autenticación básica HTTP es el mecanismo más sencillo ofrecido por Spring Security. Aunque en producción raramente uso esta opción por sus limitaciones, es un buen punto de partida para entender los conceptos.

### Configuración mínima para autenticación básica

En mi primer proyecto con Spring Security, configuré la autenticación básica con credenciales en memoria:

```java
@Configuration
@EnableWebSecurity
public class BasicSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults());
        
        return http.build();
    }
    
    @Bean
    public InMemoryUserDetailsManager userDetailsManager() {
        UserDetails user = User.builder()
            .username("usuario")
            .password(passwordEncoder().encode("password"))
            .roles("USER")
            .build();
            
        UserDetails admin = User.builder()
            .username("admin")
            .password(passwordEncoder().encode("adminpass"))
            .roles("ADMIN", "USER")
            .build();
            
        return new InMemoryUserDetailsManager(user, admin);
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

Con esta configuración, todas las peticiones requieren autenticación usando el mecanismo HTTP Basic, que envía el username y password en cada petición codificados en Base64 (no encriptados, solo codificados).

### Autenticación básica con usuarios en base de datos

En proyectos reales, necesitamos almacenar los usuarios en una base de datos. Este es el enfoque que suelo utilizar:

1. Primero, definimos nuestras entidades:

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    private boolean enabled = true;
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
    
    // Getters y setters
}

@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String name;
    
    // Getters y setters
}
```

2. Creamos un repositorio JPA para acceder a los usuarios:

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
```

3. Implementamos nuestro `UserDetailsService` personalizado (similar al que vimos antes):

```java
@Service
public class DatabaseUserDetailsService implements UserDetailsService {
    
    private final UserRepository userRepository;
    
    @Autowired
    public DatabaseUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
            .map(this::buildUserDetails)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
    }
    
    private UserDetails buildUserDetails(User user) {
        List<GrantedAuthority> authorities = user.getRoles().stream()
            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
            .collect(Collectors.toList());
            
        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            user.isEnabled(),
            true, true, true,
            authorities
        );
    }
}
```

4. Finalmente, actualizamos nuestra configuración de seguridad:

```java
@Configuration
@EnableWebSecurity
public class DatabaseSecurityConfig {

    private final UserDetailsService userDetailsService;
    
    public DatabaseSecurityConfig(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults());
        
        return http.build();
    }
    
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### Limitaciones de la autenticación básica

Después de usar autenticación básica en varios proyectos pequeños, identifiqué estas importantes limitaciones:

1. **No hay manejo de sesiones**: Las credenciales deben enviarse con cada petición
2. **Seguridad limitada**: Las credenciales se envían en cada petición (solo codificadas en Base64, no encriptadas)
3. **No hay forma nativa de cerrar sesión**: Al no haber sesión, no existe un mecanismo para invalidar credenciales
4. **Experiencia de usuario pobre**: La mayoría de navegadores muestran un diálogo poco amigable para ingresar credenciales
5. **Sin control granular**: No hay forma sencilla de implementar expiración o roles dinámicos

Un error común que cometí al principio fue pensar que la autenticación básica era suficiente para aplicaciones en producción. Con el tiempo aprendí que solo es adecuada para:
- Entornos de desarrollo
- APIs internas con baja sensibilidad
- Pruebas y prototipos rápidos
- APIs consumidas por otras aplicaciones (no directamente por usuarios)

En la siguiente sección, exploraremos la autenticación basada en formularios, que resuelve muchas de estas limitaciones.

[IMAGEN]
Título: Flujo de autenticación básica en Spring Security
Descripción: Diagrama mostrando el flujo completo de autenticación básica en Spring Security
Alt-text: Diagrama de flujo de autenticación básica Spring Security con filtros, authentication manager y user details service

## Autenticación con formularios: personalización y gestión de sesiones

La mayoría de aplicaciones web tradicionales utilizan formularios para la autenticación. Este enfoque ofrece una experiencia más amigable y mayor control sobre el proceso de login. Fue la segunda etapa en mi evolución con Spring Security.

### Configuración básica de login con formulario

Después de la autenticación básica, implementar formularios de login es el siguiente paso lógico. Aquí está la configuración:

```java
@Configuration
@EnableWebSecurity
public class FormLoginSecurityConfig {

    private final UserDetailsService userDetailsService;
    
    public FormLoginSecurityConfig(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/resources/**", "/signup", "/about").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .permitAll()
                .defaultSuccessUrl("/dashboard", true)
                .failureUrl("/login?error=true")
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout=true")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
            )
            .rememberMe(remember -> remember
                .key("uniqueAndSecret")
                .tokenValiditySeconds(86400) // 1 día
            );
        
        return http.build();
    }
    
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

Lo interesante aquí es que Spring Security:
1. Maneja automáticamente la sesión mediante JSESSIONID
2. Proporciona funcionalidad de "Recordarme" con cookies persistentes
3. Gestiona el cierre de sesión invalidando la sesión y eliminando cookies

### Creando tu propio formulario de login

El formulario de login predeterminado de Spring Security es funcional pero básico. En proyectos reales, siempre he necesitado crear uno propio que se ajuste al diseño de la aplicación. Aquí tienes un ejemplo de un formulario personalizado:

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container">
        <div class="row justify-content-center mt-5">
            <div class="col-md-6">
                <div class="card shadow">
                    <div class="card-body p-5">
                        <h3 class="card-title text-center mb-4">Iniciar sesión</h3>
                        
                        <div th:if="${param.error}" class="alert alert-danger">
                            Credenciales incorrectas. Por favor, inténtalo de nuevo.
                        </div>
                        
                        <div th:if="${param.logout}" class="alert alert-success">
                            Has cerrado sesión correctamente.
                        </div>
                        
                        <form th:action="@{/login}" method="post">
                            <div class="mb-3">
                                <label for="username" class="form-label">Usuario</label>
                                <input type="text" class="form-control" id="username" name="username" required autofocus>
                            </div>
                            
                            <div class="mb-3">
                                <label for="password" class="form-label">Contraseña</label>
                                <input type="password" class="form-control" id="password" name="password" required>
                            </div>
                            
                            <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="remember-me" name="remember-me">
                                <label class="form-check-label" for="remember-me">Recordarme</label>
                            </div>
                            
                            <div class="d-grid">
                                <button type="submit" class="btn btn-primary">Entrar</button>
                            </div>
                        </form>
                        
                        <div class="text-center mt-3">
                            <a th:href="@{/forgot-password}">¿Olvidaste tu contraseña?</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
```

Es importante notar que:
- Los nombres de los campos deben ser **username** y **password** (o configurar nombres personalizados)
- El formulario debe hacer POST a la URL de login configurada
- Los mensajes de error y cierre de sesión se pueden mostrar utilizando los parámetros de la URL

### Personalización avanzada del proceso de autenticación

En proyectos complejos, a menudo necesitamos personalizar el proceso de autenticación más allá de la configuración básica. Por ejemplo, podríamos querer:

1. **Autenticación con múltiples campos**: Por ejemplo, solicitar también un código de empresa además del usuario y contraseña
2. **Verificación en dos pasos**: Implementar un segundo factor de autenticación
3. **Auditoría de intentos de login**: Registrar cada intento en base de datos

Veamos cómo implementar algunos de estos escenarios:

#### Autenticación personalizada con un AuthenticationProvider

Uno de los desafíos más interesantes que enfrenté fue implementar autenticación con múltiples campos. Para ello, creé un proveedor de autenticación personalizado:

```java
@Component
public class CustomAuthenticationProvider implements AuthenticationProvider {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CompanyRepository companyRepository;
    
    public CustomAuthenticationProvider(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            CompanyRepository companyRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.companyRepository = companyRepository;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        String password = authentication.getCredentials().toString();
        
        // Extraer código de empresa de los detalles adicionales
        CustomAuthenticationDetails details = (CustomAuthenticationDetails) authentication.getDetails();
        String companyCode = details.getCompanyCode();
        
        // Verificar que la empresa existe
        if (!companyRepository.existsByCode(companyCode)) {
            throw new BadCredentialsException("Código de empresa inválido");
        }
        
        // Buscar usuario
        User user = userRepository.findByUsernameAndCompanyCode(username, companyCode)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        
        // Verificar contraseña
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Contraseña incorrecta");
        }
        
        // Verificar que la cuenta esté activa
        if (!user.isEnabled()) {
            throw new DisabledException("Cuenta desactivada");
        }
        
        // Crear objeto Authentication autenticado
        List<GrantedAuthority> authorities = user.getRoles().stream()
            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
            .collect(Collectors.toList());
            
        return new UsernamePasswordAuthenticationToken(username, password, authorities);
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
```

Para capturar el código de empresa del formulario, también creé una clase para extraer detalles adicionales de la petición:

```java
public class CustomAuthenticationDetails extends WebAuthenticationDetails {

    private final String companyCode;
    
    public CustomAuthenticationDetails(HttpServletRequest request) {
        super(request);
        this.companyCode = request.getParameter("company_code");
    }
    
    public String getCompanyCode() {
        return companyCode;
    }
}
```

Finalmente, configuré un `AuthenticationDetailsSource` personalizado:

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(...)
        .formLogin(form -> form
            .loginPage("/login")
            .permitAll()
            .authenticationDetailsSource(this::buildAuthenticationDetails)
            ...
        );
    
    return http.build();
}

private AuthenticationDetails buildAuthenticationDetails(HttpServletRequest request) {
    return new CustomAuthenticationDetails(request);
}
```

### Consejos y mejores prácticas para autenticación con formularios

Después de varios años implementando autenticación con formularios, puedo compartir estos consejos prácticos:

1. **Protección contra ataques de fuerza bruta**:
   - Implementa bloqueo de cuenta después de varios intentos fallidos
   - Añade captcha después de un número de intentos fallidos
   - Utiliza tiempos de espera crecientes entre intentos fallidos

2. **Mejora la seguridad de las sesiones**:
   - Rota los identificadores de sesión después del login
   - Establece timeouts adecuados según la sensibilidad de la aplicación
   - Invalida sesiones antiguas cuando el usuario inicia una nueva

3. **Experiencia de usuario**:
   - Proporciona mensajes de error específicos pero sin revelar información sensible
   - Redirige a la página original después de un login exitoso
   - Implementa recordatorios de contraseña seguros

Como ejemplo, aquí está cómo implementé un mecanismo simple de bloqueo de cuentas:

```java
@Service
public class AccountLockService {
    
    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final long LOCK_TIME_DURATION = 30 * 60 * 1000; // 30 minutos
    
    private final UserRepository userRepository;
    
    @Autowired
    public AccountLockService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public void increaseFailedAttempts(User user) {
        int newFailAttempts = user.getFailedAttempts() + 1;
        userRepository.updateFailedAttempts(newFailAttempts, user.getUsername());
    }
    
    public void resetFailedAttempts(String username) {
        userRepository.updateFailedAttempts(0, username);
    }
    
    public void lock(User user) {
        user.setAccountNonLocked(false);
        user.setLockTime(new Date());
        
        userRepository.save(user);
    }
    
    public boolean unlockWhenTimeExpired(User user) {
        long lockTimeInMillis = user.getLockTime().getTime();
        long currentTimeInMillis = System.currentTimeMillis();
        
        if (lockTimeInMillis + LOCK_TIME_DURATION < currentTimeInMillis) {
            user.setAccountNonLocked(true);
            user.setLockTime(null);
            user.setFailedAttempts(0);
            
            userRepository.save(user);
            
            return true;
        }
        
        return false;
    }
}
```

## Implementación de JWT: generación, validación y renovación de tokens

Cuando comencé a desarrollar aplicaciones SPA (Single Page Applications) con Angular y React, me di cuenta de que la autenticación basada en sesiones no era la mejor opción. Aquí es donde JWT (JSON Web Tokens) se convirtió en mi solución preferida.

### ¿Por qué JWT para APIs REST?

JWT ofrece varias ventajas para APIs modernas:

1. **Sin estado (stateless)**: El servidor no necesita mantener sesiones
2. **Escalabilidad**: Funciona perfectamente en entornos distribuidos y microservicios
3. **Cliente-agnóstico**: Compatible con cualquier cliente (web, móvil, IoT)
4. **Información rica**: Puede contener datos del usuario y permisos
5. **Seguridad**: La información está firmada (y opcionalmente encriptada)

### Estructura de un token JWT

Un JWT consiste en tres partes separadas por puntos:
- **Header**: Contiene el algoritmo de firma (HS256, RS256, etc.)
- **Payload**: Contiene los claims (información)
- **Signature**: Verifica la integridad del token

Por ejemplo:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### Implementando JWT en Spring Boot

Para implementar JWT en nuestro proyecto Spring Boot, primero añadimos las dependencias necesarias en nuestro `pom.xml`:

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
```

Luego, creamos un servicio para manejar la generación y validación de tokens:

```java
@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private long jwtExpiration;
    
    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;
    
    // Generar token de acceso
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }
    
    // Generar token con claims adicionales
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }
    
    // Generar token de refresco
    public String generateRefreshToken(UserDetails userDetails) {
        return buildToken(new HashMap<>(), userDetails, refreshExpiration);
    }
    
    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    // Validar token
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }
    
    // Extraer username del token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    // Extraer fecha de expiración
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    
    // Extraer cualquier claim
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
}
```

### Configurando los filtros para JWT

Para integrar JWT con Spring Security, creamos un filtro que capture y procese los tokens en cada petición:

```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;
        
        // Si no hay header de Authorization o no empieza con Bearer, pasamos al siguiente filtro
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // Extraer el token
        jwt = authHeader.substring(7);
        
        try {
            // Extraer el username
            username = jwtService.extractUsername(jwt);
            
            // Si hay username y no hay autenticación actual
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                
                // Validar el token
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // Actualizar el SecurityContext
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (ExpiredJwtException e) {
            // Manejar token expirado
            logger.error("JWT token ha expirado: {}", e.getMessage());
        } catch (JwtException e) {
            // Manejar token inválido
            logger.error("Error al validar JWT: {}", e.getMessage());
        }
        
        filterChain.doFilter(request, response);
    }
}
```

### Configuración de seguridad para JWT

Finalmente, configuramos Spring Security para usar nuestros componentes JWT:

```java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class JwtSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

Nótese que configuramos `SessionCreationPolicy.STATELESS` para indicar que no queremos mantener estado de sesión.

### Endpoints para autenticación con JWT

Para completar nuestra implementación, creamos endpoints para login y refresh token:

```java
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // Autenticar al usuario
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(null, null, "Credenciales inválidas"));
        }
        
        // Generar tokens JWT
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String accessToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);
        
        // Guardar refresh token en la base de datos
        userRepository.updateRefreshToken(request.getUsername(), refreshToken);
        
        return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken, null));
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        try {
            // Extraer username del token
            String username = jwtService.extractUsername(request.getRefreshToken());
            
            if (username != null) {
                // Buscar usuario en base de datos
                User user = userRepository.findByUsername(username)
                        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
                
                // Verificar que el refresh token coincide con el almacenado
                if (!request.getRefreshToken().equals(user.getRefreshToken())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(new AuthResponse(null, null, "Refresh token inválido"));
                }
                
                // Verificar validez del token
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (jwtService.isTokenValid(request.getRefreshToken(), userDetails)) {
                    String accessToken = jwtService.generateToken(userDetails);
                    
                    return ResponseEntity.ok(new AuthResponse(accessToken, request.getRefreshToken(), null));
                }
            }
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(null, null, "Token inválido o expirado"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(null, null, "Error al procesar el token"));
        }
    }
    
    // DTOs para peticiones y respuestas
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LoginRequest {
        private String username;
        private String password;
    }
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RefreshTokenRequest {
        private String refreshToken;
    }
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AuthResponse {
        private String accessToken;
        private String refreshToken;
        private String error;
    }
}
```

### Mejores prácticas y consideraciones de seguridad para JWT

Después de implementar JWT en varios proyectos, he aprendido algunas lecciones importantes:

1. **Seguridad del secreto**:
   - Utiliza un secreto fuerte (al menos 256 bits)
   - Rota periódicamente las claves
   - Considera usar algoritmos asimétricos (RS256) para mayor seguridad

2. **Contenido del token**:
   - Nunca incluyas información sensible en el payload
   - Minimiza el tamaño del token incluyendo solo lo necesario
   - Utiliza claims estándar como "sub", "iat", "exp"

3. **Gestión de tokens**:
   - Establece tiempos de expiración cortos para tokens de acceso (15-30 minutos)
   - Implementa refresh tokens con expiración más larga
   - Mantén una lista negra de tokens revocados si es necesario

4. **Manejo de errores**:
   - Proporciona mensajes genéricos que no revelen información específica
   - Implementa logging detallado para depuración interna
   - Considera incluir un identificador único en cada token para seguimiento

[IMAGEN]
Título: Flujo de autenticación JWT con Spring Security
Descripción: Diagrama mostrando el proceso completo de autenticación y autorización utilizando JWT
Alt-text: Diagrama de flujo de autenticación JWT con Spring Security mostrando generación, validación y renovación de tokens

## OAuth2 y OpenID Connect: integración con proveedores externos

La implementación de OAuth2 marcó otro hito importante en mi carrera. Recuerdo perfectamente el día que me asignaron integrar nuestra aplicación corporativa con Azure AD. "Es solo usar un par de anotaciones", me dijeron. Una semana después, seguía intentando entender por qué los tokens no se validaban correctamente.

OAuth2 y OpenID Connect son esenciales para aplicaciones modernas que necesitan integración con proveedores de identidad externos como Google, Facebook, Microsoft, Okta o cualquier proveedor compatible.

### Entendiendo OAuth2 y OpenID Connect

Antes de sumergirnos en el código, aclaremos algunos conceptos:

- **OAuth2**: Un protocolo de autorización que permite a una aplicación acceder a recursos en nombre del usuario sin compartir sus credenciales
- **OpenID Connect**: Una capa de identidad construida sobre OAuth2 que proporciona información sobre el usuario (claims)

Los roles principales en OAuth2 son:
1. **Resource Owner**: El usuario final
2. **Client**: La aplicación que solicita acceso (nuestra app Spring Boot)
3. **Authorization Server**: El servidor que emite tokens (Google, Microsoft, etc.)
4. **Resource Server**: El servidor que aloja los recursos protegidos

Los flujos más comunes son:
- **Authorization Code**: Para aplicaciones con backend
- **Implicit**: Para SPAs (menos seguro, ahora obsoleto)
- **Client Credentials**: Para comunicaciones servidor a servidor
- **Resource Owner Password**: Cuando el cliente es altamente confiable

### Configurando Spring Security para OAuth2 Login

Para implementar OAuth2 login en Spring Boot, primero añadimos las dependencias:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>
```

Luego configuramos los providers en `application.yml`:

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
            scope: openid,profile,email
          github:
            client-id: ${GITHUB_CLIENT_ID}
            client-secret: ${GITHUB_CLIENT_SECRET}
            scope: user:email,read:user
          azure:
            client-id: ${AZURE_CLIENT_ID}
            client-secret: ${AZURE_CLIENT_SECRET}
            scope: openid,profile,email
            client-name: Azure
            provider: azure-ad
        provider:
          azure-ad:
            issuer-uri: https://login.microsoftonline.com/${AZURE_TENANT_ID}/v2.0
            authorization-uri: https://login.microsoftonline.com/${AZURE_TENANT_ID}/oauth2/v2.0/authorize
            token-uri: https://login.microsoftonline.com/${AZURE_TENANT_ID}/oauth2/v2.0/token
            jwk-set-uri: https://login.microsoftonline.com/${AZURE_TENANT_ID}/discovery/v2.0/keys
            user-name-attribute: name
```

A continuación, configuramos Spring Security:

```java
@Configuration
@EnableWebSecurity
public class OAuth2SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/error", "/webjars/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .loginPage("/login")
                .defaultSuccessUrl("/dashboard", true)
                .failureUrl("/login?error=true")
                .userInfoEndpoint(userInfo -> userInfo
                    .userService(this.oauth2UserService())
                )
            )
            .logout(logout -> logout
                .logoutSuccessUrl("/")
                .invalidateHttpSession(true)
                .clearAuthentication(true)
            );
        
        return http.build();
    }
    
    @Bean
    public OAuth2UserService<OAuth2UserRequest, OAuth2User> oauth2UserService() {
        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
        
        return userRequest -> {
            OAuth2User oauth2User = delegate.loadUser(userRequest);
            
            // Extracción de provider y registro de usuarios nuevos
            String registrationId = userRequest.getClientRegistration().getRegistrationId();
            String userNameAttributeName = userRequest.getClientRegistration()
                    .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();
            
            // Creación del principal
            Map<String, Object> attributes = oauth2User.getAttributes();
            
            // Procesamiento específico por provider
            switch (registrationId) {
                case "google":
                    return processGoogleUser(userNameAttributeName, attributes, oauth2User);
                case "github":
                    return processGithubUser(userNameAttributeName, attributes, oauth2User);
                case "azure":
                    return processAzureUser(userNameAttributeName, attributes, oauth2User);
                default:
                    throw new OAuth2AuthenticationException("Proveedor no soportado: " + registrationId);
            }
        };
    }
    
    private OAuth2User processGoogleUser(String userNameAttributeName, Map<String, Object> attributes, OAuth2User oauth2User) {
        // Lógica específica para usuarios de Google
        String email = (String) attributes.get("email");
        // Buscar o crear usuario en base de datos...
        return oauth2User;
    }
    
    // Métodos similares para GitHub y Azure...
}
```

### Página de login con múltiples proveedores

Para ofrecer una experiencia de usuario agradable, creamos una página de login que muestre todos los proveedores disponibles:

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container">
        <div class="row justify-content-center mt-5">
            <div class="col-md-6">
                <div class="card shadow">
                    <div class="card-body p-5">
                        <h3 class="card-title text-center mb-4">Iniciar sesión</h3>
                        
                        <div th:if="${param.error}" class="alert alert-danger">
                            Error de autenticación. Por favor, inténtalo de nuevo.
                        </div>
                        
                        <div th:if="${param.logout}" class="alert alert-success">
                            Has cerrado sesión correctamente.
                        </div>
                        
                        <!-- Login con username/password -->
                        <form th:action="@{/login}" method="post" class="mb-4">
                            <!-- Campos de formulario... -->
                            <div class="d-grid mb-3">
                                <button type="submit" class="btn btn-primary">Entrar con usuario y contraseña</button>
                            </div>
                        </form>
                        
                        <div class="text-center mb-4">
                            <p>O inicia sesión con:</p>
                        </div>
                        
                        <!-- OAuth2 login buttons -->
                        <div class="d-grid gap-2">
                            <a href="/oauth2/authorization/google" class="btn btn-outline-danger">
                                <i class="bi bi-google me-2"></i> Google
                            </a>
                            <a href="/oauth2/authorization/github" class="btn btn-outline-dark">
                                <i class="bi bi-github me-2"></i> GitHub
                            </a>
                            <a href="/oauth2/authorization/azure" class="btn btn-outline-primary">
                                <i class="bi bi-microsoft me-2"></i> Microsoft
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
```

### Implementando un Resource Server con OAuth2

Además del login, podemos necesitar proteger nuestras APIs como un Resource Server. Para ello, usamos otra dependencia:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>
```

Y configuramos Spring Security para validar tokens JWT:

```java
@Configuration
@EnableWebSecurity
public class ResourceServerConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String issuerUri;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));
        
        return http.build();
    }
    
    @Bean
    public JwtDecoder jwtDecoder() {
        return JwtDecoders.fromIssuerLocation(issuerUri);
    }
    
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthoritiesClaimName("roles");
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");
        
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }
}
```

La configuración en `application.yml`:

```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://accounts.google.com
          jwk-set-uri: https://www.googleapis.com/oauth2/v3/certs
```

### Integración con Azure AD: mi experiencia real

Uno de los desafíos más complejos que enfrenté fue integrar una aplicación Spring Boot con Azure AD en un entorno corporativo. Comparto aquí los pasos específicos para esta integración, que suele ser bastante común en entornos empresariales:

1. **Registro de la aplicación en Azure Portal**:
   - Crear un nuevo registro de aplicación
   - Configurar URI de redirección: `http://localhost:8080/login/oauth2/code/azure`
   - Crear un secreto de cliente
   - Asignar los permisos API necesarios (OpenID, email, profile, etc.)

2. **Configuración en Spring Boot**:

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          azure:
            client-id: ${AZURE_CLIENT_ID}
            client-secret: ${AZURE_CLIENT_SECRET}
            client-name: Azure AD
            provider: azure-ad
            scope: openid,profile,email
            redirect-uri: "{baseUrl}/login/oauth2/code/{registrationId}"
        provider:
          azure-ad:
            issuer-uri: https://login.microsoftonline.com/${AZURE_TENANT_ID}/v2.0
            authorization-uri: https://login.microsoftonline.com/${AZURE_TENANT_ID}/oauth2/v2.0/authorize
            token-uri: https://login.microsoftonline.com/${AZURE_TENANT_ID}/oauth2/v2.0/token
            jwk-set-uri: https://login.microsoftonline.com/${AZURE_TENANT_ID}/discovery/v2.0/keys
            user-name-attribute: preferred_username
```

3. **Manejo de usuarios corporativos**:

```java
@Service
public class AzureAdUserService extends DefaultOAuth2UserService {
    
    private final UserRepository userRepository;
    
    public AzureAdUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        Map<String, Object> attributes = oauth2User.getAttributes();
        String email = (String) attributes.get("preferred_username");
        
        // Encontrar o crear usuario
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createNewUser(attributes));
        
        // Actualizar información si es necesario
        updateUserIfNeeded(user, attributes);
        
        // Crear principal con roles específicos de nuestra aplicación
        Collection<GrantedAuthority> authorities = new ArrayList<>(oauth2User.getAuthorities());
        user.getRoles().forEach(role -> 
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getName())));
        
        return new DefaultOAuth2User(authorities, attributes, "preferred_username");
    }
    
    private User createNewUser(Map<String, Object> attributes) {
        User user = new User();
        user.setEmail((String) attributes.get("preferred_username"));
        user.setName((String) attributes.get("name"));
        
        // Asignar roles por defecto
        Set<Role> roles = new HashSet<>();
        roles.add(getRoleByName("USER"));
        
        // Asignar roles adicionales según grupos de Azure AD
        if (attributes.containsKey("groups")) {
            List<String> groups = (List<String>) attributes.get("groups");
            if (groups.contains("admin-group-id")) {
                roles.add(getRoleByName("ADMIN"));
            }
        }
        
        user.setRoles(roles);
        return userRepository.save(user);
    }
    
    // Métodos auxiliares...
}
```

### Problemas comunes y soluciones en OAuth2

A lo largo de mi experiencia, he enfrentado varios desafíos al implementar OAuth2. Estos son los más frecuentes y sus soluciones:

#### 1. Redireccionamiento incorrecto

**Problema**: El proveedor OAuth2 no redirige de vuelta a nuestra aplicación.
**Solución**: Verificar que la URI de redirección configurada en el proveedor coincide exactamente con la de la aplicación, incluyendo protocolo, puerto y path.

#### 2. Tokens sin los claims necesarios

**Problema**: Los tokens JWT no contienen la información que necesitamos (roles, grupos, etc.).
**Solución**: Modificar el registro de la aplicación para solicitar los scopes y claims adicionales, y configurar correctamente el `JwtAuthenticationConverter`.

#### 3. Autenticación exitosa pero autorización fallida

**Problema**: El usuario se autentica pero no tiene los permisos correctos en la aplicación.
**Solución**: Implementar un `OAuth2UserService` personalizado que mapee los grupos/roles del proveedor a los de nuestra aplicación.

#### 4. Sesiones y CSRF en aplicaciones modernas

**Problema**: Configuración inconsistente de sesiones y CSRF cuando se combina OAuth2 con frontend moderno.
**Solución**: Para APIs puras, usar `SessionCreationPolicy.STATELESS` y deshabilitar CSRF. Para aplicaciones MVC, mantener la sesión y CSRF habilitados.

```java
@Configuration
@EnableWebSecurity
public class HybridSecurityConfig {

    @Bean
    public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/api/**")
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));
        
        return http.build();
    }
    
    @Bean
    public SecurityFilterChain webSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/**")
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/login", "/error").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(Customizer.withDefaults())
            .csrf(Customizer.withDefaults());
        
        return http.build();
    }
}
```

#### 5. Revocación de tokens

**Problema**: OAuth2 no proporciona un mecanismo estándar para revocar tokens JWT.
**Solución**: Implementar una lista negra de tokens con Redis o una base de datos en memoria:

```java
@Service
public class TokenBlacklistService {
    
    private final RedisTemplate<String, String> redisTemplate;
    private final JwtService jwtService;
    
    public TokenBlacklistService(RedisTemplate<String, String> redisTemplate, JwtService jwtService) {
        this.redisTemplate = redisTemplate;
        this.jwtService = jwtService;
    }
    
    public void blacklistToken(String token) {
        Date expiry = jwtService.extractExpiration(token);
        long ttl = expiry.getTime() - System.currentTimeMillis();
        
        if (ttl > 0) {
            String tokenId = jwtService.extractClaim(token, claims -> claims.getId());
            redisTemplate.opsForValue().set("blacklist:" + tokenId, "revoked", ttl, TimeUnit.MILLISECONDS);
        }
    }
    
    public boolean isBlacklisted(String token) {
        String tokenId = jwtService.extractClaim(token, claims -> claims.getId());
        return Boolean.TRUE.equals(redisTemplate.hasKey("blacklist:" + tokenId));
    }
}
```

### Consideraciones para entornos de microservicios

En arquitecturas de microservicios, OAuth2 y OpenID Connect brillan especialmente. Algunas consideraciones adicionales:

1. **Validación distribuida**: Cada microservicio debe poder validar tokens independientemente
2. **Propagación de tokens**: Usar encabezados como `Authorization: Bearer <token>` en llamadas entre servicios
3. **Gateway centralizado**: Validar tokens en el API Gateway y propagar información a los servicios internos

```java
@Component
public class AuthenticationFilter implements GatewayFilter {
    
    private final RouterValidator routerValidator;
    private final JwtUtil jwtUtil;
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        
        if (routerValidator.isSecured.test(request)) {
            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                return onError(exchange, "No authorization header", HttpStatus.UNAUTHORIZED);
            }
            
            String token = getAuthHeader(request);
            if (jwtUtil.isInvalid(token)) {
                return onError(exchange, "Invalid token", HttpStatus.UNAUTHORIZED);
            }
            
            populateRequestWithHeaders(exchange, token);
        }
        return chain.filter(exchange);
    }
    
    // Método para añadir claims como headers para los microservicios
    private void populateRequestWithHeaders(ServerWebExchange exchange, String token) {
        Claims claims = jwtUtil.getAllClaimsFromToken(token);
        exchange.getRequest().mutate()
            .header("X-auth-username", claims.getSubject())
            .header("X-auth-roles", String.valueOf(claims.get("roles")))
            .build();
    }
    
    // Otros métodos auxiliares...
}
```

[IMAGEN]
Título: Integración de OAuth2 con Spring Security
Descripción: Diagrama mostrando la integración de Spring Security con proveedores OAuth2 externos
Alt-text: Diagrama de flujo completo de autenticación OAuth2 con Spring Security y proveedores externos

## Mejores prácticas y escenarios avanzados: CORS, CSRF, autorización a nivel de método

Después de dominar los mecanismos básicos de autenticación, es el momento de profundizar en aspectos más avanzados de la seguridad en Spring Boot. Esta sección cubre prácticas que he ido refinando a lo largo de años de trabajo con aplicaciones en producción.

### Configuración de CORS: permitiendo peticiones desde dominios específicos

Cross-Origin Resource Sharing (CORS) es una necesidad habitual cuando desarrollamos APIs consumidas por frontends alojados en dominios diferentes. Sin embargo, una configuración incorrecta puede abrir la puerta a vulnerabilidades de seguridad.

Cuando desarrollé mi primera API REST consumida por una SPA alojada en otro dominio, me enfrenté a los famosos errores de CORS. Mi primera reacción fue permitir peticiones desde cualquier origen (`*`), lo que más tarde descubrí que era una mala práctica.

Aquí os muestro cómo configurar CORS de forma segura en Spring Security:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Configuración de seguridad existente...
            .cors(cors -> cors.configurationSource(corsConfigurationSource()));
        
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("https://mi-frontend.com", "https://app.mi-empresa.com"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // 1 hora de caché para respuestas OPTIONS
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

Para APIs públicas que necesitan ser consumidas desde múltiples orígenes, considerad un enfoque más flexible pero aún seguro:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    
    // Permitir orígenes dinámicos basados en una lista blanca
    List<String> allowedOrigins = getAllowedOriginsFromConfig();
    if (allowedOrigins.isEmpty()) {
        // Modo desarrollo - más permisivo
        configuration.setAllowedOriginPatterns(Collections.singletonList("*"));
    } else {
        // Modo producción - restringido a dominios específicos
        configuration.setAllowedOrigins(allowedOrigins);
    }
    
    // Resto de la configuración...
    return source;
}
```

### Protección contra CSRF: cuándo y cómo implementarla

Cross-Site Request Forgery (CSRF) es un tipo de ataque donde un sitio malicioso engaña al navegador del usuario para realizar peticiones a otro sitio donde el usuario está autenticado.

Un error que he visto frecuentemente (y cometido yo mismo) es deshabilitar CSRF para todas las APIs REST sin evaluar correctamente las implicaciones de seguridad. La regla general que sigo actualmente es:

- **Deshabilitar CSRF** para APIs consumidas por clientes que no utilizan cookies o autenticación basada en sesión (como APIs con JWT o OAuth2 resource server)
- **Mantener CSRF habilitado** para aplicaciones web tradicionales con autenticación basada en sesión

Para configurarlo correctamente:

```java
@Configuration
@EnableWebSecurity
public class CsrfConfig {

    @Bean
    public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/api/**")
            .csrf(csrf -> csrf.disable())  // Deshabilitado para API stateless
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );
        
        return http.build();
    }
    
    @Bean
    public SecurityFilterChain webSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/**")
            .csrf(csrf -> csrf  // Habilitado para aplicación web con sesión
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
            );
        
        return http.build();
    }
}
```

En aplicaciones modernas con frontend separado, podemos proporcionar el token CSRF a través de una cookie no HttpOnly para que JavaScript pueda leerla:

```java
CookieCsrfTokenRepository.withHttpOnlyFalse()
```

### Autorización a nivel de método: control granular con @PreAuthorize y @PostAuthorize

Una de las características más potentes de Spring Security, y sorprendentemente poco utilizada, es la autorización a nivel de método. Esta permite un control mucho más granular y desacoplado que la configuración a nivel de URL.

Para activarla, añadimos la anotación `@EnableMethodSecurity`:

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class MethodSecurityConfig {
    // Configuración...
}
```

Luego podemos usar anotaciones para restringir el acceso a métodos específicos:

```java
@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public List<Project> getAllProjects() {
        // Accesible por usuarios con rol USER
        return projectService.findAll();
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    @PostAuthorize("returnObject.ownerId == authentication.name")
    public Project getProjectById(@PathVariable Long id) {
        // Solo accesible si el usuario es el propietario del proyecto
        return projectService.findById(id);
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PROJECT_CREATOR')")
    public Project createProject(@RequestBody Project project) {
        // Solo accesible por administradores o creadores de proyectos
        return projectService.save(project);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or " +
                 "@projectSecurityService.isProjectOwner(#id, authentication.name)")
    public void deleteProject(@PathVariable Long id) {
        // Accesible por administradores o propietarios del proyecto
        projectService.deleteById(id);
    }
}
```

Observa el uso de SpEL (Spring Expression Language) en las expresiones de autorización:
- `hasRole('ROLE_X')` - Comprueba si el usuario tiene el rol X
- `authentication.name` - Accede al nombre de usuario actual
- `returnObject` - Accede al objeto devuelto por el método (`@PostAuthorize`)
- `#id` - Accede a parámetros del método por nombre

También podemos delegar en servicios personalizados para lógica de autorización más compleja:

```java
@Service
public class ProjectSecurityService {

    private final ProjectRepository projectRepository;
    
    @Autowired
    public ProjectSecurityService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }
    
    public boolean isProjectOwner(Long projectId, String username) {
        return projectRepository.findById(projectId)
            .map(project -> project.getOwnerId().equals(username))
            .orElse(false);
    }
}
```

### Filtros de seguridad personalizados: extendiendo Spring Security

Para requisitos especiales de seguridad, a veces necesitamos crear filtros personalizados. Trabajé en un proyecto donde necesitábamos validar un token específico de la industria (no JWT) y mapear sus claims a roles en nuestra aplicación.

El enfoque consiste en implementar `OncePerRequestFilter` y añadirlo a la cadena de filtros:

```java
@Component
public class CustomTokenFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    
    public CustomTokenFilter(TokenService tokenService) {
        this.tokenService = tokenService;
    }
    
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String tokenHeader = request.getHeader("X-Custom-Token");
        
        if (tokenHeader != null) {
            try {
                // Validar y procesar el token
                TokenInfo tokenInfo = tokenService.validateToken(tokenHeader);
                
                if (tokenInfo != null) {
                    // Crear autenticación
                    List<GrantedAuthority> authorities = tokenInfo.getRoles().stream()
                            .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                            .collect(Collectors.toList());
                    
                    UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(
                                    tokenInfo.getUsername(), 
                                    null, 
                                    authorities);
                    
                    // Establecer detalles
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // Actualizar el SecurityContext
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception e) {
                logger.error("Error al procesar token personalizado: {}", e.getMessage());
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
```

Y luego añadirlo a la configuración:

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        // Configuración existente...
        .addFilterBefore(customTokenFilter, UsernamePasswordAuthenticationFilter.class);
    
    return http.build();
}
```

### Previniendo ataques comunes: mejores prácticas

A lo largo de mi carrera, me he encontrado con varios vectores de ataque en aplicaciones Spring Boot. Aquí os comparto cómo prevenir los más comunes:

#### 1. Ataques de fijación de sesión

Este ataque consiste en engañar al usuario para que utilice un ID de sesión controlado por el atacante. Para prevenirlo:

```java
http.sessionManagement(session -> session
    .sessionFixation(fixation -> fixation.newSession())
);
```

Esto crea una nueva sesión cuando el usuario se autentica.

#### 2. Ataques de enumeración de usuarios

Los atacantes pueden descubrir nombres de usuario válidos observando diferentes mensajes de error. Para prevenirlo:

```java
@Component
public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler {
    
    @Override
    public void onAuthenticationFailure(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException exception
    ) throws IOException, ServletException {
        // Mismo mensaje para cualquier error de autenticación
        String errorMessage = "Credenciales inválidas";
        
        // Log detallado para depuración interna
        if (exception instanceof UsernameNotFoundException) {
            logger.debug("Usuario no encontrado: {}", exception.getMessage());
        } else if (exception instanceof BadCredentialsException) {
            logger.debug("Contraseña incorrecta para usuario");
        }
        
        // Redirigir a la página de login con mensaje genérico
        request.getSession().setAttribute("errorMessage", errorMessage);
        response.sendRedirect("/login?error");
    }
}
```

#### 3. Protección contra XSS (Cross-Site Scripting)

Aunque Spring escapa automáticamente la salida en plantillas como Thymeleaf, es importante añadir encabezados de seguridad:

```java
http.headers(headers -> headers
    .contentSecurityPolicy(csp -> csp
        .policyDirectives("default-src 'self'; script-src 'self' https://trusted-cdn.com")
    )
    .xssProtection(xss -> xss.disable())  // Los navegadores modernos usan CSP en lugar de X-XSS-Protection
    .frameOptions(frame -> frame.deny())
);
```

### Tabla comparativa: Mecanismos de autenticación en Spring Security

Después de usar diferentes mecanismos de autenticación, he elaborado esta tabla comparativa para ayudar a elegir el más adecuado para cada caso:

| Mecanismo | Casos de uso recomendados | Ventajas | Desventajas |
|-----------|---------------------------|----------|-------------|
| Autenticación básica | Entornos de desarrollo, APIs internas | Simple de implementar, soporte universal | No hay cierre de sesión, credenciales en cada petición |
| Formulario | Aplicaciones web tradicionales | Control total de la UI, gestión de sesiones | Requiere gestión del estado, problemas con CORS |
| JWT | SPAs, APIs públicas, microservicios | Sin estado, escalable, transferencia de claims | Imposibilidad de revocar tokens, posible crecimiento del payload |
| OAuth2 | Integración con proveedores externos, escenarios B2C | Delegación de autenticación, estándar ampliamente adoptado | Complejidad de implementación, dependencia de proveedores externos |

### Errores comunes a evitar

A lo largo de mi experiencia, estos son los errores más frecuentes que he cometido o visto cometer:

1. **Contraseñas en texto plano o con hash débil**
   - Nunca almacenes contraseñas sin hash
   - Usa BCrypt con un factor de trabajo de al menos 10 (12+ para aplicaciones críticas)

2. **Tokens JWT con tiempos de expiración muy largos**
   - Limita los tokens de acceso a 15-30 minutos
   - Implementa refresh tokens para renovación automática

3. **Exponer información sensible en mensajes de error**
   - Usa mensajes genéricos para el usuario
   - Registra detalles en logs para depuración interna

4. **Deshabilitar CSRF indiscriminadamente**
   - Evalúa si tu aplicación es vulnerable antes de deshabilitarlo
   - Mantén protección CSRF para aplicaciones con autenticación basada en cookies

5. **Configuración CORS demasiado permisiva**
   - Nunca uses `Access-Control-Allow-Origin: *` en producción
   - Especifica exactamente qué dominios, métodos y cabeceras están permitidos

## FAQ: Preguntas frecuentes sobre Spring Security

Durante mis charlas y sesiones de formación, estas son las preguntas que más frecuentemente me han planteado otros desarrolladores:

### ¿Por qué debería migrar de WebSecurityConfigurerAdapter a la nueva configuración basada en componentes?

Spring Security 5.7.0 deprecó `WebSecurityConfigurerAdapter` en favor de un enfoque funcional. Las principales ventajas son:
- Mayor modularidad y componentes reutilizables
- Mejor testabilidad al poder inyectar componentes individuales
- Mayor claridad al separar diferentes aspectos de la configuración

### ¿Cómo puedo implementar autenticación multifactor en Spring Security?

La autenticación multifactor requiere configuración personalizada:

```java
@Component
public class MfaAuthenticationProvider implements AuthenticationProvider {
    // Implementación que valida primero las credenciales principales
    // y luego solicita y verifica el segundo factor
}
```

Típicamente, el flujo implica:
1. Autenticación inicial con usuario/contraseña
2. Redirección a una página de verificación del segundo factor
3. Verificación del código y creación de la autenticación final

### ¿Cuál es la diferencia entre autorización a nivel de URL y a nivel de método?

- **URL**: Se configura en `SecurityFilterChain` y es ideal para restricciones basadas en patrones de URL
- **Método**: Usa anotaciones como `@PreAuthorize` y permite decisiones basadas en argumentos, contexto del usuario y resultados del método

Recomiendo combinar ambas: URL para restricciones generales y método para lógica más específica.

### ¿Cómo gestionar usuarios y roles en una aplicación empresarial?

Para aplicaciones empresariales, recomiendo:
1. Integración con directorio corporativo (LDAP, Azure AD) mediante OAuth2
2. Sistema de roles jerárquicos (`ADMIN > MANAGER > USER`)
3. Permisos granulares además de roles (`VIEW_REPORTS`, `EXPORT_DATA`)
4. Caché de permisos para mejorar rendimiento

```java
@Bean
public RoleHierarchy roleHierarchy() {
    RoleHierarchyImpl hierarchy = new RoleHierarchyImpl();
    hierarchy.setHierarchy(
        "ROLE_ADMIN > ROLE_MANAGER\n" +
        "ROLE_MANAGER > ROLE_USER"
    );
    return hierarchy;
}
```

### ¿Cómo testear adecuadamente la seguridad en Spring Boot?

El testing de seguridad debe abarcar múltiples niveles:

1. **Tests unitarios** para componentes de seguridad personalizados
2. **Tests de integración** para validar la configuración completa
3. **Tests de autorización** para verificar acceso a diferentes funcionalidades

Ejemplo de test de integración:

```java
@SpringBootTest
@AutoConfigureMockMvc
public class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;
    
    @Test
    @WithMockUser(roles = "USER")
    public void givenUserRole_whenGetProjectsList_thenSuccess() throws Exception {
        mockMvc.perform(get("/api/projects"))
            .andExpect(status().isOk());
    }
    
    @Test
    @WithAnonymousUser
    public void givenAnonymousUser_whenGetProjectsList_thenUnauthorized() throws Exception {
        mockMvc.perform(get("/api/projects"))
            .andExpect(status().isUnauthorized());
    }
}
```

## Conclusión

La seguridad en aplicaciones Spring Boot ha evolucionado significativamente en los últimos años, ofreciendo opciones flexibles y robustas para diferentes escenarios. Mi recomendación es comenzar con los mecanismos más simples y avanzar hacia soluciones más complejas según las necesidades específicas de cada proyecto.

Recuerda que la seguridad es un proceso continuo, no un estado final. Mantente al día con las actualizaciones de Spring Security y las mejores prácticas del sector, ya que las amenazas y técnicas evolucionan constantemente.

Si tuviera que resumir mi experiencia en tres consejos:

1. **Nunca implementes seguridad a medias**: dedica tiempo a entender los mecanismos que utilizas
2. **Aplica el principio de mínimo privilegio**: cada usuario debe tener solo los permisos estrictamente necesarios
3. **Automatiza pruebas de seguridad**: incluye tests de seguridad en tu pipeline de CI/CD

Espero que esta guía os ayude a implementar seguridad robusta en vuestras aplicaciones Spring Boot. Y recordad: una buena seguridad debe ser invisible para los usuarios legítimos, pero impenetrable para los atacantes.

## Recursos adicionales

Para profundizar en Spring Security, recomiendo estos recursos actualizados a 2025:

- [Documentación oficial de Spring Security](https://docs.spring.io/spring-security/reference/index.html)
- [Spring Security Architecture Explained](https://spring.io/guides/topicals/spring-security-architecture)
- [OAuth 2.0 Simplified](https://www.oauth.com/)
- [OWASP Top 10 para aplicaciones web](https://owasp.org/www-project-top-ten/)