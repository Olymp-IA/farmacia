'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useCart } from '@/store/cart';
import { ShoppingCart, AlertTriangle, Upload, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Mock product data (in production, fetch by slug)
const mockProduct = {
    id: '1',
    sku: 'paracetamol-500',
    name: 'Paracetamol 500mg',
    description: 'Analgesico y antipiretico de uso comun. Alivia el dolor leve a moderado y reduce la fiebre. Presentacion en caja de 20 comprimidos.',
    activePrinciple: 'Paracetamol',
    laboratory: 'Lab Genericos SA',
    isControlled: false,
    imageUrl: null,
    price: 2990,
    stock: 45,
};

const mockBioequivalents = [
    { id: '2', name: 'Tapsin 500mg', laboratory: 'Maver', price: 4990 },
    { id: '3', name: 'Zolben 500mg', laboratory: 'Saval', price: 3490 },
];

export default function ProductPage({ params }: { params: { slug: string } }) {
    const [quantity, setQuantity] = useState(1);
    const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);
    const addItem = useCart((state) => state.addItem);

    const product = mockProduct; // In production: fetch by params.slug

    const handleAddToCart = () => {
        if (product.isControlled && !prescriptionUploaded) {
            return;
        }

        for (let i = 0; i < quantity; i++) {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                isControlled: product.isControlled,
                prescriptionUploaded,
            });
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // In production: upload to server
            setPrescriptionUploaded(true);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </Link>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Image */}
                    <div className="aspect-square bg-background-paper rounded-card shadow-soft flex items-center justify-center">
                        {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="max-h-full" />
                        ) : (
                            <span className="text-9xl">💊</span>
                        )}
                    </div>

                    {/* Details */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                                {product.activePrinciple} - {product.laboratory}
                            </p>
                            <h1 className="text-3xl font-semibold text-primary">
                                {product.name}
                            </h1>
                        </div>

                        {product.isControlled && (
                            <div className="bg-accent/10 border border-accent/30 rounded-soft p-4 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-accent">Medicamento con receta</p>
                                    <p className="text-sm text-gray-600">
                                        Este producto requiere receta medica para su compra.
                                    </p>
                                </div>
                            </div>
                        )}

                        <p className="text-gray-600 leading-relaxed">
                            {product.description}
                        </p>

                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-bold text-primary">
                                ${product.price.toLocaleString('es-CL')}
                            </span>
                            <span className={`text-sm font-medium ${product.stock > 10 ? 'text-green-600' : 'text-yellow-600'
                                }`}>
                                {product.stock} unidades disponibles
                            </span>
                        </div>

                        {/* Prescription Upload (for controlled drugs) */}
                        {product.isControlled && (
                            <div className="border-2 border-dashed border-gray-200 rounded-soft p-6">
                                {prescriptionUploaded ? (
                                    <div className="flex items-center gap-3 text-green-600">
                                        <Check className="w-6 h-6" />
                                        <span className="font-medium">Receta subida correctamente</span>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center cursor-pointer">
                                        <Upload className="w-10 h-10 text-gray-400 mb-2" />
                                        <span className="font-medium text-primary">Subir Receta</span>
                                        <span className="text-sm text-gray-400">JPG, PNG o PDF</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*,.pdf"
                                            onChange={handleFileUpload}
                                        />
                                    </label>
                                )}
                            </div>
                        )}

                        {/* Quantity & Add to Cart */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border border-gray-200 rounded-soft">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 text-xl hover:bg-gray-50"
                                >
                                    -
                                </button>
                                <span className="px-4 py-2 font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 py-2 text-xl hover:bg-gray-50"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={product.isControlled && !prescriptionUploaded}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-soft font-medium transition-all ${product.isControlled && !prescriptionUploaded
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'btn-primary'
                                    }`}
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {product.isControlled && !prescriptionUploaded
                                    ? 'Sube la receta primero'
                                    : 'Agregar al carrito'}
                            </button>
                        </div>

                        {/* Bioequivalents */}
                        {mockBioequivalents.length > 0 && (
                            <div className="border-t pt-6">
                                <h3 className="font-semibold text-primary mb-4">
                                    Alternativas Bioequivalentes
                                </h3>
                                <div className="space-y-3">
                                    {mockBioequivalents.map((alt) => (
                                        <div
                                            key={alt.id}
                                            className="flex items-center justify-between p-3 bg-background-subtle rounded-soft"
                                        >
                                            <div>
                                                <p className="font-medium">{alt.name}</p>
                                                <p className="text-sm text-gray-500">{alt.laboratory}</p>
                                            </div>
                                            <span className="font-semibold">${alt.price.toLocaleString('es-CL')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
