"""
Farmacia AI Service - FastAPI Application
Enterprise edition with semantic search and WMS route optimization.
"""
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from contextlib import asynccontextmanager
from typing import List

from database import get_db, check_database_connection, engine
from schemas import (
    SearchRequest, SearchResponse, ProductResponse,
    PickingRequest, PickingResponse, PickingLine, BinAllocation, OptimizedRoute,
    HealthResponse
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    if await check_database_connection():
        print("Database connection established.")
    yield
    await engine.dispose()


app = FastAPI(
    title="Farmacia AI Service",
    description="Enterprise AI microservice: Semantic Search + WMS Optimization",
    version="1.0.0",
    lifespan=lifespan
)


# ============================================================================
# HEALTH CHECK
# ============================================================================

@app.get("/health", response_model=HealthResponse)
async def health_check():
    db_status = "connected" if await check_database_connection() else "disconnected"
    return HealthResponse(
        status="healthy",
        database=db_status,
        version="1.0.0",
        modules=["search", "wms"]
    )


# ============================================================================
# SEMANTIC SEARCH
# ============================================================================

@app.post("/search", response_model=SearchResponse)
async def semantic_search(request: SearchRequest, db: AsyncSession = Depends(get_db)):
    """Semantic product search using pgvector cosine similarity."""
    try:
        sql = text("""
            SELECT 
                p.id, p.sku, p.name, p.description,
                p.active_principle, p.is_controlled, p.image_url,
                1 - (pe.vector <=> (SELECT vector FROM product_embeddings LIMIT 1)) as similarity_score
            FROM products p
            LEFT JOIN product_embeddings pe ON p.id = pe.product_id
            WHERE p.tenant_id = :tenant_id
            AND (
                LOWER(p.name) LIKE LOWER(:query_pattern)
                OR LOWER(p.active_principle) LIKE LOWER(:query_pattern)
            )
            ORDER BY similarity_score DESC NULLS LAST
            LIMIT :limit
        """)

        result = await db.execute(sql, {
            "tenant_id": str(request.tenant_id),
            "query_pattern": f"%{request.query}%",
            "limit": request.limit
        })

        rows = result.fetchall()
        products = [
            ProductResponse(
                id=row.id, sku=row.sku, name=row.name,
                description=row.description, active_principle=row.active_principle,
                is_controlled=row.is_controlled, image_url=row.image_url,
                similarity_score=row.similarity_score
            )
            for row in rows
        ]

        return SearchResponse(
            query=request.query,
            tenant_id=request.tenant_id,
            results=products,
            total=len(products)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


# ============================================================================
# BIOEQUIVALENCE
# ============================================================================

@app.get("/bioequivalents/{product_id}")
async def find_bioequivalents(product_id: str, tenant_id: str, db: AsyncSession = Depends(get_db)):
    """Find products with same active principle."""
    try:
        sql = text("""
            SELECT p2.id, p2.sku, p2.name, p2.active_principle, p2.is_controlled
            FROM products p1
            JOIN products p2 ON p1.active_principle = p2.active_principle
            WHERE p1.id = :product_id AND p2.id != :product_id AND p2.tenant_id = :tenant_id
        """)

        result = await db.execute(sql, {"product_id": product_id, "tenant_id": tenant_id})
        rows = result.fetchall()

        return {
            "source_product_id": product_id,
            "bioequivalents": [dict(row._mapping) for row in rows],
            "total": len(rows)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# WMS ROUTE OPTIMIZATION
# ============================================================================

@app.post("/wms/optimize-route", response_model=PickingResponse)
async def optimize_picking_route(request: PickingRequest, db: AsyncSession = Depends(get_db)):
    """
    Optimize picking route for warehouse operations.
    Uses FEFO for batch selection and zone-based routing.
    """
    try:
        lines = []
        all_allocations = []

        for item in request.items:
            sql = text("""
                SELECT 
                    s.id as stock_id,
                    s.batch_id,
                    s.bin_id,
                    s.quantity,
                    b.expiry_date,
                    bl.code as bin_code,
                    wz.name as zone_name
                FROM inventory_stock s
                JOIN batches b ON s.batch_id = b.id
                LEFT JOIN bin_locations bl ON s.bin_id = bl.id
                LEFT JOIN warehouse_zones wz ON bl.zone_id = wz.id
                WHERE s.branch_id = :branch_id
                AND b.product_id = :product_id
                AND s.quantity > 0
                ORDER BY b.expiry_date ASC, wz.name, bl.code
            """)

            result = await db.execute(sql, {
                "branch_id": str(request.branch_id),
                "product_id": str(item.product_id)
            })

            rows = result.fetchall()
            remaining = item.quantity
            allocations = []

            for row in rows:
                if remaining <= 0:
                    break
                pick_qty = min(remaining, row.quantity)
                allocations.append(BinAllocation(
                    batch_id=row.batch_id,
                    bin_id=row.bin_id,
                    bin_code=row.bin_code,
                    zone_name=row.zone_name,
                    quantity=pick_qty,
                    expiry_date=row.expiry_date
                ))
                all_allocations.append({
                    "product_id": item.product_id,
                    "batch_id": row.batch_id,
                    "bin_id": row.bin_id,
                    "bin_code": row.bin_code or "BULK",
                    "zone_name": row.zone_name or "DEFAULT",
                    "quantity": pick_qty
                })
                remaining -= pick_qty

            lines.append(PickingLine(
                product_id=item.product_id,
                allocations=allocations,
                total_picked=item.quantity - remaining
            ))

        # Sort by zone then bin for optimal walking route
        sorted_allocations = sorted(all_allocations, key=lambda x: (x["zone_name"], x["bin_code"]))
        optimized_route = [
            OptimizedRoute(
                sequence=i + 1,
                zone_name=a["zone_name"],
                bin_code=a["bin_code"],
                batch_id=a["batch_id"],
                product_id=a["product_id"],
                quantity=a["quantity"]
            )
            for i, a in enumerate(sorted_allocations)
        ]

        # Estimate 15 seconds per pick
        estimated_time = len(optimized_route) * 15

        return PickingResponse(
            branch_id=request.branch_id,
            lines=lines,
            optimized_route=optimized_route,
            estimated_time_seconds=estimated_time
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Route optimization failed: {str(e)}")
