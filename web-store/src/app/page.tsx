import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { Search, Truck, ShieldCheck, Pill } from 'lucide-react';
import Link from 'next/link';

// Mock featured products (in production, fetch from API)
const featuredProducts = [
    { id: '1', sku: 'paracetamol-500', name: 'Paracetamol 500mg', activePrinciple: 'Paracetamol', isControlled: false, imageUrl: null, price: 2990 },
    { id: '2', sku: 'ibuprofeno-400', name: 'Ibuprofeno 400mg', activePrinciple: 'Ibuprofeno', isControlled: false, imageUrl: null, price: 3490 },
    { id: '3', sku: 'omeprazol-20', name: 'Omeprazol 20mg', activePrinciple: 'Omeprazol', isControlled: false, imageUrl: null, price: 5990 },
    { id: '4', sku: 'loratadina-10', name: 'Loratadina 10mg', activePrinciple: 'Loratadina', isControlled: false, imageUrl: null, price: 4290 },
];

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-600 to-primary-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                            Tu salud, nuestra prioridad
                        </h1>
                        <p className="text-lg text-white/80 mb-8">
                            Encuentra los mejores medicamentos con alternativas bioequivalentes.
                            Nuestra IA te sugiere opciones mas economicas con la misma calidad.
                        </p>

                        {/* Hero Search */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar medicamentos..."
                                className="w-full pl-14 pr-6 py-4 bg-white text-primary rounded-soft text-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-accent/30"
                            />
                            <Link
                                href="/search"
                                className="absolute right-2 top-1/2 -translate-y-1/2 btn-accent py-2"
                            >
                                Buscar
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative */}
                <div className="absolute -bottom-1 left-0 right-0">
                    <svg viewBox="0 0 1440 100" fill="none" className="w-full">
                        <path d="M0 100V50C240 83 480 100 720 83C960 67 1200 50 1440 50V100H0Z" fill="#F0F4F8" />
                    </svg>
                </div>
            </section>

            {/* Features */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="card text-center">
                            <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Pill className="w-7 h-7 text-accent" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Bioequivalencia IA</h3>
                            <p className="text-gray-500">Encuentra alternativas mas economicas con la misma eficacia terapeutica.</p>
                        </div>
                        <div className="card text-center">
                            <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Truck className="w-7 h-7 text-accent" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Despacho Rapido</h3>
                            <p className="text-gray-500">Recibe tus medicamentos en 24-48 horas en tu domicilio.</p>
                        </div>
                        <div className="card text-center">
                            <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck className="w-7 h-7 text-accent" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Certificado ISP</h3>
                            <p className="text-gray-500">Todos nuestros productos cumplen con las normativas del ISP.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 bg-background-subtle">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-semibold text-primary">Productos Destacados</h2>
                        <Link href="/search" className="text-accent hover:underline font-medium">
                            Ver todos
                        </Link>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} stock={15} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-primary text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <span className="text-2xl font-semibold">
                            Farmacia<span className="text-accent">Nordic</span>
                        </span>
                        <p className="text-white/60 text-sm">
                            2026 Farmacia Nordic. Powered by OLYMP-IA.cl
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
