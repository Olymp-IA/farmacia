package com.farmacia.core.model.finance.b2b;

import com.farmacia.core.model.sales.Sale;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Entidad Línea de Crédito para clientes institucionales.
 */
@Entity
@Table(name = "credit_lines")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreditLine {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private InstitutionalClient client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_id")
    private Sale sale;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "is_paid")
    @Builder.Default
    private Boolean isPaid = false;
}
