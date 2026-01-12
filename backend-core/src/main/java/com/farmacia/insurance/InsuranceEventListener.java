package com.farmacia.insurance;

import com.farmacia.core.repository.sales.SaleRepository;
import com.farmacia.insurance.dto.InsuranceValidationResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Listener de eventos Kafka para respuestas del switch de seguros.
 * 
 * Procesa las respuestas de validación y:
 * 1. Actualiza el estado de la venta en BD
 * 2. Notifica al cliente vía WebSocket
 */
@Component
public class InsuranceEventListener {

    private static final Logger log = LoggerFactory.getLogger(InsuranceEventListener.class);
    
    private static final String KAFKA_TOPIC_RESPONSE = "insurance.validation.response";
    private static final String WEBSOCKET_DESTINATION = "/topic/insurance/";

    private final InsuranceSagaService sagaService;
    private final SaleRepository saleRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public InsuranceEventListener(
            InsuranceSagaService sagaService,
            SaleRepository saleRepository,
            SimpMessagingTemplate messagingTemplate) {
        this.sagaService = sagaService;
        this.saleRepository = saleRepository;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Escucha respuestas del switch de seguros.
     */
    @KafkaListener(
        topics = KAFKA_TOPIC_RESPONSE,
        groupId = "farmacia-insurance-group",
        containerFactory = "kafkaListenerContainerFactory"
    )
    @Transactional
    public void handleInsuranceResponse(InsuranceValidationResponse response) {
        log.info("Recibida respuesta de seguro - Transaction: {}, Status: {}", 
                 response.getTransactionId(), response.getStatus());

        try {
            // 1. Actualizar estado en Redis
            sagaService.updateStatus(
                response.getTransactionId(),
                response.getStatus(),
                response.getMessage()
            );

            // 2. Actualizar venta en BD según resultado
            saleRepository.findById(response.getSaleId()).ifPresent(sale -> {
                switch (response.getStatus()) {
                    case "APPROVED" -> {
                        sale.setErpSyncStatus("INSURANCE_APPROVED");
                        sale.setStatus("COMPLETED");
                        log.info("Venta {} aprobada por seguro. Copago: {}", 
                                 sale.getId(), response.getCopayAmount());
                    }
                    case "REJECTED" -> {
                        sale.setErpSyncStatus("INSURANCE_REJECTED");
                        sale.setStatus("PENDING_PAYMENT");
                        log.warn("Venta {} rechazada por seguro: {}", 
                                 sale.getId(), response.getRejectionReason());
                    }
                    case "PARTIAL" -> {
                        sale.setErpSyncStatus("INSURANCE_PARTIAL");
                        log.info("Venta {} aprobada parcialmente. Cobertura: {}%", 
                                 sale.getId(), response.getCoveragePercentage());
                    }
                    default -> log.warn("Estado de respuesta desconocido: {}", response.getStatus());
                }
                saleRepository.save(sale);
            });

            // 3. Notificar al cliente vía WebSocket
            notifyClient(response);

        } catch (Exception e) {
            log.error("Error procesando respuesta de seguro: {}", e.getMessage(), e);
            sagaService.updateStatus(
                response.getTransactionId(),
                "PROCESSING_ERROR",
                e.getMessage()
            );
        }
    }

    /**
     * Envía notificación al cliente vía WebSocket.
     */
    private void notifyClient(InsuranceValidationResponse response) {
        String destination = WEBSOCKET_DESTINATION + response.getSaleId();
        
        InsuranceNotification notification = InsuranceNotification.builder()
            .transactionId(response.getTransactionId())
            .saleId(response.getSaleId())
            .status(response.getStatus())
            .message(buildUserMessage(response))
            .copayAmount(response.getCopayAmount())
            .coveragePercentage(response.getCoveragePercentage())
            .build();

        messagingTemplate.convertAndSend(destination, notification);
        
        log.debug("Notificación WebSocket enviada a {}", destination);
    }

    private String buildUserMessage(InsuranceValidationResponse response) {
        return switch (response.getStatus()) {
            case "APPROVED" -> "✅ Seguro aprobado. Copago: $" + response.getCopayAmount();
            case "REJECTED" -> "❌ Seguro rechazado: " + response.getRejectionReason();
            case "PARTIAL" -> "⚠️ Cobertura parcial: " + response.getCoveragePercentage() + "%";
            default -> "Estado: " + response.getStatus();
        };
    }

    /**
     * DTO para notificación WebSocket.
     */
    @lombok.Data
    @lombok.Builder
    public static class InsuranceNotification {
        private String transactionId;
        private java.util.UUID saleId;
        private String status;
        private String message;
        private java.math.BigDecimal copayAmount;
        private Integer coveragePercentage;
    }
}
