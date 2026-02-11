import { db } from "@simple-commerce/db";
import { cart, cartItem, product } from "@simple-commerce/db/schema";
import {
	AddToCartSchema,
	CartResponseSchema,
	RemoveFromCartSchema,
	UpdateCartItemSchema,
} from "@simple-commerce/schema";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { protectedProcedure } from "../index";

// Helper function to get or create cart for user (must be called within a transaction)
async function getOrCreateCart(
	tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
	userId: string,
) {
	// First try to find existing cart
	const existingCart = await tx.query.cart.findFirst({
		where: eq(cart.userId, userId),
	});

	if (existingCart) {
		return existingCart;
	}

	// Create new cart - the unique constraint on userId will prevent duplicates
	// if there's a race condition, one insert will fail
	const id = `cart_${crypto.randomUUID()}`;
	try {
		const [newCart] = await tx.insert(cart).values({ id, userId }).returning();

		if (!newCart) {
			throw new Error("Failed to create cart");
		}

		return newCart;
	} catch (error) {
		// If insert failed due to unique constraint, fetch the existing cart
		const existingCart = await tx.query.cart.findFirst({
			where: eq(cart.userId, userId),
		});

		if (existingCart) {
			return existingCart;
		}

		throw new Error("Failed to create cart");
	}
}

// Helper function to fetch cart with items (eliminates duplicate code)
async function fetchCartWithItems(
	tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
	userId: string,
) {
	return tx.query.cart.findFirst({
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

			return db.transaction(async (tx) => {
				// Check if product exists and has stock
				const productData = await tx.query.product.findFirst({
					where: eq(product.id, productId),
				});

				if (!productData) {
					throw new Error(`Product not found (ID: ${productId})`);
				}

				if (productData.stock < quantity) {
					throw new Error(
						`Insufficient stock for "${productData.name}". Only ${productData.stock} available, requested ${quantity}.`,
					);
				}

				// Get or create cart (atomic within transaction)
				const userCart = await getOrCreateCart(tx, userId);

				// Check if item already in cart
				const existingItem = await tx.query.cartItem.findFirst({
					where: and(
						eq(cartItem.cartId, userCart.id),
						eq(cartItem.productId, productId),
					),
				});

				if (existingItem) {
					// Update quantity
					const newQuantity = existingItem.quantity + quantity;
					if (newQuantity > productData.stock) {
						throw new Error(
							`Insufficient stock for "${productData.name}". Only ${productData.stock} available, but cart would have ${newQuantity}.`,
						);
					}

					await tx
						.update(cartItem)
						.set({ quantity: newQuantity, updatedAt: new Date() })
						.where(eq(cartItem.id, existingItem.id));
				} else {
					// Add new item
					const id = `ci_${crypto.randomUUID()}`;
					await tx.insert(cartItem).values({
						id,
						cartId: userCart.id,
						productId,
						quantity,
					});
				}

				// Return updated cart
				const updatedCart = await fetchCartWithItems(tx, userId);

				const { itemCount, subtotal } = calculateCartTotals(
					updatedCart?.items ?? [],
				);

				return {
					cart: updatedCart ?? null,
					itemCount,
					subtotal,
				};
			});
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

			return db.transaction(async (tx) => {
				// Get cart item and verify ownership
				const item = await tx.query.cartItem.findFirst({
					where: eq(cartItem.id, cartItemId),
					with: {
						cart: true,
						product: true,
					},
				});

				if (!item || item.cart.userId !== userId) {
					throw new Error(`Cart item not found (ID: ${cartItemId})`);
				}

				// Re-validate stock (stock could have changed since item was added)
				const currentProduct = await tx.query.product.findFirst({
					where: eq(product.id, item.productId),
				});

				if (!currentProduct) {
					throw new Error(
						`Product "${item.product.name}" is no longer available`,
					);
				}

				if (quantity > currentProduct.stock) {
					throw new Error(
						`Insufficient stock for "${currentProduct.name}". Only ${currentProduct.stock} available, requested ${quantity}.`,
					);
				}

				// Update quantity
				await tx
					.update(cartItem)
					.set({ quantity, updatedAt: new Date() })
					.where(eq(cartItem.id, cartItemId));

				// Return updated cart
				const updatedCart = await fetchCartWithItems(tx, userId);

				const { itemCount, subtotal } = calculateCartTotals(
					updatedCart?.items ?? [],
				);

				return {
					cart: updatedCart ?? null,
					itemCount,
					subtotal,
				};
			});
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

			return db.transaction(async (tx) => {
				// Get cart item and verify ownership
				const item = await tx.query.cartItem.findFirst({
					where: eq(cartItem.id, cartItemId),
					with: {
						cart: true,
					},
				});

				if (!item || item.cart.userId !== userId) {
					throw new Error(`Cart item not found (ID: ${cartItemId})`);
				}

				// Remove item
				await tx.delete(cartItem).where(eq(cartItem.id, cartItemId));

				// Return updated cart
				const updatedCart = await fetchCartWithItems(tx, userId);

				const { itemCount, subtotal } = calculateCartTotals(
					updatedCart?.items ?? [],
				);

				return {
					cart: updatedCart ?? null,
					itemCount,
					subtotal,
				};
			});
		}),

	/**
	 * Clear all items from cart
	 */
	clear: protectedProcedure
		.output(z.object({ success: z.boolean() }))
		.handler(async ({ context }) => {
			const userId = context.session.user.id;

			return db.transaction(async (tx) => {
				const userCart = await tx.query.cart.findFirst({
					where: eq(cart.userId, userId),
				});

				if (userCart) {
					await tx.delete(cartItem).where(eq(cartItem.cartId, userCart.id));
				}

				return { success: true };
			});
		}),

	/**
	 * Get cart item count (quick check) - optimized with SQL SUM
	 */
	count: protectedProcedure
		.output(z.object({ count: z.number().int() }))
		.handler(async ({ context }) => {
			const userId = context.session.user.id;

			// Use SQL aggregation instead of fetching all items
			const result = await db
				.select({
					totalQuantity: sql<number>`COALESCE(SUM(${cartItem.quantity}), 0)::int`,
				})
				.from(cartItem)
				.innerJoin(cart, eq(cartItem.cartId, cart.id))
				.where(eq(cart.userId, userId));

			return { count: result[0]?.totalQuantity ?? 0 };
		}),
};
