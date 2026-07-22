'use client';

import Link from 'next/link';
import Header from '@/app/ui/header';
import Footer from '@/app/ui/footer';
import { useCart } from '@/app/lib/cart-context';
import { Minus, Plus, X } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  return (
    <main>
      <Header />
      <section className="px-6 md:px-12 py-16 bg-[#F5F0E8] min-h-[60vh]">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-8 text-center">Your Cart</h1>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#3D2B1F] opacity-75 text-lg mb-6">Your cart is empty.</p>
              <Link
                href="/shop"
                className="inline-block px-8 py-4 bg-[#C4622D] text-white rounded-full text-lg font-medium hover:bg-[#3D2B1F] transition-all duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-4 bg-[#FDFAF6] rounded-2xl p-4 shadow-md"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-[#3D2B1F]">{item.name}</h3>
                      <p className="text-sm text-[#7C9E87]">by {item.seller}</p>
                      <p className="text-[#C4622D] font-bold">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.name, item.quantity - 1)}
                        className="p-2 rounded-full hover:bg-[#F5F0E8] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4 text-[#3D2B1F]" />
                      </button>
                      <span className="w-6 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.name, item.quantity + 1)}
                        className="p-2 rounded-full hover:bg-[#F5F0E8] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4 text-[#3D2B1F]" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.name)}
                      className="p-2 rounded-full hover:bg-red-100 transition-colors"
                      aria-label={`Remove ${item.name}`}
                    >
                      <X className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-[#FDFAF6] rounded-2xl p-6 shadow-md flex items-center justify-between">
                <span className="text-lg font-bold text-[#3D2B1F]">Subtotal</span>
                <span className="text-2xl font-bold text-[#C4622D]">${subtotal.toFixed(2)}</span>
              </div>

              <button
                className="w-full mt-6 py-4 bg-[#C4622D] text-white rounded-full text-lg font-medium hover:bg-[#3D2B1F] transition-all duration-300 shadow-lg"
              >
                Checkout (Coming Soon)
              </button>
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
