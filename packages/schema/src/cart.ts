import { z } from "zod";
import { ProductWithCategorySchema } from "./product";

// ============================================
// Cart Schemas
// ============================================

export const CartItemSchema = z.object({
	id: z.string(),
	cartId: z.string(),
	productId: z.string(),
	quantity: z.number().int().min(1),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type CartItem = z.infer<typeof CartItemSchema>;

export const CartItemWithProductSchema = CartItemSchema.extend({
	product: ProductWithCategorySchema,
});

export type CartItemWithProduct = z.infer<typeof CartItemWithProductSchema>;

export const CartSchema = z.object({
	id: z.string(),
	userId: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type Cart = z.infer<typeof CartSchema>;

export const CartWithItemsSchema = CartSchema.extend({
	items: z.array(CartItemWithProductSchema),
});

export type CartWithItems = z.infer<typeof CartWithItemsSchema>;

export const CartResponseSchema = z.object({
	cart: CartWithItemsSchema.nullable(),
	itemCount: z.number().int(),
	subtotal: z.number().int(), // Total price in cents (IDR)
});

export type CartResponse = z.infer<typeof CartResponseSchema>;

// Input schemas
export const AddToCartSchema = z.object({
	productId: z.string().min(1, "Product ID is required"),
	quantity: z
		.number()
		.int()
		.min(1, "Quantity must be at least 1")
		.max(99, "Maximum quantity is 99")
		.default(1),
});

export type AddToCart = z.infer<typeof AddToCartSchema>;

export const UpdateCartItemSchema = z.object({
	cartItemId: z.string().min(1, "Cart item ID is required"),
	quantity: z
		.number()
		.int()
		.min(1, "Quantity must be at least 1")
		.max(99, "Maximum quantity is 99"),
});

export type UpdateCartItem = z.infer<typeof UpdateCartItemSchema>;

export const RemoveFromCartSchema = z.object({
	cartItemId: z.string().min(1, "Cart item ID is required"),
});

export type RemoveFromCart = z.infer<typeof RemoveFromCartSchema>;
