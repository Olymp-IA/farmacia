package com.farmacia.core.model.hr;

import com.farmacia.core.model.core.Tenant;
import com.farmacia.core.model.core.User;
import com.farmacia.core.security.AttributeEncryptor;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Entidad Empleado del módulo RRHH.
 * DATOS SENSIBLES ENCRIPTADOS: base_salary, commission_rate, rut.
 */
@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    /**
     * RUT del Empleado - ENCRIPTADO con AES-256.
     */
    @NotBlank(message = "El RUT es obligatorio")
    @Pattern(regexp = "^[0-9]{1,2}\\.[0-9]{3}\\.[0-9]{3}-[0-9Kk]$", message = "Formato RUT inválido")
    @Column(nullable = false, length = 255)
    @Convert(converter = AttributeEncryptor.class)
    private String rut;

    /**
     * Salario Base - ENCRIPTADO con AES-256.
     * Dato altamente sensible para privacidad del empleado.
     */
    @PositiveOrZero(message = "El salario debe ser positivo")
    @Column(name = "base_salary", nullable = false, length = 255)
    @Convert(converter = AttributeEncryptor.class)
    private String baseSalary; // String para permitir encriptación

    /**
     * Tasa de Comisión - ENCRIPTADO con AES-256.
     */
    @Column(name = "commission_rate", length = 255)
    @Convert(converter = AttributeEncryptor.class)
    private String commissionRate; // String para permitir encriptación

    // Métodos helper para conversión de valores numéricos
    public BigDecimal getBaseSalaryAsDecimal() {
        return baseSalary != null ? new BigDecimal(baseSalary) : BigDecimal.ZERO;
    }

    public void setBaseSalaryFromDecimal(BigDecimal value) {
        this.baseSalary = value != null ? value.toPlainString() : null;
    }

    public BigDecimal getCommissionRateAsDecimal() {
        return commissionRate != null ? new BigDecimal(commissionRate) : BigDecimal.ZERO;
    }

    public void setCommissionRateFromDecimal(BigDecimal value) {
        this.commissionRate = value != null ? value.toPlainString() : null;
    }
}
