package com.farmacia.core.repository.finance;

import com.farmacia.core.model.finance.AccountingAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountingAccountRepository extends JpaRepository<AccountingAccount, UUID> {
    List<AccountingAccount> findByTenantId(UUID tenantId);
    Optional<AccountingAccount> findByTenantIdAndCode(UUID tenantId, String code);
    List<AccountingAccount> findByTenantIdAndType(UUID tenantId, String type);
}
