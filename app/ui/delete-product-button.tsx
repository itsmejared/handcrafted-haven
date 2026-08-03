"use client";

import { Trash2 } from "lucide-react";

interface DeleteProductButtonProps {
  productId: string;
  productTitle: string;
  deleteAction: (formData: FormData) => Promise<void>;
}

export default function DeleteProductButton({
  productId,
  productTitle,
  deleteAction,
}: DeleteProductButtonProps) {
  return (
    <form
      action={deleteAction}
      onSubmit={(e) => {
        if (
          !confirm(
            `Are you sure you want to delete "${productTitle}"? This action cannot be undone.`,
          )
        ) {
          e.preventDefault();
        }
      }}
      className="inline"
    >
      <input type="hidden" name="productId" value={productId} />
      <button
        type="submit"
        title="Delete Product"
        className="p-2 text-[#C4622D] hover:text-[#3D2B1F] hover:bg-[#C4622D]/20 rounded-lg transition-colors border border-[#C4622D]/30 cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </form>
  );
}
