'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, ShoppingCart } from 'lucide-react';
import { useCart } from '@/app/lib/cart-context';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <>
      <div className="h-1 bg-[#7C9E87]"></div>
      <nav className="flex items-center justify-between px-6 md:px-8 py-4 bg-[#FDFAF6] border-b-4 border-[#7C9E87] shadow-md relative">
        <Link href="/" className="text-2xl font-bold text-[#C4622D] shrink-0">
          🧶 Handcrafted Haven
        </Link>

        {/* Desktop links - stretches and spreads across available width */}
        <div className="hidden md:flex flex-1 items-center justify-evenly text-[#3D2B1F] font-medium mx-8">
          <Link href="/" className="hover:text-[#C4622D] transition-colors">Home</Link>
          <Link href="/shop" className="hover:text-[#C4622D] transition-colors">Shop</Link>
          <Link href="/sellers" className="hover:text-[#C4622D] transition-colors">Sellers</Link>
          <Link href="/about" className="hover:text-[#C4622D] transition-colors">About</Link>
          <Link href="/search" aria-label="Search" className="hover:text-[#C4622D] transition-colors">
            <Search className="w-5 h-5" />
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative hover:text-[#C4622D] transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#C4622D] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        <div className="hidden md:flex gap-4 shrink-0">
          <button className="px-4 py-2 text-[#C4622D] border border-[#C4622D] rounded-full hover:bg-[#C4622D] hover:text-white transition-colors">
            Log in
          </button>
          <button className="px-4 py-2 bg-[#C4622D] text-white rounded-full hover:bg-[#3D2B1F] transition-colors">
            Sign up
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#3D2B1F]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>

        {/* Mobile menu panel */}
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 flex flex-col gap-4 bg-[#FDFAF6] border-b-4 border-[#7C9E87] shadow-md px-6 py-6 md:hidden z-50">
            <Link href="/" className="text-[#3D2B1F] font-medium" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/shop" className="text-[#3D2B1F] font-medium" onClick={() => setMenuOpen(false)}>Shop</Link>
            <Link href="/sellers" className="text-[#3D2B1F] font-medium" onClick={() => setMenuOpen(false)}>Sellers</Link>
            <Link href="/about" className="text-[#3D2B1F] font-medium" onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/search" className="text-[#3D2B1F] font-medium flex items-center gap-2" onClick={() => setMenuOpen(false)}>
              <Search className="w-4 h-4" /> Search
            </Link>
            <div className="flex gap-3 pt-2">
              <button className="flex-1 px-4 py-2 text-[#C4622D] border border-[#C4622D] rounded-full">
                Log in
              </button>
              <button className="flex-1 px-4 py-2 bg-[#C4622D] text-white rounded-full">
                Sign up
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
