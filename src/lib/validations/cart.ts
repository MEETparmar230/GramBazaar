import z from "zod";

export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Product name is required"),
  price: z.number().min(0, "Price must be non-negative"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const cartSchema = z.object({
  user: z.string().min(1, "User ID is required"),
  items: z.array(cartItemSchema).nonempty("Cart must contain at least one item"),
});

export type CartType = z.infer<typeof cartSchema>;
export type CartItemType = z.infer<typeof cartItemSchema>;