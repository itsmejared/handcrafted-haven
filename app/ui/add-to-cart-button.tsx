'use client';

import { useCart } from '@/app/lib/cart-context';

interface AddToCartButtonProps {
  name: string;
  price: number;
  image: string;
  seller: string;
}

export default function AddToCartButton({ name, price, image, seller }: AddToCartButtonProps) {
  const { addItem } = useCart();

  return (
    <button
      onClick={() => addItem({ name, price, image, seller })}
      className="px-4 py-2 bg-[#C4622D] text-white rounded-full text-sm hover:bg-[#3D2B1F] transition-colors"
    >
      Add to Cart
    </button>
  );
}
