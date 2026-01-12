package com.farmacia.core.repository.core;

import com.farmacia.core.model.core.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BranchRepository extends JpaRepository<Branch, UUID> {
    List<Branch> findByTenantId(UUID tenantId);
    List<Branch> findByTenantIdAndType(UUID tenantId, Branch.BranchType type);
    List<Branch> findByTenantIdAndIsActiveTrue(UUID tenantId);
}
