'use client';

import Navbar from '../../components/Navbar';
import { useCart } from '../../store/cart';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
    const { items, updateQuantity, removeItem, getTotal, clearCart } = useCart();

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="max-w-3xl mx-auto px-4 py-20 text-center">
                    <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                    <h1 className="text-2xl font-semibold text-primary mb-4">
                        Tu carrito esta vacio
                    </h1>
                    <p className="text-gray-500 mb-8">
                        Agrega productos para comenzar tu compra
                    </p>
                    <Link href="/" className="btn-primary inline-flex items-center gap-2">
                        Explorar productos
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-semibold text-primary mb-8">
                    Tu Carrito
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="card flex gap-4">
                                {/* Image */}
                                <div className="w-24 h-24 bg-background-subtle rounded-soft flex-shrink-0 flex items-center justify-center">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.name} className="max-h-full" />
                                    ) : (
                                        <span className="text-4xl">💊</span>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h3 className="font-medium text-primary">{item.name}</h3>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {item.isControlled && (
                                        <p className="text-xs text-accent mt-1">
                                            {item.prescriptionUploaded ? 'Receta subida' : 'Requiere receta'}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center border border-gray-200 rounded-soft">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-2 hover:bg-gray-50"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="px-3 font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-2 hover:bg-gray-50"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <span className="font-semibold text-primary">
                                            ${(item.price * item.quantity).toLocaleString('es-CL')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-24">
                            <h2 className="font-semibold text-lg mb-4">Resumen</h2>

                            <div className="space-y-3 border-b pb-4 mb-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${getTotal().toLocaleString('es-CL')}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Envio</span>
                                    <span>Gratis</span>
                                </div>
                            </div>

                            <div className="flex justify-between font-semibold text-lg mb-6">
                                <span>Total</span>
                                <span>${getTotal().toLocaleString('es-CL')}</span>
                            </div>

                            <button className="btn-primary w-full mb-3">
                                Proceder al pago
                            </button>

                            <button
                                onClick={clearCart}
                                className="btn-outline w-full text-sm"
                            >
                                Vaciar carrito
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
