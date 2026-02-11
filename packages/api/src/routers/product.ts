import { db } from "@simple-commerce/db";
import { category, product } from "@simple-commerce/db/schema";
import {
	CreateProductSchema,
	ProductListQuerySchema,
	ProductListResponseSchema,
	ProductSchema,
	ProductWithCategorySchema,
	UpdateProductSchema,
} from "@simple-commerce/schema";
import { and, asc, desc, eq, ilike, sql } from "drizzle-orm";
import { z } from "zod";

import { protectedProcedure, publicProcedure } from "../index";

export const productRouter = {
	/**
	 * Get products with filtering, pagination, and sorting
	 */
	list: publicProcedure
		.input(ProductListQuerySchema)
		.output(ProductListResponseSchema)
		.handler(async ({ input }) => {
			const {
				categoryId,
				categorySlug,
				search,
				limit,
				offset,
				sortBy,
				sortOrder,
			} = input;

			// Build where conditions
			const conditions = [];

			if (categoryId) {
				conditions.push(eq(product.categoryId, categoryId));
			}

			if (categorySlug) {
				const cat = await db.query.category.findFirst({
					where: eq(category.slug, categorySlug),
				});
				if (cat) {
					conditions.push(eq(product.categoryId, cat.id));
				}
			}

			if (search) {
				conditions.push(ilike(product.name, `%${search}%`));
			}

			// Get total count
			const [countResult] = await db
				.select({ count: sql<number>`count(*)::int` })
				.from(product)
				.where(conditions.length > 0 ? and(...conditions) : undefined);

			const total = countResult?.count ?? 0;

			// Build order by
			const orderByColumn =
				sortBy === "price"
					? product.price
					: sortBy === "name"
						? product.name
						: product.createdAt;
			const orderByFn = sortOrder === "asc" ? asc : desc;

			// Get products with category
			const products = await db.query.product.findMany({
				where: conditions.length > 0 ? and(...conditions) : undefined,
				with: {
					category: true,
				},
				limit,
				offset,
				orderBy: [orderByFn(orderByColumn)],
			});

			return {
				products,
				total,
				limit,
				offset,
				hasMore: offset + products.length < total,
			};
		}),

	/**
	 * Get product by ID
	 */
	getById: publicProcedure
		.input(z.object({ id: z.string().min(1, "Product ID is required") }))
		.output(ProductWithCategorySchema.nullable())
		.handler(async ({ input }) => {
			const result = await db.query.product.findFirst({
				where: eq(product.id, input.id),
				with: {
					category: true,
				},
			});
			return result ?? null;
		}),

	/**
	 * Get product by slug
	 */
	getBySlug: publicProcedure
		.input(z.object({ slug: z.string().min(1, "Product slug is required") }))
		.output(ProductWithCategorySchema.nullable())
		.handler(async ({ input }) => {
			const result = await db.query.product.findFirst({
				where: eq(product.slug, input.slug),
				with: {
					category: true,
				},
			});
			return result ?? null;
		}),

	/**
	 * Get featured products (latest products with stock)
	 */
	featured: publicProcedure
		.input(
			z.object({
				limit: z
					.number()
					.int()
					.min(1, "Limit must be at least 1")
					.max(20, "Limit cannot exceed 20")
					.default(8),
			}),
		)
		.output(z.array(ProductWithCategorySchema))
		.handler(async ({ input }) => {
			const products = await db.query.product.findMany({
				where: sql`${product.stock} > 0`,
				with: {
					category: true,
				},
				limit: input.limit,
				orderBy: [desc(product.createdAt)],
			});
			return products;
		}),

	/**
	 * Create a new product (protected - admin only in future)
	 */
	create: protectedProcedure
		.input(CreateProductSchema)
		.output(ProductSchema)
		.handler(async ({ input }) => {
			// Check if slug is already taken
			const existingProduct = await db.query.product.findFirst({
				where: eq(product.slug, input.slug),
			});
			if (existingProduct) {
				throw new Error(`Product with slug "${input.slug}" already exists`);
			}

			// Validate category exists if provided
			if (input.categoryId) {
				const existingCategory = await db.query.category.findFirst({
					where: eq(category.id, input.categoryId),
				});
				if (!existingCategory) {
					throw new Error(`Category not found (id: ${input.categoryId})`);
				}
			}

			const id = `prod_${crypto.randomUUID()}`;
			const [result] = await db
				.insert(product)
				.values({
					id,
					name: input.name,
					slug: input.slug,
					description: input.description ?? null,
					price: input.price,
					stock: input.stock ?? 0,
					images: input.images ?? [],
					categoryId: input.categoryId ?? null,
				})
				.returning();
			if (!result) {
				throw new Error("Failed to create product");
			}
			return result;
		}),

	/**
	 * Update a product (protected - admin only in future)
	 */
	update: protectedProcedure
		.input(
			z.object({
				id: z.string().min(1, "Product ID is required"),
				data: UpdateProductSchema,
			}),
		)
		.output(ProductSchema)
		.handler(async ({ input }) => {
			// Check if product exists
			const existingProduct = await db.query.product.findFirst({
				where: eq(product.id, input.id),
			});
			if (!existingProduct) {
				throw new Error(`Product not found (id: ${input.id})`);
			}

			// Check if slug is being changed and if new slug is already taken
			if (input.data.slug && input.data.slug !== existingProduct.slug) {
				const slugExists = await db.query.product.findFirst({
					where: eq(product.slug, input.data.slug),
				});
				if (slugExists) {
					throw new Error(
						`Product with slug "${input.data.slug}" already exists`,
					);
				}
			}

			// Validate category exists if provided
			if (input.data.categoryId) {
				const existingCategory = await db.query.category.findFirst({
					where: eq(category.id, input.data.categoryId),
				});
				if (!existingCategory) {
					throw new Error(`Category not found (id: ${input.data.categoryId})`);
				}
			}

			const [result] = await db
				.update(product)
				.set({
					...input.data,
					updatedAt: new Date(),
				})
				.where(eq(product.id, input.id))
				.returning();

			if (!result) {
				throw new Error(`Failed to update product (id: ${input.id})`);
			}

			return result;
		}),

	/**
	 * Delete a product (protected - admin only in future)
	 */
	delete: protectedProcedure
		.input(z.object({ id: z.string().min(1, "Product ID is required") }))
		.output(z.object({ success: z.boolean() }))
		.handler(async ({ input }) => {
			// Check if product exists
			const existingProduct = await db.query.product.findFirst({
				where: eq(product.id, input.id),
			});
			if (!existingProduct) {
				throw new Error(`Product not found (id: ${input.id})`);
			}

			await db.delete(product).where(eq(product.id, input.id));
			return { success: true };
		}),
};
