import { z } from "zod";

// Regex helper to support both HTTP URLs and Base64 Data URIs
const imageUrlOrBase64 = z
  .string()
  .trim()
  .refine(
    (val) => {
      const isUrl = /^https?:\/\/.+/i.test(val);
      const isBase64 =
        /^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,/.test(val);
      const isRelativePath = /^\/[^\s]+\.(png|jpeg|jpg|webp|gif|svg)$/i.test(
        val,
      );
      return isUrl || isBase64 || isRelativePath;
    },
    {
      message:
        "Image must be a valid URL, relative path (/product/...), or a Base64 data string",
    },
  );

// Base Product Schema matching PostgreSQL table
export const productSchema = z.object({
  id: z.uuid("Invalid product ID format"),
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title cannot exceed 255 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  image_url: imageUrlOrBase64,
  // Hacemos image_alt opcional en el schema de entrada para permitir que el server ponga el title por defecto
  image_alt: z.string().trim().optional(),
  seller_id: z.uuid("Invalid seller selected."),
  category_id: z.coerce.number().int().positive("Invalid category selected."),
  created_at: z.string().optional(),
});

// Schema for POST (Creating a new product)
export const createProductSchema = productSchema.omit({
  id: true,
  seller_id: true,
  created_at: true,
});

// Schema for PUT (Updating an existing product)
export const updateProductSchema = createProductSchema.partial();

// Schema for DELETE / GET single product by ID
export const productIdSchema = z.object({
  id: z.uuid("Invalid product ID format"),
});

// Schema for GET /products query parameters
export const productQuerySchema = z
  .object({
    category_id: z.coerce.number().int().positive().optional(),
    product: z.string().trim().optional(),
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

// TypeScript Types inferred from Zod Schemas
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryParams = z.infer<typeof productQuerySchema>;
