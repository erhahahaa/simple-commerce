import { db } from "@simple-commerce/db";
import { product, wishlist } from "@simple-commerce/db/schema";
import {
	AddToWishlistSchema,
	WishlistItemSchema,
	WishlistItemWithProductSchema,
} from "@simple-commerce/schema";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { protectedProcedure } from "../index";

export const wishlistRouter = {
	/**
	 * Get all wishlist items for current user
	 */
	list: protectedProcedure
		.output(z.array(WishlistItemWithProductSchema))
		.handler(async ({ context }) => {
			const userId = context.session.user.id;

			const items = await db.query.wishlist.findMany({
				where: eq(wishlist.userId, userId),
				orderBy: (w, { desc }) => [desc(w.createdAt)],
				with: {
					product: {
						with: {
							category: true,
						},
					},
				},
			});

			return items.map((item) => ({
				...item,
				product: {
					...item.product,
					category: item.product.category ?? null,
				},
			}));
		}),

	/**
	 * Get wishlist count
	 */
	count: protectedProcedure
		.output(z.object({ count: z.number() }))
		.handler(async ({ context }) => {
			const userId = context.session.user.id;

			const [result] = await db
				.select({ count: sql<number>`count(*)::int` })
				.from(wishlist)
				.where(eq(wishlist.userId, userId));

			return { count: result?.count ?? 0 };
		}),

	/**
	 * Check if product is in wishlist
	 */
	isInWishlist: protectedProcedure
		.input(z.object({ productId: z.string() }))
		.output(z.object({ inWishlist: z.boolean() }))
		.handler(async ({ context, input }) => {
			const userId = context.session.user.id;

			const item = await db.query.wishlist.findFirst({
				where: and(
					eq(wishlist.userId, userId),
					eq(wishlist.productId, input.productId),
				),
			});

			return { inWishlist: !!item };
		}),

	/**
	 * Add product to wishlist
	 */
	add: protectedProcedure
		.input(AddToWishlistSchema)
		.output(WishlistItemSchema)
		.handler(async ({ context, input }) => {
			const userId = context.session.user.id;

			// Check if product exists
			const productExists = await db.query.product.findFirst({
				where: eq(product.id, input.productId),
			});

			if (!productExists) {
				throw new Error("Product not found");
			}

			// Check if already in wishlist
			const existing = await db.query.wishlist.findFirst({
				where: and(
					eq(wishlist.userId, userId),
					eq(wishlist.productId, input.productId),
				),
			});

			if (existing) {
				return existing;
			}

			const id = `wish_${crypto.randomUUID()}`;

			const [result] = await db
				.insert(wishlist)
				.values({
					id,
					userId,
					productId: input.productId,
				})
				.returning();

			if (!result) {
				throw new Error("Failed to add to wishlist");
			}

			return result;
		}),

	/**
	 * Remove product from wishlist
	 */
	remove: protectedProcedure
		.input(z.object({ productId: z.string() }))
		.output(z.object({ success: z.boolean() }))
		.handler(async ({ context, input }) => {
			const userId = context.session.user.id;

			await db
				.delete(wishlist)
				.where(
					and(
						eq(wishlist.userId, userId),
						eq(wishlist.productId, input.productId),
					),
				);

			return { success: true };
		}),

	/**
	 * Toggle wishlist status
	 */
	toggle: protectedProcedure
		.input(z.object({ productId: z.string() }))
		.output(z.object({ inWishlist: z.boolean() }))
		.handler(async ({ context, input }) => {
			const userId = context.session.user.id;

			// Check if already in wishlist
			const existing = await db.query.wishlist.findFirst({
				where: and(
					eq(wishlist.userId, userId),
					eq(wishlist.productId, input.productId),
				),
			});

			if (existing) {
				// Remove from wishlist
				await db
					.delete(wishlist)
					.where(
						and(
							eq(wishlist.userId, userId),
							eq(wishlist.productId, input.productId),
						),
					);
				return { inWishlist: false };
			}

			// Check if product exists
			const productExists = await db.query.product.findFirst({
				where: eq(product.id, input.productId),
			});

			if (!productExists) {
				throw new Error("Product not found");
			}

			// Add to wishlist
			const id = `wish_${crypto.randomUUID()}`;
			await db.insert(wishlist).values({
				id,
				userId,
				productId: input.productId,
			});

			return { inWishlist: true };
		}),
};
