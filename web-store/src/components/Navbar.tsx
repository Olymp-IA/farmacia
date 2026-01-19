'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../store/cart';
import SearchBar from './SearchBar';

export default function Navbar() {
    const itemCount = useCart((state) => state.getItemCount());

    return (
        <nav className="sticky top-0 z-50 bg-background-paper/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <span className="text-2xl font-semibold text-primary">
                            Farmacia<span className="text-accent">Nordic</span>
                        </span>
                    </Link>

                    {/* Search Bar - Center */}
                    <div className="flex-1 max-w-2xl hidden md:block">
                        <SearchBar />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-500 hover:text-primary transition-colors">
                            <User className="w-6 h-6" />
                        </button>

                        <Link
                            href="/cart"
                            className="relative p-2 text-gray-500 hover:text-primary transition-colors"
                        >
                            <ShoppingCart className="w-6 h-6" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden pb-4">
                    <SearchBar />
                </div>
            </div>
        </nav>
    );
}
