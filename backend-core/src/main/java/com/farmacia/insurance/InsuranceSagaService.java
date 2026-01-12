package com.farmacia.insurance;

import com.farmacia.core.model.sales.Sale;
import com.farmacia.insurance.dto.InsuranceValidationEvent;
import com.farmacia.insurance.dto.InsuranceValidationStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

/**
 * Servicio SAGA para validación asíncrona de seguros.
 * 
 * Patrón: Choreography-based SAGA
 * Flow:
 * 1. Venta creada con método de pago "SEGURO"
 * 2. initiateValidation() guarda estado PENDING en Redis
 * 3. Publica evento en Kafka topic "insurance.validation.request"
 * 4. Switch de seguros (externo) procesa y responde
 * 5. InsuranceEventListener recibe respuesta y actualiza venta
 * 
 * IMPORTANTE: No bloquea el hilo principal - respuesta vía WebSocket
 */
@Service
public class InsuranceSagaService {

    private static final Logger log = LoggerFactory.getLogger(InsuranceSagaService.class);
    
    private static final String KAFKA_TOPIC_REQUEST = "insurance.validation.request";
    private static final String REDIS_KEY_PREFIX = "insurance:validation:";
    private static final Duration VALIDATION_TTL = Duration.ofMinutes(30);

    private final KafkaTemplate<String, InsuranceValidationEvent> kafkaTemplate;
    private final RedisTemplate<String, InsuranceValidationStatus> redisTemplate;

    public InsuranceSagaService(
            KafkaTemplate<String, InsuranceValidationEvent> kafkaTemplate,
            RedisTemplate<String, InsuranceValidationStatus> redisTemplate) {
        this.kafkaTemplate = kafkaTemplate;
        this.redisTemplate = redisTemplate;
    }

    /**
     * Inicia el proceso de validación de seguro de forma asíncrona.
     * NO BLOQUEA - El resultado llegará vía WebSocket.
     *
     * @param sale La venta que requiere validación de seguro
     * @return ID de la transacción de validación (para tracking)
     */
    public String initiateValidation(Sale sale) {
        String transactionId = UUID.randomUUID().toString();
        
        log.info("Iniciando validación de seguro para venta {} - Transaction: {}", 
                 sale.getId(), transactionId);

        // 1. Guardar estado inicial en Redis (TTL 30 min)
        InsuranceValidationStatus status = InsuranceValidationStatus.builder()
            .transactionId(transactionId)
            .saleId(sale.getId())
            .status("PENDING")
            .createdAt(java.time.Instant.now())
            .build();

        redisTemplate.opsForValue().set(
            REDIS_KEY_PREFIX + transactionId,
            status,
            VALIDATION_TTL
        );

        // 2. Construir evento para Kafka
        InsuranceValidationEvent event = InsuranceValidationEvent.builder()
            .transactionId(transactionId)
            .saleId(sale.getId())
            .tenantId(sale.getTenant().getId())
            .totalAmount(sale.getTotalAmount())
            .patientRut(extractPatientRut(sale))
            .insurerCode(extractInsurerCode(sale))
            .items(sale.getItems().stream()
                .map(item -> new InsuranceValidationEvent.LineItem(
                    item.getBatch().getProduct().getSku(),
                    item.getQuantity(),
                    item.getUnitPrice()
                ))
                .toList())
            .build();

        // 3. Publicar en Kafka (no bloquea)
        CompletableFuture.runAsync(() -> {
            kafkaTemplate.send(KAFKA_TOPIC_REQUEST, transactionId, event)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.error("Error publicando evento de validación: {}", ex.getMessage());
                        updateStatus(transactionId, "KAFKA_ERROR", ex.getMessage());
                    } else {
                        log.info("Evento de validación publicado - Partition: {}, Offset: {}", 
                                 result.getRecordMetadata().partition(),
                                 result.getRecordMetadata().offset());
                    }
                });
        });

        return transactionId;
    }

    /**
     * Obtiene el estado actual de una validación.
     */
    public InsuranceValidationStatus getStatus(String transactionId) {
        return redisTemplate.opsForValue().get(REDIS_KEY_PREFIX + transactionId);
    }

    /**
     * Actualiza el estado de una validación.
     */
    public void updateStatus(String transactionId, String status, String message) {
        InsuranceValidationStatus current = getStatus(transactionId);
        if (current != null) {
            current.setStatus(status);
            current.setMessage(message);
            current.setUpdatedAt(java.time.Instant.now());
            redisTemplate.opsForValue().set(
                REDIS_KEY_PREFIX + transactionId,
                current,
                VALIDATION_TTL
            );
        }
    }

    /**
     * Cancela una validación en progreso (compensación SAGA).
     */
    public void cancelValidation(String transactionId) {
        log.info("Cancelando validación de seguro: {}", transactionId);
        updateStatus(transactionId, "CANCELLED", "Cancelado por usuario o timeout");
        // TODO: Publicar evento de compensación si ya fue enviado al switch
    }

    private String extractPatientRut(Sale sale) {
        // En venta con seguro, el RUT viene del compliance log o del cliente
        return sale.getCustomer() != null ? sale.getCustomer().getRut() : null;
    }

    private String extractInsurerCode(Sale sale) {
        // TODO: Extraer del método de pago o metadata de la venta
        return "ISAPRE_001";
    }
}
