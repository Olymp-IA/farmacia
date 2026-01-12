package com.farmacia.core.model.operations.manufacturing;

import com.farmacia.core.model.core.Tenant;
import com.farmacia.core.security.AttributeEncryptor;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

/**
 * Entidad Orden de Producción para Recetario Magistral.
 * DATO SENSIBLE: patient_name está ENCRIPTADO (dato de salud).
 */
@Entity
@Table(name = "production_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductionOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "formula_id")
    private Formula formula;

    /**
     * Nombre del Paciente - ENCRIPTADO con AES-256.
     * Dato sensible de salud para recetario magistral personalizado.
     */
    @Column(name = "patient_name", length = 255)
    @Convert(converter = AttributeEncryptor.class)
    private String patientName;

    @Column(length = 20)
    @Builder.Default
    private String status = "QUEUED";

    @Column(name = "produced_batch_number", length = 50)
    private String producedBatchNumber;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}
