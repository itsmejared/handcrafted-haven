"use client";

import { useState } from "react";
import { ServiceResponse } from "@/app/lib/types";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteProductButtonProps {
  productTitle: string;
  deleteAction: () => Promise<ServiceResponse<boolean> | unknown>;
}

export default function DeleteProductButton({
  productTitle,
  deleteAction,
}: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAction = async () => {
    if (
      confirm(
        `Are you sure you want to delete "${productTitle}"? This action cannot be undone.`,
      )
    ) {
      setIsDeleting(true);
      try {
        await deleteAction();
      } catch (error) {
        console.error("Error deleting product:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <form action={handleAction} className="inline">
      <button
        type="submit"
        disabled={isDeleting}
        title="Delete Product"
        className="p-2 text-[#C4622D] hover:text-[#3D2B1F] hover:bg-[#C4622D]/20 rounded-lg transition-colors border border-[#C4622D]/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isDeleting ? (
          <Loader2 className="w-4 h-4 animate-spin text-[#C4622D]" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>
    </form>
  );
}
