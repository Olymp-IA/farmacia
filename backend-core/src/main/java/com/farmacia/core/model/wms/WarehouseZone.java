package com.farmacia.core.model.wms;

import com.farmacia.core.model.core.Branch;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "warehouse_zones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseZone {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @Column(nullable = false, length = 50)
    private String name;
}
