"use client";

import { useState } from "react";
import { Star, Edit, MessageSquarePlus } from "lucide-react";
import { ProductReview } from "@/app/lib/types";

interface ReviewModalProps {
  item: ProductReview;
  userId: string;
  onSaveAction: (formData: FormData) => Promise<void>;
}

export default function ReviewModalButton({
  item,
  onSaveAction,
}: ReviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number>(item.rating ?? 1);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>(item.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = item.has_reviewed;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("productId", item.product_id);
    formData.append("rating", rating.toString());
    formData.append("comment", comment);

    try {
      await onSaveAction(formData);
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
          isEditing
            ? "bg-[#E8DFD3] text-[#2C2C2C] hover:bg-[#D8CFC3]"
            : "bg-[#7C9E87] text-white hover:bg-[#6B8D76]"
        }`}
      >
        {isEditing ? (
          <>
            <Edit className="w-4 h-4" />
            Edit Review
          </>
        ) : (
          <>
            <MessageSquarePlus className="w-4 h-4" />
            Leave Review
          </>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[#F5F0E8] rounded-xl max-w-md w-full p-6 shadow-xl border border-[#E8DFD3] text-[#2C2C2C]">
            <h3 className="text-xl font-bold mb-2">
              {isEditing ? "Edit Your Review" : "Leave a Review"}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{item.product_title}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Rating Selector */}
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>

                <div className="flex items-center gap-3 my-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = star <= (hoverRating || rating);
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 focus:outline-none transition-transform hover:scale-110"
                          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              isFilled
                                ? "text-[#C4622D] fill-[#C4622D]"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <span className="text-xs font-medium text-[#3D2B1F]/70">
                    {rating === 0
                      ? "Select stars (default: 1 star)"
                      : `${rating} out of 5 stars`}
                  </span>
                </div>
              </div>

              {/* Comment Textarea */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Comment{" "}
                  <span className="text-xs text-gray-500">(optional)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="Share your thoughts about this crafted item..."
                  className="w-full p-3 rounded-lg border border-[#E8DFD3] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7C9E87]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-[#E8DFD3] transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg text-sm bg-[#7C9E87] text-white hover:bg-[#6B8D76] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
