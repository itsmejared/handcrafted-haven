"use client";

import { useState } from "react";
import { Review } from "@/app/lib/types";

interface ProductReviewsCarouselProps {
  reviews: Review[];
}

export default function ProductReviewsCarousel({
  reviews,
}: ProductReviewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!reviews || reviews.length === 0) {
    return (
      <div className="my-6 p-5 bg-[#FDFAF6] border border-[#7C9E87]/30 rounded-xl text-center">
        <p className="text-[#3D2B1F]/70 text-sm italic">
          No reviews yet for this product.
        </p>
      </div>
    );
  }

  const currentReview = reviews[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <div className="my-6 p-5 bg-[#FDFAF6] border border-[#7C9E87]/30 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-[#3D2B1F] uppercase tracking-wider">
          Product Reviews ({reviews.length})
        </h3>

        {reviews.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              type="button"
              className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F5F0E8] text-[#3D2B1F] hover:bg-[#7C9E87] hover:text-white transition-colors text-xs font-bold"
              aria-label="Previous review"
            >
              ←
            </button>
            <span className="text-xs text-[#3D2B1F]/60">
              {currentIndex + 1} / {reviews.length}
            </span>
            <button
              onClick={handleNext}
              type="button"
              className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F5F0E8] text-[#3D2B1F] hover:bg-[#7C9E87] hover:text-white transition-colors text-xs font-bold"
              aria-label="Next review"
            >
              →
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-1 text-amber-500 text-sm">
          {"★".repeat(currentReview.rating)}
          {"☆".repeat(5 - currentReview.rating)}
        </div>

        <p className="text-sm text-[#3D2B1F]/90 italic">
          "{currentReview.comment || "No written review provided."}"
        </p>

        <div className="flex items-center justify-between text-xs text-[#3D2B1F]/60 pt-2">
          <span className="font-medium text-[#3D2B1F]">
            — {currentReview.reviewer_name}
          </span>
          <span>
            {new Date(currentReview.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
