package com.farmacia.core.repository.catalog;

import com.farmacia.core.model.catalog.Batch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface BatchRepository extends JpaRepository<Batch, UUID> {
    List<Batch> findByTenantId(UUID tenantId);
    List<Batch> findByProductId(UUID productId);
    List<Batch> findByProductIdOrderByExpiryDateAsc(UUID productId);
    List<Batch> findByTenantIdAndExpiryDateBefore(UUID tenantId, LocalDate date);
}
