"use client";
 
import { useState } from "react";
 
export default function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
 
  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSubmitting(true);
 
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          rating,
          comment,
        }),
      });
 
      const data = await res.json();
 
      if (!res.ok) {
        setError(data.error || "Failed to submit review.");
        return;
      }
 
      setComment("");
      setRating(5);
      setSuccess(true);
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }
 
  return (
<form onSubmit={submitReview} className="space-y-3">
<select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="border rounded-md px-3 py-2"
>
<option value={5}>★★★★★</option>
<option value={4}>★★★★☆</option>
<option value={3}>★★★☆☆</option>
<option value={2}>★★☆☆☆</option>
<option value={1}>★☆☆☆☆</option>
</select>
<textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border rounded-md px-3 py-2"
        rows={3}
      />
 
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">Review submitted!</p>}
 
      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 bg-[#C4622D] text-white rounded-full disabled:opacity-60"
>
        {submitting ? "Submitting..." : "Submit Review"}
</button>
</form>
  );
}