package com.farmacia.core.security;

import java.util.UUID;

/**
 * Thread-local context for multi-tenant data isolation.
 * Stores the current tenant ID extracted from JWT for use in repository queries.
 */
public final class TenantContext {

    private static final ThreadLocal<UUID> CURRENT_TENANT = new ThreadLocal<>();

    private TenantContext() {}

    public static void setTenantId(UUID tenantId) {
        CURRENT_TENANT.set(tenantId);
    }

    public static UUID getTenantId() {
        return CURRENT_TENANT.get();
    }

    public static void clear() {
        CURRENT_TENANT.remove();
    }

    public static boolean isSet() {
        return CURRENT_TENANT.get() != null;
    }
}
