package com.farmacia.core.model.operations.logistics;

import com.farmacia.core.model.core.Tenant;
import com.farmacia.core.model.core.User;
import com.farmacia.core.security.AttributeEncryptor;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/**
 * Entidad Conductor para el módulo de Logística.
 * DATO SENSIBLE: license_plate está ENCRIPTADO.
 */
@Entity
@Table(name = "drivers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    /**
     * Patente del Vehículo - ENCRIPTADO con AES-256.
     */
    @Column(name = "license_plate", length = 255)
    @Convert(converter = AttributeEncryptor.class)
    private String licensePlate;

    @Column(length = 20)
    @Builder.Default
    private String status = "AVAILABLE";
}
