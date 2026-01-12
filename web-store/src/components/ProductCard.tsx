'use client';

import Link from 'next/link';
import { ShoppingCart, AlertTriangle } from 'lucide-react';
import { useCart } from '@/store/cart';
import type { Product } from '@/services/api';

interface ProductCardProps {
    product: Product;
    stock?: number;
}

export default function ProductCard({ product, stock = 0 }: ProductCardProps) {
    const addItem = useCart((state) => state.addItem);
    const price = product.price || 9990;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem({
            id: product.id,
            name: product.name,
            price,
            imageUrl: product.imageUrl,
            isControlled: product.isControlled,
        });
    };

    return (
        <Link
            href={`/product/${product.sku}`}
            className="card group hover:shadow-lg transition-all duration-300"
        >
            {/* Image */}
            <div className="aspect-square bg-background-subtle rounded-soft mb-4 overflow-hidden relative">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <span className="text-5xl">💊</span>
                    </div>
                )}

                {/* Controlled Drug Badge */}
                {product.isControlled && (
                    <div className="absolute top-2 left-2 bg-accent text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Requiere Receta
                    </div>
                )}

                {/* Stock Badge */}
                <div className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-full ${stock > 10 ? 'bg-green-100 text-green-700' :
                        stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                    }`}>
                    {stock > 0 ? `${stock} disponibles` : 'Agotado'}
                </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {product.activePrinciple}
                </p>
                <h3 className="font-medium text-primary group-hover:text-accent transition-colors line-clamp-2">
                    {product.name}
                </h3>

                <div className="flex items-center justify-between pt-2">
                    <span className="text-xl font-semibold text-primary">
                        ${price.toLocaleString('es-CL')}
                    </span>

                    <button
                        onClick={handleAddToCart}
                        disabled={stock === 0}
                        className={`p-2 rounded-full transition-all duration-200 ${stock > 0
                                ? 'bg-primary text-white hover:bg-primary-600 hover:scale-110'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </Link>
    );
}
