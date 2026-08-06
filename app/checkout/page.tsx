"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/app/context/cart-context";
import { useAuth } from "@/app/context/auth-context";
import { ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  async function placeOrder() {
    setError("");
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong placing your order.");
        setPlacing(false);
        return;
      }
      clearCart();
      router.push(`/orders/${data.id}`);
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Something went wrong. Please try again.");
      setPlacing(false);
    }
  }

  if (!user) {
    return (
      <main className="w-full flex-1 max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-[#3D2B1F] mb-6">Please log in to check out.</p>
        <Link href="/login" className="text-[#C4622D] hover:underline">
          Go to login
        </Link>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="w-full flex-1 max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-[#3D2B1F] mb-6">Your cart is empty.</p>
        <Link href="/shop" className="text-[#C4622D] hover:underline">
          Browse the shop
        </Link>
      </main>
    );
  }

  return (
    <main className="w-full flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-sm font-medium text-[#C4622D] hover:text-[#3D2B1F] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to cart
      </Link>

      <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-8">
        Review Your Order
      </h1>

      <div className="bg-[#FDFAF6] border border-[#7C9E87]/20 rounded-2xl p-6 mb-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-3 border-b border-[#7C9E87]/10 last:border-b-0"
          >
            <div>
              <p className="font-bold text-[#3D2B1F]">{item.name}</p>
              <p className="text-sm text-[#7C9E87]">
                by {item.seller} &middot; Qty {item.quantity}
              </p>
            </div>
            <span className="font-semibold text-[#C4622D]">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        <div className="flex justify-between items-center pt-4 mt-2 border-t border-[#7C9E87]/20">
          <span className="text-lg font-bold text-[#3D2B1F]">Total</span>
          <span className="text-2xl font-bold text-[#C4622D]">
            ${subtotal.toFixed(2)}
          </span>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        onClick={placeOrder}
        disabled={placing}
        className="w-full py-4 bg-[#C4622D] text-white rounded-full text-lg font-medium hover:bg-[#3D2B1F] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {placing ? "Placing order..." : "Place Order"}
      </button>
      <p className="text-xs text-center text-[#3D2B1F]/60 mt-4">
        This is a demo checkout — no shipping or payment information is collected.
      </p>
    </main>
  );
}
