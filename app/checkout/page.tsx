"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/app/context/cart-context";
import { useAuth } from "@/app/context/auth-context";
import { useToast } from "@/app/context/toast-context";
import { createOrder } from "@/app/services/orders";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  async function handlePlaceOrder() {
    if (!user?.id) return;
    setError("");
    setPlacing(true);

    try {
      // Invocación directa del servicio
      const res = await createOrder(user.id, { items });

      if (!res.success || !res.id) {
        setError("Something went wrong placing your order.");
        setPlacing(false);
        return;
      }

      clearCart();
      showToast(
        "Order placed successfully! Thank you for supporting local artisans.",
        "success",
      );
      router.push(`/orders/${res.id}`);
    } catch (err: unknown) {
      console.error("Checkout error:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
      setPlacing(false);
    }
  }

  if (!user) {
    return (
      <main className="w-full flex-1 max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-[#3D2B1F] mb-6">Please log in to check out.</p>
        <Link
          href="/login?redirect=/checkout"
          className="inline-block px-6 py-3 bg-[#C4622D] text-white rounded-full font-medium"
        >
          Go to login
        </Link>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="w-full flex-1 max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-[#3D2B1F] mb-6">Your cart is empty.</p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-[#C4622D] text-white rounded-full font-medium"
        >
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
        <ArrowLeft className="w-4 h-4" /> Back to cart
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-8">
        Review Your Order
      </h1>

      <div className="bg-[#FDFAF6] border border-[#7C9E87]/20 rounded-2xl p-6 mb-6 shadow-sm">
        {items.map((item) => (
          <div
            key={item.id || item.name}
            className="flex items-center justify-between py-3 border-b border-[#7C9E87]/10 last:border-b-0"
          >
            <div>
              <p className="font-bold text-[#3D2B1F]">{item.name}</p>
              {item.seller && (
                <p className="text-sm text-[#7C9E87]">
                  by {item.seller} &middot; Qty {item.quantity}
                </p>
              )}
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
        onClick={handlePlaceOrder}
        disabled={placing}
        className="w-full flex items-center justify-center gap-2 py-4 bg-[#C4622D] text-white rounded-full text-lg font-medium hover:bg-[#3D2B1F] transition-all duration-300 shadow-lg disabled:opacity-60"
      >
        {placing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Placing order...
          </>
        ) : (
          "Place Order"
        )}
      </button>
      <p className="text-xs text-center text-[#3D2B1F]/60 mt-4">
        This is a demo checkout — no shipping or payment information is
        collected.
      </p>
    </main>
  );
}
