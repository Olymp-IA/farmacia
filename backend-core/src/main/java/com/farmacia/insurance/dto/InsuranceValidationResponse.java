package com.farmacia.insurance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Respuesta del switch de seguros.
 * Se consume de Kafka topic: insurance.validation.response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InsuranceValidationResponse {

    private String transactionId;
    private UUID saleId;
    private String status; // APPROVED, REJECTED, PARTIAL
    private String message;
    
    // Datos de aprobación
    private BigDecimal copayAmount;      // Monto copago
    private Integer coveragePercentage;  // % cobertura
    private String authorizationCode;    // Código autorización ISAPRE
    
    // Datos de rechazo
    private String rejectionReason;
    private String rejectionCode;
}
