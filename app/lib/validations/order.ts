import { z } from "zod";

export const checkoutItemSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1, "Product name is required"),
  price: z.number().positive("Price must be greater than 0"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  image: z.string().optional(),
  seller: z.string().optional(),
});

export const createOrderSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, "Cart cannot be empty"),
});

export type CheckoutItem = z.infer<typeof checkoutItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
