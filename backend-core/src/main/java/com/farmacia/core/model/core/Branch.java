package com.farmacia.core.model.core;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "branches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Branch {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    private BranchType type;

    @Column(length = 255)
    private String address;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    public enum BranchType {
        STORE, WAREHOUSE, HQ
    }
}
