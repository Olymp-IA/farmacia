package com.farmacia.core.service;

import com.farmacia.core.model.catalog.Batch;
import com.farmacia.core.model.wms.InventoryStock;

import java.util.List;
import java.util.UUID;

/**
 * Inventory Service Interface.
 * Handles multi-warehouse stock management with FEFO logic.
 */
public interface InventoryService {

    /**
     * Gets available stock for a product across all branches.
     */
    Integer getTotalStockByProduct(UUID tenantId, UUID productId);

    /**
     * Gets available stock for a product at a specific branch.
     */
    Integer getStockByProductAndBranch(UUID productId, UUID branchId);

    /**
     * Allocates stock for a sale using FEFO (First Expired, First Out).
     * Returns the list of batches and quantities to pick.
     */
    List<StockAllocationDto> allocateStockFEFO(UUID branchId, UUID productId, Integer quantity);

    /**
     * Transfers stock between branches.
     */
    void transferStock(UUID sourceBranchId, UUID targetBranchId, UUID batchId, Integer quantity);

    /**
     * Decrements stock after a sale is completed.
     */
    void decrementStock(UUID batchId, UUID binId, Integer quantity);

    /**
     * Gets batches expiring within the specified days.
     */
    List<Batch> getExpiringBatches(UUID tenantId, Integer daysAhead);

    /**
     * Gets low stock alerts for a tenant.
     */
    List<InventoryStock> getLowStockAlerts(UUID tenantId, Integer threshold);

    record StockAllocationDto(UUID batchId, UUID binId, Integer quantity) {}
}
