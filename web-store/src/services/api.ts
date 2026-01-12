const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface FetchOptions extends RequestInit {
    token?: string;
}

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
}

// Product Types
export interface Product {
    id: string;
    sku: string;
    name: string;
    description: string | null;
    activePrinciple: string;
    isControlled: boolean;
    imageUrl: string | null;
    price?: number;
    stock?: number;
}

export interface ProductsResponse {
    data: Product[];
    total: number;
    page: number;
    pageSize: number;
}

// API Functions
export async function getProducts(page = 0, size = 20): Promise<ProductsResponse> {
    return fetchApi<ProductsResponse>(`/products?page=${page}&size=${size}`);
}

export async function getProductBySlug(slug: string): Promise<Product> {
    return fetchApi<Product>(`/products/${slug}`);
}

export async function getProductStock(productId: string, branchId?: string): Promise<number> {
    const params = branchId ? `?branchId=${branchId}` : '';
    const response = await fetchApi<{ stock: number }>(`/inventory/stock/${productId}${params}`);
    return response.stock;
}

export async function getBioequivalents(productId: string): Promise<Product[]> {
    const response = await fetchApi<{ bioequivalents: Product[] }>(`/products/${productId}/bioequivalents`);
    return response.bioequivalents;
}

export { fetchApi };
