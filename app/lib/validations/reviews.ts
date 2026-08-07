import { z } from "zod";

export const reviewSchema = z.object({
  productId: z.string().uuid({ message: "Invalid product ID format." }),
  rating: z
    .number()
    .int()
    .min(1, { message: "Rating must be at least 1 star." })
    .max(5, { message: "Rating cannot exceed 5 stars." }),
  comment: z
    .string()
    .max(500, { message: "Comment must be under 500 characters." })
    .optional()
    .nullable(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
