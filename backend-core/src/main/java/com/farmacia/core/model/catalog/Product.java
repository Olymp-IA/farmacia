package com.farmacia.core.model.catalog;

import com.farmacia.core.model.core.Tenant;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "products", uniqueConstraints = {
    @UniqueConstraint(name = "uq_product_sku_tenant", columnNames = {"tenant_id", "sku"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @Column(nullable = false, length = 100)
    private String sku;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "active_principle", nullable = false)
    private String activePrinciple;

    @Column(name = "is_controlled")
    @Builder.Default
    private Boolean isControlled = false;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();
}
