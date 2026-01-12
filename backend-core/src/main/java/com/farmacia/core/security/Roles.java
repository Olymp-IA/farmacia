package com.farmacia.core.security;

/**
 * Constantes de Roles del Sistema.
 * Define los roles para el control de acceso basado en roles (RBAC).
 */
public final class Roles {

    private Roles() {}

    // Roles Administrativos
    public static final String ADMIN = "ADMIN";
    
    // Roles Operativos - Ventas
    public static final String PHARMACIST = "PHARMACIST";
    public static final String SELLER = "SELLER";
    
    // Roles Operativos - Bodega
    public static final String WAREHOUSE_OP = "WAREHOUSE_OP";
    
    // Roles Finanzas
    public static final String ACCOUNTANT = "ACCOUNTANT";
    
    // Roles RRHH
    public static final String HR_MANAGER = "HR_MANAGER";
    
    // Roles Logística
    public static final String DISPATCHER = "DISPATCHER";
    public static final String DRIVER = "DRIVER";
    
    // Roles Comercial B2B
    public static final String SALES_EXEC = "SALES_EXEC";
    
    // Roles Manufactura
    public static final String LAB_TECHNICIAN = "LAB_TECHNICIAN";

    // Prefijos para SpEL
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_PHARMACIST = "ROLE_PHARMACIST";
    public static final String ROLE_ACCOUNTANT = "ROLE_ACCOUNTANT";
    public static final String ROLE_HR_MANAGER = "ROLE_HR_MANAGER";
    public static final String ROLE_WAREHOUSE_OP = "ROLE_WAREHOUSE_OP";
}
