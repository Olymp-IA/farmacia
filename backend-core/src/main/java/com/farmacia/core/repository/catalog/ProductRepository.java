package com.farmacia.core.repository.catalog;

import com.farmacia.core.model.catalog.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findByTenantId(UUID tenantId);
    Optional<Product> findBySkuAndTenantId(String sku, UUID tenantId);
    List<Product> findByActivePrincipleContainingIgnoreCaseAndTenantId(String activePrinciple, UUID tenantId);
    List<Product> findByIsControlledTrueAndTenantId(UUID tenantId);

    @Query("SELECT p FROM Product p WHERE p.tenant.id = :tenantId AND LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchByName(@Param("tenantId") UUID tenantId, @Param("query") String query);
}
