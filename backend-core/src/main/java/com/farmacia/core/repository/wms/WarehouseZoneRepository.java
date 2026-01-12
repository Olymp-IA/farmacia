package com.farmacia.core.repository.wms;

import com.farmacia.core.model.wms.WarehouseZone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WarehouseZoneRepository extends JpaRepository<WarehouseZone, UUID> {
    List<WarehouseZone> findByBranchId(UUID branchId);
}
