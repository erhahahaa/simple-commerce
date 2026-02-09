import z from "zod";
import { ProductSchema } from "./product";

export const WishlistItemSchema = z.object({
	id: z.string(),
	userId: z.string(),
	productId: z.string(),
	createdAt: z.date(),
});
export type WishlistItem = z.infer<typeof WishlistItemSchema>;

export const WishlistItemWithProductSchema = WishlistItemSchema.extend({
	product: ProductSchema,
});
export type WishlistItemWithProduct = z.infer<
	typeof WishlistItemWithProductSchema
>;

export const AddToWishlistSchema = z.object({
	productId: z.string(),
});
export type AddToWishlist = z.infer<typeof AddToWishlistSchema>;
