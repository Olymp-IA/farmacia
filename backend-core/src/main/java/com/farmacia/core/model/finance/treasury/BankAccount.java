package com.farmacia.core.model.finance.treasury;

import com.farmacia.core.model.core.Tenant;
import com.farmacia.core.security.AttributeEncryptor;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Entidad Cuenta Bancaria para el módulo de Tesorería.
 * DATO SENSIBLE: account_number está ENCRIPTADO.
 */
@Entity
@Table(name = "bank_accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @NotBlank(message = "El nombre del banco es obligatorio")
    @Column(name = "bank_name", nullable = false, length = 100)
    private String bankName;

    /**
     * Número de Cuenta Bancaria - ENCRIPTADO con AES-256.
     * Dato financiero altamente sensible.
     */
    @NotBlank(message = "El número de cuenta es obligatorio")
    @Column(name = "account_number", nullable = false, length = 255)
    @Convert(converter = AttributeEncryptor.class)
    private String accountNumber;

    @Column(length = 3)
    @Builder.Default
    private String currency = "CLP";

    @Column(name = "current_balance", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal currentBalance = BigDecimal.ZERO;
}
