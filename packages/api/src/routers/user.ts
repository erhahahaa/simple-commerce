import { db } from "@simple-commerce/db";
import { order, user, wishlist } from "@simple-commerce/db/schema";
import {
	UpdateProfileSchema,
	UserSchema,
	UserStatsSchema,
} from "@simple-commerce/schema";
import { eq, sql } from "drizzle-orm";

import { protectedProcedure } from "../index";

export const userRouter = {
	/**
	 * Get current user's profile
	 */
	getProfile: protectedProcedure
		.output(UserSchema)
		.handler(async ({ context }) => {
			const userId = context.session.user.id;

			const result = await db.query.user.findFirst({
				where: eq(user.id, userId),
			});

			if (!result) {
				throw new Error("User not found");
			}

			return result;
		}),

	/**
	 * Update current user's profile
	 */
	updateProfile: protectedProcedure
		.input(UpdateProfileSchema)
		.output(UserSchema)
		.handler(async ({ context, input }) => {
			const userId = context.session.user.id;

			const updateData: Record<string, unknown> = {
				updatedAt: new Date(),
			};

			if (input.name !== undefined) {
				updateData.name = input.name;
			}
			if (input.phone !== undefined) {
				updateData.phone = input.phone;
			}
			if (input.image !== undefined) {
				updateData.image = input.image;
			}

			const [result] = await db
				.update(user)
				.set(updateData)
				.where(eq(user.id, userId))
				.returning();

			if (!result) {
				throw new Error("Failed to update profile");
			}

			return result;
		}),

	/**
	 * Get user statistics (orders, spending, wishlist)
	 */
	getStats: protectedProcedure
		.output(UserStatsSchema)
		.handler(async ({ context }) => {
			const userId = context.session.user.id;

			// Get order stats
			const [orderStats] = await db
				.select({
					totalOrders: sql<number>`count(*)::int`,
					totalSpent: sql<number>`coalesce(sum(case when ${order.paymentStatus} = 'paid' then ${order.totalAmount} else 0 end), 0)::int`,
					pendingOrders: sql<number>`count(case when ${order.status} = 'pending' then 1 end)::int`,
				})
				.from(order)
				.where(eq(order.userId, userId));

			// Get wishlist count
			const [wishlistStats] = await db
				.select({
					count: sql<number>`count(*)::int`,
				})
				.from(wishlist)
				.where(eq(wishlist.userId, userId));

			return {
				totalOrders: orderStats?.totalOrders ?? 0,
				totalSpent: orderStats?.totalSpent ?? 0,
				pendingOrders: orderStats?.pendingOrders ?? 0,
				wishlistCount: wishlistStats?.count ?? 0,
			};
		}),
};
