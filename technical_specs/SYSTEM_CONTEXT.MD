# SYSTEM CONTEXT: ENTERPRISE PHARMA SUITE

## 1. PROJECT OVERVIEW
**Type:** End-to-End Pharma ERP & SaaS Platform.
**Goal:** Complete management for Pharmacy Chains, including POS, WMS (Logistics), HR (Payroll) and Finance (Accounting).
**Scalability:** Multi-tenant (SaaS) and Multi-branch (Chain ready).

## 2. TECHNICAL ARCHITECTURE
- **Backend Core:** Java 17 + Spring Boot 3.2 (Modular Monolith: Sales, Finance, HR, Logistics).
- **AI Service:** Python 3.11 + FastAPI (Vector Search, Demand Forecasting, Route Optimization).
- **Frontend POS:** React Native (Tablet/Desktop) - Offline First.
- **Frontend Store:** Next.js (E-commerce).
- **Database:** PostgreSQL 16 + `pgvector`.

## 3. DOMAIN MODULES

### A. CORE & SALES
- **Multi-Tenancy:** Strict data isolation per tenant.
- **Regulation:** ISP/Legal compliance for Controlled Drugs (Books).
- **Bioequivalence:** Semantic search using AI embeddings.

### B. NATIVE ERP (FINANCE)
- **Goal:** Real-time accounting (Double-entry ledger).
- **Automation:** Every Sale/Purchase auto-generates Journal Entries.
- **Tax:** Integration with Local Tax Authority (SII).

### C. WMS (LOGISTICS)
- **Structure:** Multi-Branch (Store vs Warehouse) > Zones > Bins.
- **Stock:** Granular control (Batch X in Bin Y).
- **Flow:** Picking optimization via AI.

### D. HR (HUMAN RESOURCES)
- **Staff:** Role management + Shifts.
- **Payroll:** Auto-calculation of Commissions based on Sales performance.

## 4. UI/UX GUIDELINES
- **Style:** Clean, Professional, "Scandinavian" (Minimal noise).
- **Performance:** Key interactions (Scan -> Pay) must be under 200ms.