import { db } from "@simple-commerce/db";
import { cart, cartItem, product } from "@simple-commerce/db/schema";
import {
	AddToCartSchema,
	CartResponseSchema,
	RemoveFromCartSchema,
	UpdateCartItemSchema,
} from "@simple-commerce/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { protectedProcedure } from "../index";

// Helper function to get or create cart for user
async function getOrCreateCart(userId: string) {
	const existingCart = await db.query.cart.findFirst({
		where: eq(cart.userId, userId),
	});

	if (existingCart) {
		return existingCart;
	}

	const id = `cart_${crypto.randomUUID()}`;
	const [newCart] = await db.insert(cart).values({ id, userId }).returning();

	if (!newCart) {
		throw new Error("Failed to create cart");
	}

	return newCart;
}

// Helper function to calculate cart totals
function calculateCartTotals(
	items: Array<{ quantity: number; product: { price: number } }>,
) {
	const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
	const subtotal = items.reduce(
		(sum, item) => sum + item.quantity * item.product.price,
		0,
	);
	return { itemCount, subtotal };
}

export const cartRouter = {
	/**
	 * Get current user's cart with items
	 */
	get: protectedProcedure
		.output(CartResponseSchema)
		.handler(async ({ context }) => {
			const userId = context.session.user.id;

			const userCart = await db.query.cart.findFirst({
				where: eq(cart.userId, userId),
				with: {
					items: {
						with: {
							product: {
								with: {
									category: true,
								},
							},
						},
					},
				},
			});

			if (!userCart || userCart.items.length === 0) {
				return {
					cart: null,
					itemCount: 0,
					subtotal: 0,
				};
			}

			const { itemCount, subtotal } = calculateCartTotals(userCart.items);

			return {
				cart: userCart,
				itemCount,
				subtotal,
			};
		}),

	/**
	 * Add product to cart
	 */
	addItem: protectedProcedure
		.input(AddToCartSchema)
		.output(CartResponseSchema)
		.handler(async ({ context, input }) => {
			const userId = context.session.user.id;
			const { productId, quantity } = input;

			// Check if product exists and has stock
			const productData = await db.query.product.findFirst({
				where: eq(product.id, productId),
			});

			if (!productData) {
				throw new Error("Product not found");
			}

			if (productData.stock < quantity) {
				throw new Error("Insufficient stock");
			}

			// Get or create cart
			const userCart = await getOrCreateCart(userId);

			// Check if item already in cart
			const existingItem = await db.query.cartItem.findFirst({
				where: and(
					eq(cartItem.cartId, userCart.id),
					eq(cartItem.productId, productId),
				),
			});

			if (existingItem) {
				// Update quantity
				const newQuantity = existingItem.quantity + quantity;
				if (newQuantity > productData.stock) {
					throw new Error("Insufficient stock");
				}

				await db
					.update(cartItem)
					.set({ quantity: newQuantity, updatedAt: new Date() })
					.where(eq(cartItem.id, existingItem.id));
			} else {
				// Add new item
				const id = `ci_${crypto.randomUUID()}`;
				await db.insert(cartItem).values({
					id,
					cartId: userCart.id,
					productId,
					quantity,
				});
			}

			// Return updated cart
			const updatedCart = await db.query.cart.findFirst({
				where: eq(cart.id, userCart.id),
				with: {
					items: {
						with: {
							product: {
								with: {
									category: true,
								},
							},
						},
					},
				},
			});

			const { itemCount, subtotal } = calculateCartTotals(
				updatedCart?.items ?? [],
			);

			return {
				cart: updatedCart ?? null,
				itemCount,
				subtotal,
			};
		}),

	/**
	 * Update cart item quantity
	 */
	updateItem: protectedProcedure
		.input(UpdateCartItemSchema)
		.output(CartResponseSchema)
		.handler(async ({ context, input }) => {
			const userId = context.session.user.id;
			const { cartItemId, quantity } = input;

			// Get cart item and verify ownership
			const item = await db.query.cartItem.findFirst({
				where: eq(cartItem.id, cartItemId),
				with: {
					cart: true,
					product: true,
				},
			});

			if (!item || item.cart.userId !== userId) {
				throw new Error("Cart item not found");
			}

			if (quantity > item.product.stock) {
				throw new Error("Insufficient stock");
			}

			// Update quantity
			await db
				.update(cartItem)
				.set({ quantity, updatedAt: new Date() })
				.where(eq(cartItem.id, cartItemId));

			// Return updated cart
			const updatedCart = await db.query.cart.findFirst({
				where: eq(cart.userId, userId),
				with: {
					items: {
						with: {
							product: {
								with: {
									category: true,
								},
							},
						},
					},
				},
			});

			const { itemCount, subtotal } = calculateCartTotals(
				updatedCart?.items ?? [],
			);

			return {
				cart: updatedCart ?? null,
				itemCount,
				subtotal,
			};
		}),

	/**
	 * Remove item from cart
	 */
	removeItem: protectedProcedure
		.input(RemoveFromCartSchema)
		.output(CartResponseSchema)
		.handler(async ({ context, input }) => {
			const userId = context.session.user.id;
			const { cartItemId } = input;

			// Get cart item and verify ownership
			const item = await db.query.cartItem.findFirst({
				where: eq(cartItem.id, cartItemId),
				with: {
					cart: true,
				},
			});

			if (!item || item.cart.userId !== userId) {
				throw new Error("Cart item not found");
			}

			// Remove item
			await db.delete(cartItem).where(eq(cartItem.id, cartItemId));

			// Return updated cart
			const updatedCart = await db.query.cart.findFirst({
				where: eq(cart.userId, userId),
				with: {
					items: {
						with: {
							product: {
								with: {
									category: true,
								},
							},
						},
					},
				},
			});

			const { itemCount, subtotal } = calculateCartTotals(
				updatedCart?.items ?? [],
			);

			return {
				cart: updatedCart ?? null,
				itemCount,
				subtotal,
			};
		}),

	/**
	 * Clear all items from cart
	 */
	clear: protectedProcedure
		.output(z.object({ success: z.boolean() }))
		.handler(async ({ context }) => {
			const userId = context.session.user.id;

			const userCart = await db.query.cart.findFirst({
				where: eq(cart.userId, userId),
			});

			if (userCart) {
				await db.delete(cartItem).where(eq(cartItem.cartId, userCart.id));
			}

			return { success: true };
		}),

	/**
	 * Get cart item count (quick check)
	 */
	count: protectedProcedure
		.output(z.object({ count: z.number().int() }))
		.handler(async ({ context }) => {
			const userId = context.session.user.id;

			const userCart = await db.query.cart.findFirst({
				where: eq(cart.userId, userId),
				with: {
					items: true,
				},
			});

			const count =
				userCart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

			return { count };
		}),
};
