# Ultimate Pharma ERP

Sistema integral de gestión empresarial para cadenas farmacéuticas.

## Descripción

Ultimate Pharma ERP es una plataforma SaaS multi-inquilino que integra todos los procesos operativos de una farmacia moderna: punto de venta, gestión de inventario, contabilidad, recursos humanos, manufactura de fórmulas magistrales y logística de última milla.

## Módulos del Sistema

| Módulo | Descripción |
|--------|-------------|
| Core | Gestión de inquilinos, sucursales y usuarios |
| Catálogo | Productos, lotes y control FEFO |
| WMS | Gestión de almacenes y picking optimizado |
| Ventas | POS, e-commerce y cumplimiento ISP |
| Finanzas | Contabilidad de doble entrada y tesorería |
| RRHH | Empleados, nómina y comisiones |
| CRM | Fidelización y marketing |
| Manufactura | Recetario magistral |
| B2B | Ventas institucionales con crédito |
| Logística | Despacho y rutas de entrega |

## Arquitectura Técnica

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTES FRONTEND                        │
├──────────────────┬──────────────────┬───────────────────────┤
│   web-store      │     pos-app      │    customer-app       │
│   (Next.js 14)   │ (React Native)   │   (React Native)      │
└────────┬─────────┴────────┬─────────┴──────────┬────────────┘
         │                  │                    │
         └──────────────────┼────────────────────┘
                            │
         ┌──────────────────┴──────────────────┐
         │           API GATEWAY               │
         └──────────────────┬──────────────────┘
                            │
         ┌──────────────────┴──────────────────┐
         │         CAPA DE SEGURIDAD           │
         │   JWT Filter + TenantContext + RBAC │
         └──────────────────┬──────────────────┘
                            │
    ┌───────────────────────┴───────────────────────┐
    │                                               │
    ▼                                               ▼
┌─────────────────────┐               ┌─────────────────────┐
│   BACKEND CORE      │               │   SERVICIO IA       │
│   Java 17           │               │   Python 3.11       │
│   Spring Boot 3.2   │               │   FastAPI           │
└─────────┬───────────┘               └─────────┬───────────┘
          │                                     │
          └─────────────────┬───────────────────┘
                            │
                            ▼
               ┌─────────────────────────┐
               │     PostgreSQL 16       │
               │     + pgvector          │
               └─────────────────────────┘
```

## Requisitos Previos

- Java 17 o superior
- Python 3.11 o superior
- Node.js 18 o superior
- PostgreSQL 16 con extensión pgvector
- Docker y Docker Compose (opcional)

## Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-organizacion/farmacia-erp.git
cd farmacia-erp
```

### 2. Configurar la Base de Datos

```bash
# Iniciar PostgreSQL con Docker
cd infrastructure
docker-compose up -d postgres-db

# Esperar a que el contenedor esté listo
docker-compose logs -f postgres-db
```

La base de datos se inicializará automáticamente con el esquema definido en `infrastructure/init.sql`.

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Base de Datos
DATABASE_URL=jdbc:postgresql://localhost:5432/farmacia
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=tu_contraseña_segura

# Seguridad
JWT_SECRET=clave_secreta_de_al_menos_256_bits
ENCRYPTION_KEY=ClaveAES256De32CaracteresLong!!

# Servicios
AI_SERVICE_URL=http://localhost:8000
```

### 4. Iniciar el Backend Core (Java)

```bash
cd backend-core
./mvnw spring-boot:run
```

El servidor estará disponible en `http://localhost:8080`.

### 5. Iniciar el Servicio de IA (Python)

```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

El servicio estará disponible en `http://localhost:8000`.

### 6. Iniciar la Tienda Web (Next.js)

```bash
cd web-store
npm install
npm run dev
```

La tienda estará disponible en `http://localhost:3000`.

### 7. Iniciar las Aplicaciones Móviles

```bash
# App POS (Empleados)
cd pos-app
npm install
npx expo start

# App Cliente (Pacientes)
cd customer-app
npm install
npx expo start
```

## Estructura del Proyecto

```
farmacia/
├── backend-core/           # API REST Java Spring Boot
│   └── src/main/java/com/farmacia/core/
│       ├── model/          # Entidades JPA
│       ├── repository/     # Repositorios
│       ├── service/        # Lógica de negocio
│       └── security/       # Autenticación y autorización
├── ai-service/             # Microservicio Python FastAPI
│   ├── main.py
│   ├── schemas.py
│   └── database.py
├── web-store/              # E-commerce Next.js
│   └── src/
│       ├── app/            # Páginas (App Router)
│       ├── components/     # Componentes React
│       └── services/       # Clientes API
├── pos-app/                # App POS React Native
│   └── app/                # Pantallas (Expo Router)
│       ├── (pos)/          # Módulo Ventas
│       ├── (wms)/          # Módulo Bodega
│       └── (hr)/           # Módulo RRHH
├── customer-app/           # App Cliente React Native
│   └── app/                # Pantallas (Expo Router)
├── infrastructure/         # Configuración Docker
│   ├── docker-compose.yml
│   └── init.sql
└── technical_specs/        # Documentación Técnica
    ├── SRS.md              # Especificación de Requisitos
    ├── SDD.md              # Documento de Diseño
    └── SECURITY_ARCHITECTURE.md
```

## Documentación Técnica

| Documento | Descripción |
|-----------|-------------|
| [SRS.md](./technical_specs/SRS.md) | Especificación de Requisitos de Software |
| [SDD.md](./technical_specs/SDD.md) | Documento de Diseño de Software |
| [SECURITY_ARCHITECTURE.md](./technical_specs/SECURITY_ARCHITECTURE.md) | Manual de Arquitectura de Seguridad |
| [API_SPEC.md](./technical_specs/API_SPEC.md) | Especificación de API REST |

## Seguridad

El sistema implementa múltiples capas de seguridad:

- **Autenticación**: JWT con firma RS256
- **Autorización**: Control de acceso basado en roles (RBAC)
- **Aislamiento Multi-Tenant**: TenantContext con ThreadLocal
- **Encriptación en Reposo**: AES-256-GCM para datos sensibles
- **Hash de Contraseñas**: BCrypt con factor de costo 12

## Despliegue en Producción

```bash
# Construir imágenes Docker
docker-compose -f docker-compose.prod.yml build

# Desplegar
docker-compose -f docker-compose.prod.yml up -d
```

## Contribución

1. Crear una rama desde `develop`
2. Implementar cambios siguiendo los estándares del proyecto
3. Ejecutar pruebas: `./mvnw test`
4. Crear Pull Request hacia `develop`

## Licencia

Propietario. Todos los derechos reservados.

---

> powered by **OLYMP-IA.cl** | [https://olymp-ia.cl](https://olymp-ia.cl) | [GitHub](https://github.com/Olymp-IA)
