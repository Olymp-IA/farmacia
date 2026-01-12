-- ============================================================================
-- ENTERPRISE PHARMA SUITE - INICIALIZACIÓN DE BASE DE DATOS
-- Módulos: Core, ERP, WMS, RRHH, IA, CRM, Manufactura
-- Estándar: PostgreSQL 16+
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================================================
-- 1. CORE Y MULTI-TENANCY (Inquilinos)
-- ============================================================================

CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(50) NOT NULL UNIQUE, -- RUT/NIT Empresa
    config_json JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(150) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('STORE', 'WAREHOUSE', 'HQ')), -- TIENDA, BODEGA, MATRIZ
    address VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT uq_user_email_tenant UNIQUE (tenant_id, email)
);

-- ============================================================================
-- 2. CATÁLOGO E INVENTARIO (BASE WMS)
-- ============================================================================

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    active_principle VARCHAR(255) NOT NULL,
    is_controlled BOOLEAN DEFAULT FALSE, -- Controlados (Estupefacientes/Psicotrópicos)
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT uq_product_sku_tenant UNIQUE (tenant_id, sku)
);

CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    product_id UUID NOT NULL REFERENCES products(id),
    batch_number VARCHAR(100) NOT NULL,
    expiry_date DATE NOT NULL,
    cost_price DECIMAL(15, 2) NOT NULL,
    sale_price DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Índice FEFO: Primero en Vencer, Primero en Salir
CREATE INDEX idx_batches_fefo ON batches (product_id, expiry_date ASC);

-- WMS: UBICACIONES Y STOCK DISTRIBUIDO
CREATE TABLE warehouse_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    name VARCHAR(50) NOT NULL
);

CREATE TABLE bin_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID NOT NULL REFERENCES warehouse_zones(id),
    code VARCHAR(50) NOT NULL -- Ej: "A-01-02"
);

CREATE TABLE inventory_stock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    branch_id UUID NOT NULL REFERENCES branches(id),
    batch_id UUID NOT NULL REFERENCES batches(id),
    bin_id UUID REFERENCES bin_locations(id),
    quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT uq_stock_location UNIQUE (batch_id, bin_id)
);

-- ============================================================================
-- 3. VENTAS, CLIENTES Y CUMPLIMIENTO
-- ============================================================================

-- Tabla de Clientes (Faltaba en la versión anterior)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    rut VARCHAR(20),
    full_name VARCHAR(150),
    email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    branch_id UUID REFERENCES branches(id),
    user_id UUID REFERENCES users(id),
    customer_id UUID REFERENCES customers(id), -- Opcional (Venta anónima)
    status VARCHAR(20) DEFAULT 'COMPLETED',
    total_amount DECIMAL(15, 2) NOT NULL,
    erp_sync_status VARCHAR(20) DEFAULT 'PENDING', -- Estado de sincronización ERP
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID NOT NULL REFERENCES sales(id),
    batch_id UUID NOT NULL REFERENCES batches(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    subtotal DECIMAL(15, 2) NOT NULL
);

CREATE TABLE compliance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    sale_id UUID NOT NULL REFERENCES sales(id),
    drug_type VARCHAR(50) NOT NULL,
    patient_rut VARCHAR(20), -- Dato sensible (Será encriptado por Java)
    doctor_name VARCHAR(150),
    prescription_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 4. ERP Y FINANZAS (CONTABILIDAD)
-- ============================================================================

CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    tax_id VARCHAR(50) NOT NULL,
    business_name VARCHAR(255) NOT NULL
);

CREATE TABLE accounting_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    code VARCHAR(50) NOT NULL, -- Código contable
    name VARCHAR(150) NOT NULL,
    type VARCHAR(20) NOT NULL
);

CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    transaction_date DATE NOT NULL,
    description VARCHAR(255) NOT NULL,
    reference_id UUID, -- Referencia a Venta o Compra
    status VARCHAR(20) DEFAULT 'POSTED'
);

CREATE TABLE journal_entry_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_id UUID NOT NULL REFERENCES journal_entries(id),
    account_id UUID NOT NULL REFERENCES accounting_accounts(id),
    debit DECIMAL(15, 2) DEFAULT 0,
    credit DECIMAL(15, 2) DEFAULT 0
);

-- ============================================================================
-- 5. RRHH Y NÓMINA
-- ============================================================================

CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    user_id UUID REFERENCES users(id),
    rut VARCHAR(20) NOT NULL,
    base_salary DECIMAL(15, 2) NOT NULL, -- Dato sensible (Será encriptado)
    commission_rate DECIMAL(5, 4) DEFAULT 0.0
);

CREATE TABLE payrolls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    employee_id UUID NOT NULL REFERENCES employees(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_liquid DECIMAL(15, 2) NOT NULL,
    commission_amount DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 6. IA Y VECTORES
-- ============================================================================

CREATE TABLE product_embeddings (
    product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    vector vector(768),
    model_version VARCHAR(50) DEFAULT 'v1'
);

CREATE INDEX idx_embedding_vector ON product_embeddings USING ivfflat (vector vector_cosine_ops) WITH (lists = 100);

-- ============================================================================
-- Módulos Fase 2: CRM, Tesorería, Manufactura, B2B, Logística
-- ============================================================================

-- ----------------------------------------------------------------------------
-- MÓDULO A: CRM Y FIDELIZACIÓN (Club de Beneficios)
-- ----------------------------------------------------------------------------
CREATE TABLE loyalty_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(100) NOT NULL, 
    points_per_currency DECIMAL(10, 2) DEFAULT 1.0,
    currency_per_point DECIMAL(10, 2) DEFAULT 10.0,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE customer_wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id),
    loyalty_program_id UUID REFERENCES loyalty_programs(id),
    current_points INTEGER DEFAULT 0,
    tier_level VARCHAR(50) DEFAULT 'STANDARD' -- Niveles: STANDARD, GOLD, PLATINUM
);

CREATE TABLE marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(150),
    target_segment VARCHAR(50), -- Ej: 'PACIENTES_CRONICOS'
    start_date DATE,
    end_date DATE,
    discount_rule JSONB -- Reglas complejas de descuento
);

-- ----------------------------------------------------------------------------
-- MÓDULO B: TESORERÍA (Bancos)
-- ----------------------------------------------------------------------------
CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    bank_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(50) NOT NULL, -- Dato sensible
    currency VARCHAR(3) DEFAULT 'CLP',
    current_balance DECIMAL(15, 2) DEFAULT 0
);

CREATE TABLE bank_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES bank_accounts(id),
    transaction_date DATE NOT NULL,
    amount DECIMAL(15, 2) NOT NULL, -- Positivo o Negativo
    description VARCHAR(255),
    reference_number VARCHAR(100), -- Nro Cartola
    is_reconciled BOOLEAN DEFAULT FALSE, -- Conciliado con Contabilidad
    journal_entry_id UUID REFERENCES journal_entries(id)
);

-- ----------------------------------------------------------------------------
-- MÓDULO C: MANUFACTURA (Recetario Magistral)
-- ----------------------------------------------------------------------------
CREATE TABLE formulas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name VARCHAR(200) NOT NULL, -- Ej: "Omeprazol Suspensión Pediátrica"
    base_quantity DECIMAL(10, 2), -- Ej: 100 ml
    instructions TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE formula_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    formula_id UUID NOT NULL REFERENCES formulas(id),
    product_id UUID NOT NULL REFERENCES products(id), -- Materia Prima (Core)
    quantity_required DECIMAL(10, 4) NOT NULL
);

CREATE TABLE production_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    formula_id UUID REFERENCES formulas(id),
    patient_name VARCHAR(150), -- Recetario es personalizado
    status VARCHAR(20) DEFAULT 'QUEUED' CHECK (status IN ('QUEUED', 'MIXING', 'QC_CHECK', 'READY')),
    produced_batch_number VARCHAR(50), -- Genera un nuevo lote
    created_at TIMESTAMP DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- MÓDULO D: B2B E INSTITUCIONAL (Clínicas/Empresas)
-- ----------------------------------------------------------------------------
CREATE TABLE institutional_clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    business_name VARCHAR(255),
    tax_id VARCHAR(50),
    credit_limit DECIMAL(15, 2),
    current_debt DECIMAL(15, 2) DEFAULT 0,
    price_list_id UUID -- Link a listas de precio especiales
);

CREATE TABLE credit_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES institutional_clients(id),
    sale_id UUID REFERENCES sales(id),
    due_date DATE NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE
);

-- ----------------------------------------------------------------------------
-- MÓDULO E: LOGÍSTICA Y FLOTA (Última Milla)
-- ----------------------------------------------------------------------------
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    user_id UUID REFERENCES users(id), -- App de Chofer
    license_plate VARCHAR(20),
    status VARCHAR(20) DEFAULT 'AVAILABLE'
);

CREATE TABLE delivery_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v