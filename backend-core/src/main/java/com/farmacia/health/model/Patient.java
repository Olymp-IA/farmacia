package com.farmacia.health.model;

import com.farmacia.core.security.AttributeEncryptor;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Entidad Paciente para el Health Vault.
 * 
 * SEGURIDAD CRÍTICA:
 * - Se almacena en base de datos físicamente separada (postgres-health)
 * - La red Docker es interna (no accesible públicamente)
 * - Campos sensibles ENCRIPTADOS con AES-256
 * 
 * Cumplimiento: Ley 19.628 (Protección de datos personales Chile)
 */
@Entity
@Table(name = "patients", schema = "health_vault")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    /**
     * RUT del Paciente - ENCRIPTADO con AES-256.
     * Dato de identificación personal protegido.
     */
    @NotBlank(message = "El RUT es obligatorio")
    @Pattern(regexp = "^[0-9]{1,2}\\.[0-9]{3}\\.[0-9]{3}-[0-9Kk]$", 
             message = "Formato RUT inválido (ej: 12.345.678-9)")
    @Column(nullable = false, length = 255)
    @Convert(converter = AttributeEncryptor.class)
    private String rut;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(length = 20)
    private String phone;

    @Column(length = 255)
    private String email;

    /**
     * Historial Médico - ENCRIPTADO con AES-256.
     * Información clínica altamente sensible.
     * Formato: JSON con condiciones, alergias, medicamentos crónicos.
     */
    @Column(name = "medical_history", columnDefinition = "TEXT")
    @Convert(converter = AttributeEncryptor.class)
    private String medicalHistory;

    /**
     * Alergias conocidas - ENCRIPTADO con AES-256.
     */
    @Column(length = 1000)
    @Convert(converter = AttributeEncryptor.class)
    private String allergies;

    /**
     * Medicamentos crónicos - ENCRIPTADO con AES-256.
     */
    @Column(name = "chronic_medications", length = 1000)
    @Convert(converter = AttributeEncryptor.class)
    private String chronicMedications;

    @Column(name = "insurance_code", length = 50)
    private String insuranceCode; // Código ISAPRE/FONASA

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
