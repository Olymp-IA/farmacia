package com.farmacia.core.model.wms;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "bin_locations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BinLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zone_id", nullable = false)
    private WarehouseZone zone;

    @Column(nullable = false, length = 50)
    private String code;
}
