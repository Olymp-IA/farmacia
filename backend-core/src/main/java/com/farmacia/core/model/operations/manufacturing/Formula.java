package com.farmacia.core.model.operations.manufacturing;

import com.farmacia.core.model.core.Tenant;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Entidad Fórmula Magistral (Recetario).
 */
@Entity
@Table(name = "formulas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Formula {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(name = "base_quantity", precision = 10, scale = 2)
    private BigDecimal baseQuantity;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;
}
