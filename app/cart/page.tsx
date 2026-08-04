"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/context/cart-context";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const [mounted, setMounted] = useState(false);

  // Evita el error de hidratación esperando a que el componente se monte en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mientras se hidrata el cliente, mostramos un estado neutro o esqueleto
  if (!mounted) {
    return (
      <main className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
          <div className="h-8 bg-[#7C9E87]/20 rounded w-48 mb-8"></div>
          <div className="h-24 bg-[#FDFAF6] rounded-2xl border border-[#7C9E87]/20"></div>
          <div className="h-24 bg-[#FDFAF6] rounded-2xl border border-[#7C9E87]/20"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#7C9E87]/20 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F]">
            Shopping Cart
          </h1>
          <p className="text-[#3D2B1F]/70 text-sm mt-1">
            {items.length === 1
              ? "1 handcrafted item in your cart"
              : `${items.length} handcrafted items in your cart`}
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#C4622D] hover:text-[#3D2B1F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>

      {items.length === 0 ? (
        /* Empty Cart State */
        <div className="bg-[#FDFAF6] border border-[#7C9E87]/20 rounded-3xl p-12 text-center max-w-xl mx-auto my-8 shadow-sm">
          <div className="w-20 h-20 bg-[#F5F0E8] rounded-full flex items-center justify-center mx-auto mb-6 text-[#C4622D]">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#3D2B1F] mb-2">
            Your cart is empty
          </h2>
          <p className="text-[#3D2B1F]/70 mb-8 max-w-md mx-auto">
            Looks like you haven&apos;t added any unique handcrafted treasures
            to your cart yet.
          </p>
          <Link
            href="/shop"
            className="inline-block px-8 py-4 bg-[#C4622D] text-white rounded-full font-medium hover:bg-[#3D2B1F] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        /* Cart items and summary layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items List (Left / Main column) */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const itemId = item.id || item.name;

              return (
                <div
                  key={itemId}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#FDFAF6] border border-[#7C9E87]/20 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#F5F0E8] shrink-0 border border-[#7C9E87]/20">
                    <Image
                      src={item.image || "/products/placeholder.webp"}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                      unoptimized={item.image?.startsWith("data:")}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#3D2B1F] text-lg truncate">
                      {item.name}
                    </h3>
                    {item.seller && (
                      <p className="text-xs sm:text-sm text-[#7C9E87] font-medium">
                        by {item.seller}
                      </p>
                    )}
                    <p className="text-[#C4622D] font-bold text-lg mt-1">
                      ${Number(item.price).toFixed(2)}
                    </p>
                  </div>

                  {/* Controls: Quantity & Remove */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#7C9E87]/10">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-1 bg-[#F5F0E8] border border-[#7C9E87]/30 rounded-full p-1">
                      <button
                        onClick={() =>
                          updateQuantity(itemId, Math.max(1, item.quantity - 1))
                        }
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#3D2B1F] hover:bg-[#C4622D] hover:text-white transition-colors shadow-sm disabled:opacity-50"
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-8 text-center font-bold text-sm text-[#3D2B1F]">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(itemId, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#3D2B1F] hover:bg-[#C4622D] hover:text-white transition-colors shadow-sm"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => removeItem(itemId)}
                      className="p-2 rounded-xl text-[#C4622D] hover:text-red-700 hover:bg-red-50 transition-colors"
                      title="Remove item"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#FDFAF6] border border-[#7C9E87]/20 rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-[#3D2B1F] mb-6 border-b border-[#7C9E87]/20 pb-4">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm text-[#3D2B1F]">
                <div className="flex justify-between items-center">
                  <span className="opacity-80">Subtotal</span>
                  <span className="font-semibold text-base">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="opacity-80">Estimated Shipping</span>
                  <span className="text-[#7C9E87] font-medium">Free</span>
                </div>

                <div className="border-t border-[#7C9E87]/20 pt-4 flex justify-between items-center">
                  <span className="text-base font-bold text-[#3D2B1F]">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-[#C4622D]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                disabled
                className="w-full mt-6 py-4 bg-[#C4622D] text-white rounded-full text-base font-medium hover:bg-[#3D2B1F] transition-all duration-300 shadow-md disabled:opacity-75 disabled:cursor-not-allowed"
              >
                Checkout (Coming Soon)
              </button>

              <p className="text-xs text-center text-[#3D2B1F]/60 mt-4">
                🔒 Secure checkout powered by Handcrafted Haven
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
