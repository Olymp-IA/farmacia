"""
Farmacia AI Service - Pydantic Schemas
Enterprise edition with WMS support.
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime, date


# ============================================================================
# SEARCH SCHEMAS
# ============================================================================

class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)
    tenant_id: UUID
    limit: int = Field(default=10, ge=1, le=100)


class ProductResponse(BaseModel):
    id: UUID
    sku: str
    name: str
    description: Optional[str] = None
    active_principle: str
    is_controlled: bool = False
    image_url: Optional[str] = None
    similarity_score: Optional[float] = None

    class Config:
        from_attributes = True


class SearchResponse(BaseModel):
    query: str
    tenant_id: UUID
    results: List[ProductResponse]
    total: int


# ============================================================================
# WMS SCHEMAS
# ============================================================================

class PickItem(BaseModel):
    product_id: UUID
    quantity: int = Field(..., gt=0)


class PickingRequest(BaseModel):
    branch_id: UUID
    items: List[PickItem]


class BinAllocation(BaseModel):
    batch_id: UUID
    bin_id: Optional[UUID] = None
    bin_code: Optional[str] = None
    zone_name: Optional[str] = None
    quantity: int
    expiry_date: date


class PickingLine(BaseModel):
    product_id: UUID
    allocations: List[BinAllocation]
    total_picked: int


class OptimizedRoute(BaseModel):
    sequence: int
    zone_name: str
    bin_code: str
    batch_id: UUID
    product_id: UUID
    quantity: int


class PickingResponse(BaseModel):
    branch_id: UUID
    lines: List[PickingLine]
    optimized_route: List[OptimizedRoute]
    estimated_time_seconds: int


# ============================================================================
# HEALTH & COMMON
# ============================================================================

class HealthResponse(BaseModel):
    status: str
    database: str
    version: str
    modules: List[str]
