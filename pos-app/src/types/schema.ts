/**
 * Enterprise Pharma Suite - TypeScript Schema Definitions
 * Modules: Core, Catalog, WMS, Sales, Finance, HR
 * Generated: 2026-01-12
 */

// ============================================================================
// CORE MODULE
// ============================================================================

export interface Tenant {
    id: string;
    businessName: string;
    taxId: string;
    configJson: Record<string, unknown>;
    isActive: boolean;
    createdAt: string;
}

export type BranchType = 'STORE' | 'WAREHOUSE' | 'HQ';

export interface Branch {
    id: string;
    tenantId: string;
    name: string;
    type: BranchType;
    address: string | null;
    isActive: boolean;
}

export interface User {
    id: string;
    tenantId: string;
    email: string;
    fullName: string;
    role: string;
    createdAt: string;
}

// ============================================================================
// CATALOG MODULE
// ============================================================================

export interface Product {
    id: string;
    tenantId: string;
    sku: string;
    name: string;
    description: string | null;
    activePrinciple: string;
    isControlled: boolean;
    imageUrl: string | null;
    createdAt: string;
}

export interface Batch {
    id: string;
    tenantId: string;
    productId: string;
    batchNumber: string;
    expiryDate: string;
    costPrice: number;
    salePrice: number;
    createdAt: string;
}

// ============================================================================
// WMS MODULE
// ============================================================================

export interface WarehouseZone {
    id: string;
    branchId: string;
    name: string;
}

export interface BinLocation {
    id: string;
    zoneId: string;
    code: string;
}

export interface InventoryStock {
    id: string;
    tenantId: string;
    branchId: string;
    batchId: string;
    binId: string | null;
    quantity: number;
    createdAt: string;
}

// ============================================================================
// SALES MODULE
// ============================================================================

export type SaleStatus = 'COMPLETED' | 'PENDING' | 'CANCELLED';
export type ErpSyncStatus = 'PENDING' | 'SYNCED' | 'FAILED';

export interface Sale {
    id: string;
    tenantId: string;
    branchId: string | null;
    userId: string | null;
    status: SaleStatus;
    totalAmount: number;
    erpSyncStatus: ErpSyncStatus;
    createdAt: string;
    items: SaleItem[];
}

export interface SaleItem {
    id: string;
    saleId: string;
    batchId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface ComplianceLog {
    id: string;
    tenantId: string;
    saleId: string;
    drugType: string;
    patientRut: string | null;
    doctorName: string | null;
    prescriptionDate: string | null;
    createdAt: string;
}

// ============================================================================
// FINANCE MODULE (ERP)
// ============================================================================

export interface Supplier {
    id: string;
    tenantId: string;
    taxId: string;
    businessName: string;
}

export interface AccountingAccount {
    id: string;
    tenantId: string;
    code: string;
    name: string;
    type: string;
}

export type JournalStatus = 'POSTED' | 'DRAFT' | 'VOIDED';

export interface JournalEntry {
    id: string;
    tenantId: string;
    transactionDate: string;
    description: string;
    referenceId: string | null;
    status: JournalStatus;
    lines: JournalEntryLine[];
}

export interface JournalEntryLine {
    id: string;
    entryId: string;
    accountId: string;
    debit: number;
    credit: number;
}

// ============================================================================
// HR MODULE
// ============================================================================

export interface Employee {
    id: string;
    tenantId: string;
    userId: string | null;
    rut: string;
    baseSalary: number;
    commissionRate: number;
}

export interface Payroll {
    id: string;
    tenantId: string;
    employeeId: string;
    periodStart: string;
    periodEnd: string;
    totalLiquid: number;
    commissionAmount: number;
    createdAt: string;
}

// ============================================================================
// AI SERVICE TYPES
// ============================================================================

export interface SearchRequest {
    query: string;
    tenantId: string;
    limit?: number;
}

export interface ProductSearchResult {
    id: string;
    sku: string;
    name: string;
    description: string | null;
    activePrinciple: string;
    isControlled: boolean;
    imageUrl: string | null;
    similarityScore: number | null;
}

export interface SearchResponse {
    query: string;
    tenantId: string;
    results: ProductSearchResult[];
    total: number;
}

export interface PickItem {
    productId: string;
    quantity: number;
}

export interface PickingRequest {
    branchId: string;
    items: PickItem[];
}

export interface BinAllocation {
    batchId: string;
    binId: string | null;
    binCode: string | null;
    zoneName: string | null;
    quantity: number;
    expiryDate: string;
}

export interface PickingLine {
    productId: string;
    allocations: BinAllocation[];
    totalPicked: number;
}

export interface OptimizedRoute {
    sequence: number;
    zoneName: string;
    binCode: string;
    batchId: string;
    productId: string;
    quantity: number;
}

export interface PickingResponse {
    branchId: string;
    lines: PickingLine[];
    optimizedRoute: OptimizedRoute[];
    estimatedTimeSeconds: number;
}

// ============================================================================
// API RESPONSE WRAPPERS
// ============================================================================

export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
