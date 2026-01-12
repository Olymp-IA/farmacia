package com.farmacia.core.service;

import com.farmacia.core.model.finance.JournalEntry;
import com.farmacia.core.model.sales.Sale;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Accounting Service Interface.
 * Handles double-entry bookkeeping and financial reporting.
 */
public interface AccountingService {

    /**
     * Creates a journal entry from a completed sale.
     * Debits: Cash/Receivables, Credits: Revenue + Tax
     */
    JournalEntry createEntryFromSale(Sale sale);

    /**
     * Gets all journal entries for a tenant within a date range.
     */
    List<JournalEntry> getEntriesByPeriod(UUID tenantId, LocalDate start, LocalDate end);

    /**
     * Calculates the balance for a specific account.
     */
    BigDecimal getAccountBalance(UUID accountId);

    /**
     * Generates a trial balance report.
     */
    List<AccountBalanceDto> getTrialBalance(UUID tenantId, LocalDate asOf);

    record AccountBalanceDto(UUID accountId, String code, String name, BigDecimal debit, BigDecimal credit) {}
}
