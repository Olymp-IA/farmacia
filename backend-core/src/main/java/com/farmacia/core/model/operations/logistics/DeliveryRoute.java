package com.farmacia.core.model.operations.logistics;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

/**
 * Entidad Ruta de Entrega para el módulo de Logística.
 */
@Entity
@Table(name = "delivery_routes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryRoute {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @Column(name = "sale_id")
    private UUID saleId;

    @Column(length = 20)
    @Builder.Default
    private String status = "PENDING";

    @Column(name = "estimated_arrival")
    private Instant estimatedArrival;

    @Column(name = "actual_arrival")
    private Instant actualArrival;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}
