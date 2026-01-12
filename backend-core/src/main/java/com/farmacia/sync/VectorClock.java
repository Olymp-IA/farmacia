package com.farmacia.sync;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Vector Clock para sincronización offline.
 * 
 * Implementa relojes lógicos de Lamport extendidos para detectar
 * y resolver conflictos de inventario cuando dispositivos POS
 * trabajan offline y luego sincronizan.
 * 
 * Cada nodo (dispositivo) mantiene su propio contador que incrementa
 * en cada operación local.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VectorClock implements Serializable, Comparable<VectorClock> {

    /**
     * Mapa de NodeID -> Counter.
     * Cada nodo representa un dispositivo POS único.
     */
    @Builder.Default
    private Map<String, Long> clock = new ConcurrentHashMap<>();

    /**
     * Incrementa el contador para un nodo específico.
     */
    public void increment(String nodeId) {
        clock.merge(nodeId, 1L, Long::sum);
    }

    /**
     * Obtiene el contador de un nodo.
     */
    public long get(String nodeId) {
        return clock.getOrDefault(nodeId, 0L);
    }

    /**
     * Establece el contador de un nodo.
     */
    public void set(String nodeId, long value) {
        clock.put(nodeId, value);
    }

    /**
     * Fusiona este vector clock con otro.
     * Toma el máximo de cada contador.
     */
    public VectorClock merge(VectorClock other) {
        Map<String, Long> merged = new HashMap<>(this.clock);
        
        for (Map.Entry<String, Long> entry : other.clock.entrySet()) {
            merged.merge(entry.getKey(), entry.getValue(), Long::max);
        }
        
        return VectorClock.builder().clock(new ConcurrentHashMap<>(merged)).build();
    }

    /**
     * Compara dos vector clocks para determinar causalidad.
     * 
     * @return:
     *   - BEFORE (-1): Este clock ocurrió antes que el otro
     *   - CONCURRENT (0): Los clocks son concurrentes (conflicto!)
     *   - AFTER (1): Este clock ocurrió después del otro
     */
    public Causality compareCausality(VectorClock other) {
        boolean thisBeforeOther = true;
        boolean otherBeforeThis = true;

        // Obtener todos los nodos de ambos clocks
        java.util.Set<String> allNodes = new java.util.HashSet<>();
        allNodes.addAll(this.clock.keySet());
        allNodes.addAll(other.clock.keySet());

        for (String nodeId : allNodes) {
            long thisValue = this.get(nodeId);
            long otherValue = other.get(nodeId);

            if (thisValue > otherValue) {
                otherBeforeThis = false;
            }
            if (otherValue > thisValue) {
                thisBeforeOther = false;
            }
        }

        if (thisBeforeOther && otherBeforeThis) {
            return Causality.EQUAL;
        } else if (thisBeforeOther) {
            return Causality.BEFORE;
        } else if (otherBeforeThis) {
            return Causality.AFTER;
        } else {
            return Causality.CONCURRENT;
        }
    }

    @Override
    public int compareTo(VectorClock other) {
        return this.compareCausality(other).ordinal() - 1;
    }

    /**
     * Crea una copia profunda del vector clock.
     */
    public VectorClock copy() {
        return VectorClock.builder()
            .clock(new ConcurrentHashMap<>(this.clock))
            .build();
    }

    /**
     * Resultado de comparación de causalidad.
     */
    public enum Causality {
        BEFORE,     // Este evento ocurrió antes
        EQUAL,      // Son el mismo evento
        AFTER,      // Este evento ocurrió después
        CONCURRENT  // Eventos concurrentes (conflicto)
    }
}
