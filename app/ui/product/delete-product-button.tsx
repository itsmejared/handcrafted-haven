"use client";

import { ServiceResponse } from "@/app/lib/types";
import { Trash2 } from "lucide-react";

interface DeleteProductButtonProps {
  productTitle: string;
  deleteAction: () => Promise<ServiceResponse<boolean> | unknown>;
}

export default function DeleteProductButton({
  productTitle,
  deleteAction,
}: DeleteProductButtonProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      confirm(
        `Are you sure you want to delete "${productTitle}"? This action cannot be undone.`,
      )
    ) {
      await deleteAction();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="inline">
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
