'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Navbar from '../../components/Navbar';
import ProductCard from '../../components/ProductCard';
import { searchProducts, SearchResult } from '../../services/ai';
import { Loader2, SearchX } from 'lucide-react';

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || 'demo-tenant';

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;

            setIsLoading(true);
            setError(null);

            try {
                const data = await searchProducts(query, TENANT_ID, 20);
                setResults(data);
            } catch (err) {
                setError('Error al buscar productos');
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
                <p className="text-gray-500">Buscando productos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (results.length === 0 && query) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <SearchX className="w-16 h-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-medium text-gray-600 mb-2">
                    No encontramos resultados para "{query}"
                </h2>
                <p className="text-gray-400">
                    Intenta con otro termino o revisa la ortografia
                </p>
            </div>
        );
    }

    return (
        <>
            <p className="text-gray-500 mb-6">
                {results.length} resultados para "<span className="font-medium text-primary">{query}</span>"
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={{
                            ...product,
                            description: product.description,
                        }}
                        stock={10}
                    />
                ))}
            </div>
        </>
    );
}

export default function SearchPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-semibold text-primary mb-6">
                    Resultados de busqueda
                </h1>

                <Suspense fallback={
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-accent animate-spin" />
                    </div>
                }>
                    <SearchResults />
                </Suspense>
            </main>
        </div>
    );
}
