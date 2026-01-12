package com.farmacia.health.model;

import com.farmacia.core.security.AttributeEncryptor;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Entidad Receta Médica para el Health Vault.
 * 
 * SEGURIDAD CRÍTICA:
 * - Se almacena en base de datos físicamente separada
 * - Campos del médico ENCRIPTADOS
 * - Imagen de receta almacenada encriptada
 * 
 * Cumplimiento: Normativa ISP para trazabilidad de controlados.
 */
@Entity
@Table(name = "prescriptions", schema = "health_vault")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    /**
     * Nombre del Médico Prescriptor - ENCRIPTADO con AES-256.
     */
    @Column(name = "doctor_name", length = 255)
    @Convert(converter = AttributeEncryptor.class)
    private String doctorName;

    /**
     * RUT del Médico - ENCRIPTADO con AES-256.
     */
    @Column(name = "doctor_rut", length = 255)
    @Convert(converter = AttributeEncryptor.class)
    private String doctorRut;

    /**
     * Registro SIS del Médico - ENCRIPTADO.
     */
    @Column(name = "doctor_sis_number", length = 255)
    @Convert(converter = AttributeEncryptor.class)
    private String doctorSisNumber;

    @NotNull(message = "La fecha de receta es obligatoria")
    @Column(name = "prescription_date", nullable = false)
    private LocalDate prescriptionDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    /**
     * Tipo de receta.
     * SIMPLE, RETENIDA, CHEQUE (controlados)
     */
    @Column(name = "prescription_type", length = 20)
    @Builder.Default
    private String prescriptionType = "SIMPLE";

    /**
     * Diagnóstico - ENCRIPTADO con AES-256.
     * Información clínica sensible.
     */
    @Column(columnDefinition = "TEXT")
    @Convert(converter = AttributeEncryptor.class)
    private String diagnosis;

    /**
     * Productos prescritos (JSON).
     * Formato: [{"productId": "...", "quantity": 2, "instructions": "..."}]
     */
    @Column(name = "prescribed_items", columnDefinition = "TEXT")
    private String prescribedItems;

    /**
     * Ruta a imagen de receta escaneada.
     * La imagen se almacena encriptada en el filesystem.
     */
    @Column(name = "image_path", length = 500)
    private String imagePath;

    /**
     * Hash de la imagen para verificar integridad.
     */
    @Column(name = "image_hash", length = 64)
    private String imageHash;

    /**
     * Estado de la receta.
     */
    @Column(length = 20)
    @Builder.Default
    private String status = "ACTIVE";

    /**
     * Cantidad de usos restantes (para recetas retenidas).
     */
    @Column(name = "remaining_uses")
    @Builder.Default
    private Integer remainingUses = 1;

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

    /**
     * Verifica si la receta está vigente.
     */
    public boolean isValid() {
        if (!"ACTIVE".equals(status)) return false;
        if (expiryDate != null && LocalDate.now().isAfter(expiryDate)) return false;
        if ("RETENIDA".equals(prescriptionType) && remainingUses <= 0) return false;
        return true;
    }

    /**
     * Consume un uso de la receta (para retenidas).
     */
    public void consumeUse() {
        if (remainingUses != null && remainingUses > 0) {
            remainingUses--;
            if (remainingUses <= 0) {
                status = "EXHAUSTED";
            }
        }
    }
}
