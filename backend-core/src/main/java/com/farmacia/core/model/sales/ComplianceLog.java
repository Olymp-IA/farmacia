package com.farmacia.core.model.sales;

import com.farmacia.core.model.core.Tenant;
import com.farmacia.core.security.AttributeEncryptor;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Registro de Cumplimiento para Medicamentos Controlados.
 * Cumple normativa ISP para trazabilidad de estupefacientes.
 * DATOS SENSIBLES: patient_rut y doctor_name están ENCRIPTADOS.
 */
@Entity
@Table(name = "compliance_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplianceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_id", nullable = false)
    private Sale sale;

    @NotBlank(message = "El tipo de droga es obligatorio")
    @Column(name = "drug_type", nullable = false, length = 50)
    private String drugType;

    /**
     * RUT del Paciente - ENCRIPTADO con AES-256.
     * Este dato es sensible por normativa de privacidad de datos de salud.
     */
    @Column(name = "patient_rut", length = 255)
    @Convert(converter = AttributeEncryptor.class)
    private String patientRut;

    /**
     * Nombre del Médico Prescriptor - ENCRIPTADO con AES-256.
     */
    @Column(name = "doctor_name", length = 255)
    @Convert(converter = AttributeEncryptor.class)
    private String doctorName;

    @Column(name = "prescription_date")
    private LocalDate prescriptionDate;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}
