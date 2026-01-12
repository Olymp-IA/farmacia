package com.farmacia.core.repository.sales;

import com.farmacia.core.model.sales.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface SaleRepository extends JpaRepository<Sale, UUID> {
    List<Sale> findByTenantId(UUID tenantId);
    List<Sale> findByBranchId(UUID branchId);
    List<Sale> findByUserId(UUID userId);
    List<Sale> findByTenantIdAndCreatedAtBetween(UUID tenantId, Instant start, Instant end);
    List<Sale> findByErpSyncStatus(String status);
}
