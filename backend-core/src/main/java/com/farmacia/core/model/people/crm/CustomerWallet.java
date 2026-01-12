package com.farmacia.core.model.people.crm;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/**
 * Entidad Billetera de Cliente para puntos de fidelización.
 */
@Entity
@Table(name = "customer_wallets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerWallet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "customer_id")
    private UUID customerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loyalty_program_id")
    private LoyaltyProgram loyaltyProgram;

    @Column(name = "current_points")
    @Builder.Default
    private Integer currentPoints = 0;

    @Column(name = "tier_level", length = 50)
    @Builder.Default
    private String tierLevel = "STANDARD";
}
