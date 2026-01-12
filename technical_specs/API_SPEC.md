# API Specification

## Document Information

| Field | Value |
|-------|-------|
| Project | Enterprise Pharma Suite |
| Version | 1.0.0 |
| Date | 2026-01-12 |
| Base URL | `https://api.farmacia.io/v1` |

## 1. Authentication

### POST /api/auth/login

Authenticates user and returns JWT token.

**Request:**
```json
{
  "email": "user@pharmacy.cl",
  "password": "securePassword123",
  "tenantId": "uuid"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJSUzI1NiIs...",
  "expiresIn": 86400,
  "user": {
    "id": "uuid",
    "email": "user@pharmacy.cl",
    "fullName": "Juan Perez",
    "role": "PHARMACIST"
  }
}
```

### POST /api/auth/refresh

Refreshes expired access token.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJSUzI1NiIs..."
}
```

## 2. Products

### GET /api/products

Lists all products for current tenant.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| page | int | Page number (default: 0) |
| size | int | Page size (default: 20) |
| search | string | Name or SKU filter |
| controlled | boolean | Filter controlled drugs |

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "sku": "MED-001",
      "name": "Paracetamol 500mg",
      "activePrinciple": "Paracetamol",
      "isControlled": false
    }
  ],
  "total": 150,
  "page": 0,
  "pageSize": 20
}
```

### GET /api/products/{id}/bioequivalents

Returns products with same active principle.

**Response (200):**
```json
{
  "sourceProductId": "uuid",
  "bioequivalents": [
    {
      "id": "uuid",
      "name": "Tapsin 500mg",
      "laboratory": "Maver"
    }
  ],
  "total": 3
}
```

## 3. Inventory (WMS)

### GET /api/inventory/stock

Lists stock levels across branches.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| branchId | uuid | Filter by branch |
| productId | uuid | Filter by product |
| lowStock | int | Threshold for low stock alert |

### POST /api/inventory/transfer

Transfers stock between branches.

**Request:**
```json
{
  "sourceBranchId": "uuid",
  "targetBranchId": "uuid",
  "batchId": "uuid",
  "quantity": 50
}
```

### POST /api/inventory/allocate-fefo

Allocates stock using FEFO logic for a sale.

**Request:**
```json
{
  "branchId": "uuid",
  "productId": "uuid",
  "quantity": 10
}
```

**Response (200):**
```json
{
  "allocations": [
    {
      "batchId": "uuid",
      "binId": "uuid",
      "quantity": 7,
      "expiryDate": "2026-03-15"
    },
    {
      "batchId": "uuid",
      "binId": "uuid",
      "quantity": 3,
      "expiryDate": "2026-04-20"
    }
  ]
}
```

## 4. Sales

### POST /api/sales

Creates a new sale.

**Request:**
```json
{
  "branchId": "uuid",
  "items": [
    {
      "batchId": "uuid",
      "quantity": 2,
      "unitPrice": 5990.00
    }
  ],
  "paymentMethod": "DEBIT"
}
```

### GET /api/sales/{id}

Retrieves sale details including items and compliance logs.

## 5. Finance (ERP)

### POST /api/finance/journal-entries

Creates a manual journal entry.

**Request:**
```json
{
  "transactionDate": "2026-01-12",
  "description": "Ajuste de inventario",
  "lines": [
    {"accountId": "uuid", "debit": 10000.00, "credit": 0},
    {"accountId": "uuid", "debit": 0, "credit": 10000.00}
  ]
}
```

### GET /api/finance/trial-balance

Generates trial balance report.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| asOf | date | Report date |

## 6. HR

### GET /api/hr/employees

Lists employees for current tenant.

### POST /api/hr/payroll/generate

Generates payroll for a period.

**Request:**
```json
{
  "periodStart": "2026-01-01",
  "periodEnd": "2026-01-31"
}
```

**Response (200):**
```json
{
  "payrolls": [
    {
      "employeeId": "uuid",
      "baseSalary": 850000.00,
      "commissionAmount": 45000.00,
      "totalLiquid": 895000.00
    }
  ],
  "summary": {
    "employeeCount": 5,
    "totalPayrollCost": 4500000.00
  }
}
```

## 7. AI Service (Python)

Base URL: `https://ai.farmacia.io`

### POST /search

Semantic product search using vector embeddings.

**Request:**
```json
{
  "query": "dolor de cabeza",
  "tenant_id": "uuid",
  "limit": 10
}
```

### POST /wms/optimize-route

Optimizes picking route for warehouse operations.

**Request:**
```json
{
  "branch_id": "uuid",
  "items": [
    {"product_id": "uuid", "quantity": 5},
    {"product_id": "uuid", "quantity": 3}
  ]
}
```

**Response (200):**
```json
{
  "optimized_route": [
    {"sequence": 1, "zone_name": "ZONA-A", "bin_code": "A-01-02", "quantity": 5},
    {"sequence": 2, "zone_name": "ZONA-B", "bin_code": "B-03-01", "quantity": 3}
  ],
  "estimated_time_seconds": 30
}
```

## 8. Error Responses

All endpoints return standard error format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": [
      {"field": "email", "message": "must be a valid email address"}
    ]
  },
  "timestamp": "2026-01-12T04:00:00Z"
}
```

| HTTP Code | Meaning |
|-----------|---------|
| 400 | Validation error |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient role) |
| 404 | Resource not found |
| 409 | Conflict (duplicate resource) |
| 500 | Internal server error |

---

> powered by **OLYMP-IA.cl** | [https://olymp-ia.cl](https://olymp-ia.cl) | [GitHub](https://github.com/Olymp-IA)
