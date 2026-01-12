# Arquitectura de Seguridad

## Información del Documento

| Campo | Valor |
|-------|-------|
| Proyecto | Ultimate Pharma ERP |
| Versión | 1.0.0 |
| Fecha | 2026-01-12 |
| Clasificación | Documentación Interna de Seguridad |

## 1. Flujo de Autenticación

### 1.1 Descripción General

El sistema implementa autenticación sin estado basada en tokens JWT con firma RS256 (criptografía asimétrica).

### 1.2 Estructura del Token

```
Cabecera: {
  "alg": "RS256",
  "typ": "JWT"
}

Carga Útil: {
  "sub": "<id_usuario>",
  "tenantId": "<id_inquilino>",
  "role": "<rol_usuario>",
  "iat": <timestamp_emision>,
  "exp": <timestamp_expiracion>
}
```

### 1.3 Ciclo de Vida de Tokens

| Tipo de Token | Expiración | Propósito |
|---------------|------------|-----------|
| Token de Acceso | 24 horas | Autenticación de API |
| Token de Refresco | 7 días | Renovación sin re-login |

### 1.4 Proceso de Autenticación

1. El cliente envía credenciales a POST /api/auth/login
2. El servidor valida la contraseña contra el hash BCrypt (factor de costo: 12)
3. El servidor genera tokens de acceso y refresco
4. El cliente almacena los tokens de forma segura (SecureStore en móvil, memoria en web)
5. El cliente incluye el token de acceso en la cabecera Authorization para cada solicitud
6. JwtAuthenticationFilter valida el token en cada petición

### 1.5 Renovación de Token

1. El cliente detecta token expirado (respuesta 401)
2. El cliente envía el token de refresco a POST /api/auth/refresh
3. El servidor valida el token de refresco
4. El servidor emite un nuevo token de acceso
5. El token de refresco anterior se invalida (rotación)

## 2. Estrategia de Aislamiento de Datos

### 2.1 Arquitectura Multi-Inquilino

La plataforma implementa aislamiento estricto entre inquilinos para prevenir fugas de datos entre cadenas farmacéuticas.

### 2.2 Mecanismo de Aislamiento

| Capa | Implementación |
|------|----------------|
| Aplicación | TenantContext (ThreadLocal) |
| Repositorio | Filtrado automático por tenant_id |
| Base de Datos | Row Level Security (RLS) como protección secundaria |

### 2.3 Flujo de TenantContext

```
1. La petición llega a JwtAuthenticationFilter
2. El filtro extrae el claim tenant_id del JWT
3. El filtro almacena tenant_id en ThreadLocal via TenantContext.setTenantId()
4. Las consultas de repositorio incluyen automáticamente WHERE tenant_id = :tenantActual
5. Al completar la petición, TenantContext.clear() elimina el tenant del ThreadLocal
```

### 2.4 Código de Implementación

```java
// JwtAuthenticationFilter.java
UUID tenantId = extractTenantIdFromJwt(token);
TenantContext.setTenantId(tenantId);

// Consulta de repositorio (filtrado implícito)
@Query("SELECT p FROM Product p WHERE p.tenant.id = :tenantId")
List<Product> findByTenantId(@Param("tenantId") UUID tenantId);
```

### 2.5 Garantías de Seguridad

- Ningún acceso a datos de otros inquilinos es posible a nivel de aplicación
- La seguridad a nivel de fila (RLS) proporciona defensa en profundidad
- Los registros de auditoría rastrean todos los cambios de contexto de inquilino

## 3. Encriptación en Reposo

### 3.1 Campos Encriptados

| Entidad | Campo | Algoritmo | Propósito |
|---------|-------|-----------|-----------|
| Employee | rut | AES-256-GCM | Identificación personal |
| Employee | base_salary | AES-256-GCM | Confidencialidad salarial |
| Employee | commission_rate | AES-256-GCM | Información financiera |
| ComplianceLog | patient_rut | AES-256-GCM | Privacidad de datos de salud |
| ComplianceLog | doctor_name | AES-256-GCM | Información médica |
| BankAccount | account_number | AES-256-GCM | Datos financieros sensibles |
| Driver | license_plate | AES-256-GCM | Información de vehículo |
| ProductionOrder | patient_name | AES-256-GCM | Datos de salud para recetario |

### 3.2 Implementación de Encriptación

- Algoritmo: AES-256-GCM (Modo Galois/Contador)
- Vector de Inicialización (IV): 12 bytes, generado aleatoriamente por encriptación
- Tag de Autenticación: 128 bits
- Almacenamiento de Clave: Variable de entorno ENCRYPTION_KEY o Gestor de Secretos

### 3.3 Gestión de Claves

| Entorno | Fuente de Clave |
|---------|-----------------|
| Desarrollo | Variable de entorno |
| Producción | AWS Secrets Manager / HashiCorp Vault |

### 3.4 Conversor JPA

```java
@Converter
public class AttributeEncryptor implements AttributeConverter<String, String> {
    // Encripta al escribir en base de datos
    // Desencripta al leer desde base de datos
    // Usa AES-256-GCM con IV aleatorio prepuesto al texto cifrado
}
```

### 3.5 Formato de Almacenamiento en Base de Datos

Los valores encriptados se almacenan como cadenas codificadas en Base64:
```
[IV 12 bytes][Texto Cifrado][Tag Auth 16 bytes] -> Base64
```

## 4. Matriz de Roles y Permisos

### 4.1 Roles Definidos

| Rol | Código | Descripción |
|-----|--------|-------------|
| Administrador | ADMIN | Acceso completo al sistema |
| Farmacéutico | PHARMACIST | Catálogo, ventas, WMS lectura |
| Vendedor | SELLER | Ventas POS únicamente |
| Contador | ACCOUNTANT | Módulo finanzas, ventas lectura |
| Gerente RRHH | HR_MANAGER | Módulo RRHH, finanzas lectura |
| Bodeguero | WAREHOUSE_OP | Módulo WMS únicamente |
| Despachador | DISPATCHER | Módulo logística |
| Ejecutivo Comercial | SALES_EXEC | Módulo B2B |

### 4.2 Matriz de Acceso por Módulo

| Módulo | ADMIN | PHARMACIST | ACCOUNTANT | HR_MANAGER | WAREHOUSE_OP |
|--------|-------|------------|------------|------------|--------------|
| /api/core/** | Completo | Lectura | Lectura | Lectura | Lectura |
| /api/catalog/** | Completo | Completo | Lectura | Ninguno | Lectura |
| /api/wms/** | Completo | Lectura | Ninguno | Ninguno | Completo |
| /api/sales/** | Completo | Completo | Lectura | Ninguno | Ninguno |
| /api/finance/** | Completo | Ninguno | Completo | Lectura | Ninguno |
| /api/treasury/** | Completo | Ninguno | Completo | Ninguno | Ninguno |
| /api/hr/** | Completo | Ninguno | Ninguno | Completo | Ninguno |
| /api/manufacturing/** | Completo | Completo | Ninguno | Ninguno | Ninguno |
| /api/logistics/** | Completo | Ninguno | Ninguno | Ninguno | Ninguno |
| /api/b2b/** | Completo | Ninguno | Lectura | Ninguno | Ninguno |

### 4.3 Configuración de Seguridad de Endpoints

```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/hr/**").hasAnyRole("ADMIN", "HR_MANAGER")
    .requestMatchers("/api/finance/**").hasAnyRole("ADMIN", "ACCOUNTANT")
    .requestMatchers("/api/wms/**").hasAnyRole("ADMIN", "WAREHOUSE_OP", "PHARMACIST")
    .anyRequest().authenticated()
)
```

### 4.4 Seguridad a Nivel de Método

Además de la autorización basada en URL, las operaciones críticas usan seguridad a nivel de método:

```java
@PreAuthorize("hasRole('ADMIN') or hasRole('HR_MANAGER')")
public Payroll generatePayroll(UUID tenantId, LocalDate start, LocalDate end) { ... }
```

## 5. Seguridad de Clientes (Móvil y Web)

### 5.1 Almacenamiento Seguro (Móvil)

| Almacenamiento | Caso de Uso | Nivel de Seguridad |
|----------------|-------------|-------------------|
| expo-secure-store | Tokens JWT, credenciales | Encriptación respaldada por hardware |
| AsyncStorage | Estado de UI no sensible | Sin encriptación |
| Memoria (Zustand) | Datos de sesión | Volátil |

### 5.2 Pantalla de Privacidad

Las aplicaciones móviles implementan un mecanismo de ocultación cuando pasan a segundo plano:
- Previene exposición de datos médicos en el selector de apps
- Usa BlurView (iOS) o fondo sólido (Android)

### 5.3 Content Security Policy (Web)

```javascript
"Content-Security-Policy": [
  "default-src 'self'",
  "script-src 'self'",
  "connect-src 'self' https://api.farmacia.io",
  "frame-ancestors 'none'"
].join('; ')
```

## 6. Resumen de Controles de Seguridad

| Control | Implementación | Estado |
|---------|----------------|--------|
| Autenticación | JWT RS256 | Implementado |
| Autorización | RBAC + Seguridad de Método | Implementado |
| Aislamiento de Datos | TenantContext + RLS | Implementado |
| Encriptación de Campos | AES-256-GCM | Implementado |
| Hash de Contraseñas | BCrypt (costo 12) | Implementado |
| CORS | Lista blanca de orígenes | Implementado |
| Sesiones | Sin estado (stateless) | Implementado |
| Validación de Entrada | Jakarta Validation | Implementado |
| Pantalla de Privacidad | BlurView móvil | Implementado |
| CSP | Cabeceras estrictas | Implementado |

---

> powered by **OLYMP-IA.cl** | [https://olymp-ia.cl](https://olymp-ia.cl) | [GitHub](https://github.com/Olymp-IA)
