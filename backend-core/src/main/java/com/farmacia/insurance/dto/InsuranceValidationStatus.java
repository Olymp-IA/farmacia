package com.farmacia.insurance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

/**
 * Estado de validación almacenado en Redis.
 * TTL: 30 minutos.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InsuranceValidationStatus implements Serializable {

    private String transactionId;
    private UUID saleId;
    private String status; // PENDING, APPROVED, REJECTED, PARTIAL, CANCELLED, ERROR
    private String message;
    private Instant createdAt;
    private Instant updatedAt;
}
