'use client';

import { useCart } from '@/app/lib/cart-context';
import { useAuth } from '@/app/lib/auth-context';
import { useRouter } from 'next/navigation';

interface AddToCartButtonProps {
  name: string;
  price: number;
  image: string;
  seller: string;
}

export default function AddToCartButton({ name, price, image, seller }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  function handleClick(e: React.MouseEvent) {
    // Prevent this click from bubbling up to any parent Link or card-level handler
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push('/login');
      return;
    }

    addItem({ name, price, image, seller });
  }

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-[#C4622D] text-white rounded-full text-sm hover:bg-[#3D2B1F] transition-colors"
    >
      Add to Cart
    </button>
  );
}
