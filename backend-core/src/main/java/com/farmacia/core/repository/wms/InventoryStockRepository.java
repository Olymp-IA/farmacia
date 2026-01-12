package com.farmacia.core.repository.wms;

import com.farmacia.core.model.wms.InventoryStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InventoryStockRepository extends JpaRepository<InventoryStock, UUID> {
    List<InventoryStock> findByTenantId(UUID tenantId);
    List<InventoryStock> findByBranchId(UUID branchId);
    List<InventoryStock> findByBatchId(UUID batchId);
    Optional<InventoryStock> findByBatchIdAndBinId(UUID batchId, UUID binId);

    @Query("SELECT SUM(s.quantity) FROM InventoryStock s WHERE s.batch.id = :batchId")
    Integer getTotalStockByBatch(@Param("batchId") UUID batchId);

    @Query("SELECT s FROM InventoryStock s WHERE s.tenant.id = :tenantId AND s.quantity <= :threshold")
    List<InventoryStock> findLowStock(@Param("tenantId") UUID tenantId, @Param("threshold") Integer threshold);

    @Query("SELECT s FROM InventoryStock s JOIN s.batch b WHERE s.branch.id = :branchId AND b.product.id = :productId AND s.quantity > 0 ORDER BY b.expiryDate ASC")
    List<InventoryStock> findStockForPickingFEFO(@Param("branchId") UUID branchId, @Param("productId") UUID productId);
}
