"use client";

import { Trash2 } from "lucide-react";

interface DeleteReviewButtonProps {
  reviewId: string;
  onDeleteAction: (formData: FormData) => Promise<void>;
}

export default function DeleteReviewButton({
  reviewId,
  onDeleteAction,
}: DeleteReviewButtonProps) {
  return (
    <form action={onDeleteAction}>
      <input type="hidden" name="reviewId" value={reviewId} />
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm("Are you sure you want to delete this review?")) {
            e.preventDefault();
          }
        }}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        title="Delete Review"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </form>
  );
}
