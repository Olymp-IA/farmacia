package com.farmacia.core.model.finance.b2b;

import com.farmacia.core.model.core.Tenant;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Entidad Cliente Institucional para el módulo B2B.
 * Clínicas, empresas y otros clientes con crédito.
 */
@Entity
@Table(name = "institutional_clients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InstitutionalClient {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @Column(name = "business_name", length = 255)
    private String businessName;

    @Column(name = "tax_id", length = 50)
    private String taxId;

    @Column(name = "credit_limit", precision = 15, scale = 2)
    private BigDecimal creditLimit;

    @Column(name = "current_debt", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal currentDebt = BigDecimal.ZERO;

    @Column(name = "price_list_id")
    private UUID priceListId;
}
