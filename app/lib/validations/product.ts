import { z } from "zod";

// Schema for GET /api/products query parameters
export const productQuerySchema = z
  .object({
    category_id: z.coerce.number().int().positive().optional(),
    product: z.string().trim().optional(),
    seller_id: z.string().trim().optional(),
    min_price: z.coerce
      .number()
      .min(0, "Minimum price must be greater than or equal to 0")
      .optional(),
    max_price: z.coerce
      .number()
      .min(0, "Maximum price must be greater than or equal to 0")
      .optional(),
    sort: z
      .enum(["price-low", "price-high", "newest", "oldest"])
      .default("newest"),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(12),
  })
  .refine(
    (data) => {
      if (data.min_price !== undefined && data.max_price !== undefined) {
        return data.min_price <= data.max_price;
      }
      return true;
    },
    {
      message: "Minimum price cannot exceed maximum price",
      path: ["min_price"],
    },
  );

export type ProductQueryParams = z.infer<typeof productQuerySchema>;