# Especificación de Requisitos de Software (SRS)

## Información del Documento

| Campo | Valor |
|-------|-------|
| Proyecto | Ultimate Pharma ERP |
| Versión | 1.0.0 |
| Fecha | 2026-01-12 |
| Estado | Aprobado |

## 1. Introducción

### 1.1 Propósito

Este documento describe los requisitos funcionales y no funcionales del sistema Ultimate Pharma ERP, una plataforma integral para la gestión de cadenas farmacéuticas. El sistema está diseñado para operar en un modelo multi-inquilino (multi-tenant), permitiendo que múltiples farmacias utilicen la misma infraestructura con aislamiento total de datos.

### 1.2 Alcance

El sistema abarca los siguientes módulos funcionales:
- Core: Gestión de inquilinos, sucursales y usuarios
- Catálogo e Inventario: Productos, lotes y stock
- WMS: Sistema de gestión de almacenes
- Ventas: Punto de venta, e-commerce y cumplimiento normativo
- ERP/Finanzas: Contabilidad y tesorería
- RRHH: Gestión de empleados y nómina
- CRM: Fidelización y marketing
- Manufactura: Recetario magistral
- B2B: Ventas institucionales
- Logística: Despacho a domicilio

### 1.3 Definiciones y Acrónimos

| Término | Definición |
|---------|------------|
| Tenant | Inquilino del sistema (una farmacia o cadena) |
| FEFO | First Expired, First Out (primero en vencer, primero en salir) |
| ISP | Instituto de Salud Pública de Chile |
| WMS | Warehouse Management System |
| POS | Point of Sale (punto de venta) |

## 2. Requisitos Funcionales

### 2.1 Módulo Core

#### RF-CORE-001: Gestión de Inquilinos
El sistema deberá permitir el registro de múltiples inquilinos (farmacias) con configuración independiente.

#### RF-CORE-002: Gestión de Sucursales
El sistema deberá soportar múltiples sucursales por inquilino, diferenciando entre tiendas, bodegas y casa matriz.

#### RF-CORE-003: Gestión de Usuarios
El sistema deberá permitir la creación de usuarios con roles diferenciados: Administrador, Farmacéutico, Vendedor, Bodeguero, Contador, Gerente RRHH.

### 2.2 Módulo Catálogo e Inventario

#### RF-CAT-001: Registro de Productos
El sistema deberá permitir el registro de productos farmacéuticos incluyendo principio activo, indicador de medicamento controlado y código SKU único por inquilino.

#### RF-CAT-002: Gestión de Lotes
El sistema deberá registrar lotes de productos con número de lote, fecha de vencimiento, precio de costo y precio de venta.

#### RF-CAT-003: Control FEFO
El sistema deberá ordenar automáticamente los lotes por fecha de vencimiento para aplicar la lógica FEFO en las ventas.

### 2.3 Módulo WMS (Almacenes)

#### RF-WMS-001: Zonificación de Bodegas
El sistema deberá permitir definir zonas dentro de cada bodega (Zona A, Zona B, Zona Fríos).

#### RF-WMS-002: Ubicaciones de Picking
El sistema deberá permitir definir ubicaciones específicas (bins) dentro de cada zona con código único (ej: A-01-02).

#### RF-WMS-003: Optimización de Rutas
El sistema deberá generar rutas de picking optimizadas ordenando los productos por zona y ubicación.

### 2.4 Módulo Ventas

#### RF-VEN-001: Venta en POS
El sistema deberá permitir la creación de ventas desde dispositivos tablet con búsqueda por nombre o principio activo.

#### RF-VEN-002: Venta E-commerce
El sistema deberá soportar ventas desde la tienda web con carrito de compras y múltiples métodos de pago.

#### RF-VEN-003: Cumplimiento Normativo
El sistema deberá registrar obligatoriamente los datos del paciente y médico para ventas de medicamentos controlados, cumpliendo normativa ISP.

#### RF-VEN-004: Bioequivalencia
El sistema deberá sugerir alternativas bioequivalentes (mismo principio activo) ordenadas por precio.

### 2.5 Módulo ERP/Finanzas

#### RF-FIN-001: Plan de Cuentas
El sistema deberá permitir definir un plan de cuentas contable personalizado por inquilino.

#### RF-FIN-002: Asientos Contables
El sistema deberá generar asientos contables de doble entrada automatizados desde las ventas.

#### RF-FIN-003: Tesorería
El sistema deberá permitir el registro de cuentas bancarias y sus movimientos para conciliación.

### 2.6 Módulo RRHH

#### RF-RRHH-001: Registro de Empleados
El sistema deberá permitir el registro de empleados vinculados a usuarios del sistema.

#### RF-RRHH-002: Cálculo de Nómina
El sistema deberá calcular la nómina mensual incluyendo sueldo base y comisiones por ventas.

#### RF-RRHH-003: Confidencialidad Salarial
El sistema deberá encriptar los datos de salario en la base de datos.

### 2.7 Módulo CRM

#### RF-CRM-001: Programa de Fidelización
El sistema deberá permitir definir programas de puntos con tasas de acumulación y canje configurables.

#### RF-CRM-002: Billetera de Cliente
El sistema deberá mantener el saldo de puntos de cada cliente y su nivel de membresía.

### 2.8 Módulo Manufactura

#### RF-MFG-001: Fórmulas Magistrales
El sistema deberá permitir definir fórmulas con ingredientes y cantidades para productos preparados.

#### RF-MFG-002: Órdenes de Producción
El sistema deberá gestionar el ciclo de producción: Cola, Preparación, Control de Calidad, Listo.

### 2.9 Módulo B2B

#### RF-B2B-001: Clientes Institucionales
El sistema deberá permitir registrar clínicas y empresas con límites de crédito.

#### RF-B2B-002: Ventas a Crédito
El sistema deberá permitir ventas con pago diferido y seguimiento de deuda.

### 2.10 Módulo Logística

#### RF-LOG-001: Gestión de Conductores
El sistema deberá registrar conductores con estado de disponibilidad.

#### RF-LOG-002: Rutas de Entrega
El sistema deberá asignar ventas a rutas de entrega con seguimiento de estado.

## 3. Requisitos No Funcionales

### 3.1 Seguridad

#### RNF-SEG-001: Autenticación
El sistema deberá implementar autenticación basada en tokens JWT con expiración de 24 horas.

#### RNF-SEG-002: Autorización
El sistema deberá implementar control de acceso basado en roles (RBAC) a nivel de endpoint y método.

#### RNF-SEG-003: Encriptación en Reposo
El sistema deberá encriptar datos sensibles (salarios, RUT de pacientes, números de cuenta) usando AES-256.

#### RNF-SEG-004: Aislamiento Multi-Tenant
El sistema deberá garantizar que ningún usuario pueda acceder a datos de otros inquilinos.

### 3.2 Rendimiento

#### RNF-REN-001: Tiempo de Respuesta
El sistema deberá responder a consultas simples en menos de 200ms.

#### RNF-REN-002: Concurrencia
El sistema deberá soportar al menos 100 usuarios concurrentes por inquilino.

### 3.3 Disponibilidad

#### RNF-DIS-001: Uptime
El sistema deberá mantener una disponibilidad mínima del 99.5%.

### 3.4 Mantenibilidad

#### RNF-MAN-001: Modularidad
El sistema deberá seguir una arquitectura modular que permita activar o desactivar módulos por inquilino.

---

> powered by **OLYMP-IA.cl** | [https://olymp-ia.cl](https://olymp-ia.cl) | [GitHub](https://github.com/Olymp-IA)
