package com.farmacia.core.model.wms;

import com.farmacia.core.model.catalog.Batch;
import com.farmacia.core.model.core.Branch;
import com.farmacia.core.model.core.Tenant;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "inventory_stock", uniqueConstraints = {
    @UniqueConstraint(name = "uq_stock_location", columnNames = {"batch_id", "bin_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryStock {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "batch_id", nullable = false)
    private Batch batch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bin_id")
    private BinLocation bin;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 0;

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();
}
