package com.farmacia.core.model.people.crm;

import com.farmacia.core.model.core.Tenant;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/**
 * Entidad Programa de Fidelización.
 */
@Entity
@Table(name = "loyalty_programs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoyaltyProgram {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "points_per_currency", precision = 10, scale = 2)
    @Builder.Default
    private java.math.BigDecimal pointsPerCurrency = java.math.BigDecimal.ONE;

    @Column(name = "currency_per_point", precision = 10, scale = 2)
    @Builder.Default
    private java.math.BigDecimal currencyPerPoint = java.math.BigDecimal.TEN;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;
}
