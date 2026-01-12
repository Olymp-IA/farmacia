package com.farmacia.insurance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * Evento de solicitud de validación de seguro.
 * Se publica en Kafka topic: insurance.validation.request
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InsuranceValidationEvent {

    private String transactionId;
    private UUID saleId;
    private UUID tenantId;
    private BigDecimal totalAmount;
    private String patientRut;
    private String insurerCode;
    private List<LineItem> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LineItem {
        private String sku;
        private Integer quantity;
        private BigDecimal unitPrice;
    }
}
