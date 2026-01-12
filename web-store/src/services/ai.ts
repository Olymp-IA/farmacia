const AI_BASE_URL = process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:8000';

interface SearchResult {
    id: string;
    sku: string;
    name: string;
    description: string | null;
    activePrinciple: string;
    isControlled: boolean;
    imageUrl: string | null;
    similarityScore: number | null;
}

interface SearchResponse {
    query: string;
    tenantId: string;
    results: SearchResult[];
    total: number;
}

export async function searchProducts(
    query: string,
    tenantId: string,
    limit = 10
): Promise<SearchResult[]> {
    const response = await fetch(`${AI_BASE_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, tenant_id: tenantId, limit }),
    });

    if (!response.ok) {
        throw new Error('Search failed');
    }

    const data: SearchResponse = await response.json();
    return data.results;
}

export async function getSuggestions(query: string, tenantId: string): Promise<string[]> {
    if (query.length < 2) return [];

    try {
        const results = await searchProducts(query, tenantId, 5);
        return results.map(r => r.name);
    } catch {
        return [];
    }
}

export type { SearchResult, SearchResponse };
