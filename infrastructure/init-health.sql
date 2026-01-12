-- ============================================================================
-- HEALTH VAULT - Base de Datos Clínica (Físicamente Separada)
-- SEGURIDAD: Red Docker aislada + Encriptación en capa de aplicación
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Schema separado para aislamiento lógico adicional
CREATE SCHEMA IF NOT EXISTS health_vault;

-- ============================================================================
-- PACIENTES
-- ============================================================================
CREATE TABLE health_vault.patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    rut VARCHAR(255) NOT NULL,           -- ENCRIPTADO AES-256
    full_name VARCHAR(150) NOT NULL,
    birth_date DATE,
    phone VARCHAR(20),
    email VARCHAR(255),
    medical_history TEXT,                 -- ENCRIPTADO AES-256
    allergies VARCHAR(1000),              -- ENCRIPTADO AES-256
    chronic_medications VARCHAR(1000),    -- ENCRIPTADO AES-256
    insurance_code VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_patients_tenant ON health_vault.patients(tenant_id);

-- ============================================================================
-- RECETAS MÉDICAS
-- ============================================================================
CREATE TABLE health_vault.prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    patient_id UUID NOT NULL REFERENCES health_vault.patients(id),
    doctor_name VARCHAR(255),             -- ENCRIPTADO AES-256
    doctor_rut VARCHAR(255),              -- ENCRIPTADO AES-256
    doctor_sis_number VARCHAR(255),       -- ENCRIPTADO AES-256
    prescription_date DATE NOT NULL,
    expiry_date DATE,
    prescription_type VARCHAR(20) DEFAULT 'SIMPLE',
    diagnosis TEXT,                       -- ENCRIPTADO AES-256
    prescribed_items TEXT,
    image_path VARCHAR(500),
    image_hash VARCHAR(64),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    remaining_uses INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_prescriptions_tenant ON health_vault.prescriptions(tenant_id);
CREATE INDEX idx_prescriptions_patient ON health_vault.prescriptions(patient_id);
CREATE INDEX idx_prescriptions_date ON health_vault.prescriptions(prescription_date DESC);

-- ============================================================================
-- AUDIT LOG para cumplimiento normativo
-- ============================================================================
CREATE TABLE health_vault.audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    user_id UUID,
    action VARCHAR(50) NOT NULL, -- READ, CREATE, UPDATE, DELETE
    entity_type VARCHAR(50) NOT NULL, -- PATIENT, PRESCRIPTION
    entity_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_tenant ON health_vault.audit_log(tenant_id);
CREATE INDEX idx_audit_entity ON health_vault.audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_date ON health_vault.audit_log(created_at DESC);
