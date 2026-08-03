"use client";

import { useCart } from "@/app/context/cart-context";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  id: string;
  name: string;
  price: number;
  image: string;
  seller: string;
}

export default function AddToCartButton({
  id,
  name,
  price,
  image,
  seller,
}: AddToCartButtonProps) {
  const { addItem } = useCart();

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id,
      name,
      price,
      image,
      seller,
    });
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-[#C4622D] text-white rounded-xl text-sm font-medium hover:bg-[#3D2B1F] transition-all shadow-sm active:scale-95 cursor-pointer"
      aria-label={`Add ${name} to cart`}
    >
      <ShoppingCart className="w-4 h-4" />
      <span>Add to Cart</span>
    </button>
  );
}
