package com.farmacia.core.repository.hr;

import com.farmacia.core.model.hr.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, UUID> {
    List<Payroll> findByTenantId(UUID tenantId);
    List<Payroll> findByEmployeeId(UUID employeeId);
    List<Payroll> findByTenantIdAndPeriodStartBetween(UUID tenantId, LocalDate start, LocalDate end);

    @Query("SELECT SUM(p.totalLiquid) FROM Payroll p WHERE p.tenant.id = :tenantId AND p.periodStart >= :start AND p.periodEnd <= :end")
    BigDecimal getTotalPayrollCost(@Param("tenantId") UUID tenantId, @Param("start") LocalDate start, @Param("end") LocalDate end);
}
