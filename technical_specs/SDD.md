# Documento de Diseño de Software (SDD)

## Información del Documento

| Campo | Valor |
|-------|-------|
| Proyecto | Ultimate Pharma ERP |
| Versión | 1.0.0 |
| Fecha | 2026-01-12 |
| Estado | Aprobado |

## 1. Introducción

### 1.1 Propósito

Este documento describe la arquitectura técnica y el diseño del sistema Ultimate Pharma ERP. Está dirigido a desarrolladores, arquitectos y equipos de operaciones que necesitan comprender la estructura interna del sistema.

### 1.2 Arquitectura General

El sistema implementa una **Arquitectura Híbrida de Microservicios** con los siguientes componentes:

| Componente | Tecnología | Responsabilidad |
|------------|------------|-----------------|
| Backend Core | Java 17, Spring Boot 3.2 | Lógica de negocio, API REST, persistencia |
| Servicio IA | Python 3.11, FastAPI | Búsqueda semántica, optimización de rutas |
| App POS | React Native (Expo) | Punto de venta para tablet |
| App Cliente | React Native (Expo) | Aplicación móvil para pacientes |
| Tienda Web | Next.js 14 | E-commerce público |
| Base de Datos | PostgreSQL 16 + pgvector | Almacenamiento relacional y vectorial |

## 2. Arquitectura del Backend

### 2.1 Estructura de Paquetes

El backend sigue una organización modular por dominio:

```
com.farmacia.core
├── model/
│   ├── core/           # Tenant, Branch, User
│   ├── catalog/        # Product, Batch
│   ├── sales/          # Sale, SaleItem, ComplianceLog
│   ├── finance/        # JournalEntry, AccountingAccount
│   │   ├── treasury/   # BankAccount, BankTransaction
│   │   └── b2b/        # InstitutionalClient, CreditLine
│   ├── hr/             # Employee, Payroll
│   ├── operations/
│   │   ├── wms/        # WarehouseZone, BinLocation, InventoryStock
│   │   ├── logistics/  # Driver, DeliveryRoute
│   │   └── manufacturing/ # Formula, ProductionOrder
│   └── people/
│       └── crm/        # LoyaltyProgram, CustomerWallet
├── repository/
├── service/
├── controller/
└── security/           # SecurityConfig, JwtFilter, AttributeEncryptor
```

### 2.2 Patrón de Capas

El sistema implementa el patrón de capas clásico:

1. **Capa de Presentación (Controllers)**: Expone endpoints REST
2. **Capa de Servicios (Services)**: Lógica de negocio y orquestación
3. **Capa de Acceso a Datos (Repositories)**: Interacción con la base de datos
4. **Capa de Seguridad (Security)**: Autenticación y autorización transversal

### 2.3 Multi-Tenancy

El aislamiento de datos entre inquilinos se implementa mediante:

1. **TenantContext**: ThreadLocal que almacena el tenant_id actual
2. **Filtro JWT**: Extrae el tenant_id del token y lo inyecta en el contexto
3. **Consultas Filtradas**: Todos los repositorios incluyen filtro por tenant_id

```java
// Flujo de aislamiento
JwtAuthenticationFilter -> TenantContext.setTenantId(uuid)
Repository -> findByTenantId(TenantContext.getTenantId())
Response -> TenantContext.clear()
```

## 3. Diccionario de Datos

### 3.1 Módulo Core

#### Tabla: tenants
| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | UUID | PK | Identificador único |
| business_name | VARCHAR(255) | NOT NULL | Razón social |
| tax_id | VARCHAR(50) | UNIQUE, NOT NULL | RUT de la empresa |
| config_json | JSONB | | Configuración específica |
| is_active | BOOLEAN | DEFAULT TRUE | Estado activo |

#### Tabla: users
| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | UUID | PK | Identificador único |
| tenant_id | UUID | FK -> tenants | Inquilino |
| email | VARCHAR(255) | NOT NULL | Correo para login |
| password_hash | VARCHAR(255) | NOT NULL | Contraseña (BCrypt) |
| full_name | VARCHAR(100) | NOT NULL | Nombre completo |
| role | VARCHAR(50) | NOT NULL | Rol del sistema |

### 3.2 Módulo Inventario

#### Tabla: products
| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | UUID | PK | Identificador único |
| tenant_id | UUID | FK | Inquilino propietario |
| sku | VARCHAR(100) | UNIQUE por tenant | Código de producto |
| active_principle | VARCHAR(255) | NOT NULL | Principio activo (para IA) |
| is_controlled | BOOLEAN | DEFAULT FALSE | Requiere registro ISP |

### 3.3 Módulo RRHH (Datos Encriptados)

#### Tabla: employees
| Columna | Tipo | Encriptado | Descripción |
|---------|------|------------|-------------|
| id | UUID | No | Identificador |
| rut | VARCHAR(255) | **Sí (AES-256)** | RUT del empleado |
| base_salary | VARCHAR(255) | **Sí (AES-256)** | Sueldo base |
| commission_rate | VARCHAR(255) | **Sí (AES-256)** | Tasa de comisión |

### 3.4 Módulo Tesorería (Datos Encriptados)

#### Tabla: bank_accounts
| Columna | Tipo | Encriptado | Descripción |
|---------|------|------------|-------------|
| account_number | VARCHAR(255) | **Sí (AES-256)** | Número de cuenta |

## 4. Interfaces de Servicio

### 4.1 PayrollService

Gestiona el cálculo y generación de nóminas.

```java
public interface PayrollService {
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_MANAGER')")
    List<Payroll> generatePayroll(UUID tenantId, LocalDate start, LocalDate end);
    
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_MANAGER')")
    BigDecimal calculateCommission(UUID employeeId, LocalDate start, LocalDate end);
}
```

### 4.2 OmniChannelSalesService

Unifica ventas de POS, E-commerce y B2B.

```java
public interface OmniChannelSalesService {
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'SELLER')")
    Sale createPOSSale(CreateSaleCommand command);
    
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_EXEC')")
    Sale createB2BSale(CreateB2BSaleCommand command);
}
```

### 4.3 InventoryService

Gestiona stock multi-bodega con lógica FEFO.

```java
public interface InventoryService {
    List<StockAllocationDto> allocateStockFEFO(UUID branchId, UUID productId, Integer qty);
    void transferStock(UUID sourceBranch, UUID targetBranch, UUID batchId, Integer qty);
}
```

## 5. Servicio de IA

### 5.1 Endpoints

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| /search | POST | Búsqueda semántica de productos |
| /bioequivalents/{id} | GET | Alternativas bioequivalentes |
| /wms/optimize-route | POST | Optimización de ruta de picking |

### 5.2 Búsqueda Vectorial

El sistema utiliza pgvector para búsqueda semántica:

```sql
SELECT p.*, 1 - (pe.vector <=> query_vector) as similarity
FROM products p
JOIN product_embeddings pe ON p.id = pe.product_id
ORDER BY similarity DESC
LIMIT 10;
```

## 6. Consideraciones de Despliegue

### 6.1 Servicios Docker

```yaml
services:
  postgres-db:     # PostgreSQL 16 + pgvector
  backend-core:    # Spring Boot
  ai-service:      # FastAPI
  web-store:       # Next.js
```

### 6.2 Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| DATABASE_URL | Conexión PostgreSQL |
| JWT_SECRET | Clave para tokens |
| ENCRYPTION_KEY | Clave AES-256 (32 caracteres) |

---

> powered by **OLYMP-IA.cl** | [https://olymp-ia.cl](https://olymp-ia.cl) | [GitHub](https://github.com/Olymp-IA)
