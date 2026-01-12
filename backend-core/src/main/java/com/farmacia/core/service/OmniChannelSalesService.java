package com.farmacia.core.service;

import com.farmacia.core.model.sales.Sale;
import org.springframework.security.access.prepost.PreAuthorize;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Interfaz del Servicio de Ventas Omnicanal.
 * Unifica ventas de POS, E-commerce y B2B.
 */
public interface OmniChannelSalesService {

    /**
     * Crea una venta desde el Punto de Venta.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST', 'SELLER')")
    Sale createPOSSale(CreateSaleCommand command);

    /**
     * Crea una venta desde el E-commerce.
     */
    Sale createWebStoreSale(CreateSaleCommand command);

    /**
     * Crea una venta institucional B2B con crédito.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES_EXEC')")
    Sale createB2BSale(CreateB2BSaleCommand command);

    /**
     * Obtiene las ventas por sucursal en un rango de fechas.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    List<Sale> getSalesByBranch(UUID branchId, LocalDate start, LocalDate end);

    /**
     * Calcula el total de ventas de un vendedor.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'HR_MANAGER') or @securityService.isOwnUser(#userId)")
    BigDecimal getTotalSalesByUser(UUID userId, LocalDate start, LocalDate end);

    /**
     * Sincroniza una venta con el ERP contable.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    void syncSaleToERP(UUID saleId);

    record CreateSaleCommand(
        UUID tenantId,
        UUID branchId,
        UUID userId,
        UUID customerId,
        List<SaleItemCommand> items
    ) {}

    record CreateB2BSaleCommand(
        UUID tenantId,
        UUID institutionalClientId,
        List<SaleItemCommand> items,
        Integer creditDays
    ) {}

    record SaleItemCommand(
        UUID batchId,
        Integer quantity,
        BigDecimal unitPrice
    ) {}
}
