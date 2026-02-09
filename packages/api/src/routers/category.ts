import { db } from "@simple-commerce/db";
import { category } from "@simple-commerce/db/schema";
import {
	CategorySchema,
	CreateCategorySchema,
	UpdateCategorySchema,
} from "@simple-commerce/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { protectedProcedure, publicProcedure } from "../index";

export const categoryRouter = {
	/**
	 * Get all categories
	 */
	list: publicProcedure.output(z.array(CategorySchema)).handler(async () => {
		const categories = await db.query.category.findMany({
			orderBy: (cat, { asc }) => [asc(cat.name)],
		});
		return categories;
	}),

	/**
	 * Get category by ID
	 */
	getById: publicProcedure
		.input(z.object({ id: z.string() }))
		.output(CategorySchema.nullable())
		.handler(async ({ input }) => {
			const result = await db.query.category.findFirst({
				where: eq(category.id, input.id),
			});
			return result ?? null;
		}),

	/**
	 * Get category by slug
	 */
	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.output(CategorySchema.nullable())
		.handler(async ({ input }) => {
			const result = await db.query.category.findFirst({
				where: eq(category.slug, input.slug),
			});
			return result ?? null;
		}),

	/**
	 * Create a new category (protected - admin only in future)
	 */
	create: protectedProcedure
		.input(CreateCategorySchema)
		.output(CategorySchema)
		.handler(async ({ input }) => {
			const id = `cat_${crypto.randomUUID()}`;
			const [result] = await db
				.insert(category)
				.values({
					id,
					name: input.name,
					slug: input.slug,
					description: input.description ?? null,
					image: input.image ?? null,
				})
				.returning();
			if (!result) {
				throw new Error("Failed to create category");
			}
			return result;
		}),

	/**
	 * Update a category (protected - admin only in future)
	 */
	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				data: UpdateCategorySchema,
			}),
		)
		.output(CategorySchema.nullable())
		.handler(async ({ input }) => {
			const [result] = await db
				.update(category)
				.set({
					...input.data,
					updatedAt: new Date(),
				})
				.where(eq(category.id, input.id))
				.returning();
			return result ?? null;
		}),

	/**
	 * Delete a category (protected - admin only in future)
	 */
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.output(z.object({ success: z.boolean() }))
		.handler(async ({ input }) => {
			await db.delete(category).where(eq(category.id, input.id));
			return { success: true };
		}),
};
