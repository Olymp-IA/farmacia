package com.farmacia.core.service;

import com.farmacia.core.model.hr.Payroll;
import org.springframework.security.access.prepost.PreAuthorize;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Interfaz del Servicio de Nómina.
 * Gestiona el cálculo y generación de liquidaciones de sueldo.
 * Acceso restringido a ADMIN y HR_MANAGER.
 */
public interface PayrollService {

    /**
     * Genera la nómina para todos los empleados en un período.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_MANAGER')")
    List<Payroll> generatePayroll(UUID tenantId, LocalDate periodStart, LocalDate periodEnd);

    /**
     * Calcula la comisión de un empleado basándose en sus ventas.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_MANAGER')")
    BigDecimal calculateCommission(UUID employeeId, LocalDate periodStart, LocalDate periodEnd);

    /**
     * Obtiene el historial de liquidaciones de un empleado.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_MANAGER') or @securityService.isOwnEmployee(#employeeId)")
    List<Payroll> getEmployeePayrollHistory(UUID employeeId);

    /**
     * Obtiene el costo total de nómina para un período.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_MANAGER', 'ACCOUNTANT')")
    BigDecimal getTotalPayrollCost(UUID tenantId, LocalDate periodStart, LocalDate periodEnd);

    /**
     * Genera un resumen de nómina para reportes.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_MANAGER')")
    PayrollSummaryDto getPayrollSummary(UUID tenantId, LocalDate periodStart, LocalDate periodEnd);

    record PayrollSummaryDto(
        Integer employeeCount,
        BigDecimal totalBaseSalary,
        BigDecimal totalCommissions,
        BigDecimal totalLiquid
    ) {}
}
