package com.farmacia.sync;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Servicio de resolución de conflictos para sincronización offline.
 * 
 * Aplica las siguientes políticas:
 * 1. Controlados: SIEMPRE intervención manual (auditoría ISP)
 * 2. Stock negativo resultante: Intervención manual
 * 3. Productos normales: Merge automático (Last Write Wins con vector clock)
 */
@Service
public class ConflictResolverService {

    private static final Logger log = LoggerFactory.getLogger(ConflictResolverService.class);

    /**
     * Resuelve conflicto entre venta offline local y estado del servidor.
     *
     * @param local Venta realizada offline en el dispositivo
     * @param server Estado actual del servidor
     * @return Resolución del conflicto
     */
    public ConflictResolution resolve(OfflineSale local, ServerState server) {
        log.debug("Resolviendo conflicto - Local: {}, Server: {}", 
                  local.getSaleId(), server.getCurrentStock());

        // 1. Comparar vector clocks para detectar concurrencia
        VectorClock.Causality causality = local.getVectorClock()
            .compareCausality(server.getVectorClock());

        log.debug("Causalidad detectada: {}", causality);

        // Si local es anterior al servidor, el servidor ya tiene datos más nuevos
        if (causality == VectorClock.Causality.BEFORE) {
            return ConflictResolution.builder()
                .resolution(Resolution.DISCARD_LOCAL)
                .reason("El servidor tiene datos más recientes")
                .build();
        }

        // Si local es posterior, aplicar directamente
        if (causality == VectorClock.Causality.AFTER) {
            return ConflictResolution.builder()
                .resolution(Resolution.APPLY_LOCAL)
                .reason("Datos locales son más recientes")
                .build();
        }

        // CONFLICTO: Eventos concurrentes
        return resolveConflict(local, server);
    }

    private ConflictResolution resolveConflict(OfflineSale local, ServerState server) {
        // Regla 1: CONTROLADOS - Siempre intervención manual
        if (local.isControlledSubstance()) {
            log.warn("Conflicto en sustancia controlada - Requiere intervención manual");
            return ConflictResolution.builder()
                .resolution(Resolution.MANUAL_INTERVENTION)
                .reason("Venta de sustancia controlada requiere auditoría manual")
                .requiresAudit(true)
                .build();
        }

        // Regla 2: ¿Resultaría en stock negativo?
        int projectedStock = server.getCurrentStock() - local.getQuantitySold();
        if (projectedStock < 0) {
            log.warn("Conflicto resultaría en stock negativo: {}", projectedStock);
            return ConflictResolution.builder()
                .resolution(Resolution.MANUAL_INTERVENTION)
                .reason("La operación resultaría en stock negativo (" + projectedStock + ")")
                .projectedStock(projectedStock)
                .build();
        }

        // Regla 3: Merge automático para productos normales
        VectorClock mergedClock = local.getVectorClock().merge(server.getVectorClock());
        
        log.info("Conflicto resuelto con MERGE automático - Nuevo stock: {}", projectedStock);
        
        return ConflictResolution.builder()
            .resolution(Resolution.MERGE)
            .reason("Merge automático aplicado")
            .mergedVectorClock(mergedClock)
            .projectedStock(projectedStock)
            .build();
    }

    /**
     * Tipos de resolución de conflicto.
     */
    public enum Resolution {
        APPLY_LOCAL,         // Aplicar datos locales (servidor desactualizado)
        DISCARD_LOCAL,       // Descartar datos locales (ya obsoletos)
        MERGE,               // Fusionar cambios
        MANUAL_INTERVENTION  // Requiere revisión humana
    }

    /**
     * Resultado de resolución de conflicto.
     */
    @lombok.Data
    @lombok.Builder
    public static class ConflictResolution {
        private Resolution resolution;
        private String reason;
        private VectorClock mergedVectorClock;
        private Integer projectedStock;
        private boolean requiresAudit;
    }

    /**
     * DTO venta offline del dispositivo.
     */
    @lombok.Data
    @lombok.Builder
    public static class OfflineSale {
        private java.util.UUID saleId;
        private String nodeId;
        private java.util.UUID productId;
        private int quantitySold;
        private boolean controlledSubstance;
        private VectorClock vectorClock;
        private java.time.Instant localTimestamp;
    }

    /**
     * Estado actual del servidor.
     */
    @lombok.Data
    @lombok.Builder
    public static class ServerState {
        private java.util.UUID productId;
        private int currentStock;
        private VectorClock vectorClock;
        private java.time.Instant lastUpdated;
    }
}
