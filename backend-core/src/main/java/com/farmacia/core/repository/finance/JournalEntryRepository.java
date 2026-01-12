package com.farmacia.core.repository.finance;

import com.farmacia.core.model.finance.JournalEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface JournalEntryRepository extends JpaRepository<JournalEntry, UUID> {
    List<JournalEntry> findByTenantId(UUID tenantId);
    List<JournalEntry> findByReferenceId(UUID referenceId);
    List<JournalEntry> findByTenantIdAndTransactionDateBetween(UUID tenantId, LocalDate start, LocalDate end);
}
