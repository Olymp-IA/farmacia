package com.farmacia.core.repository.sales;

import com.farmacia.core.model.sales.ComplianceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ComplianceLogRepository extends JpaRepository<ComplianceLog, UUID> {
    List<ComplianceLog> findByTenantId(UUID tenantId);
    List<ComplianceLog> findBySaleId(UUID saleId);
    List<ComplianceLog> findByPatientRut(String patientRut);
    List<ComplianceLog> findByTenantIdAndPrescriptionDateBetween(UUID tenantId, LocalDate start, LocalDate end);
}
