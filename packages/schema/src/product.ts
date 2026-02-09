import { z } from "zod";
import { CategorySchema } from "./category";

// ============================================
// Product Schemas
// ============================================

export const ProductSchema = z.object({
	id: z.string(),
	name: z.string(),
	slug: z.string(),
	description: z.string().nullable(),
	price: z.number().int(), // Price in cents (IDR)
	stock: z.number().int(),
	images: z.array(z.string()).nullable(),
	categoryId: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type Product = z.infer<typeof ProductSchema>;

export const ProductWithCategorySchema = ProductSchema.extend({
	category: CategorySchema.nullable(),
});

export type ProductWithCategory = z.infer<typeof ProductWithCategorySchema>;

export const CreateProductSchema = z.object({
	name: z.string().min(1, "Name is required").max(200),
	slug: z
		.string()
		.min(1)
		.max(200)
		.regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
	description: z.string().max(2000).optional(),
	price: z.number().int().min(0, "Price must be positive"),
	stock: z.number().int().min(0, "Stock must be positive").default(0),
	images: z.array(z.string().url()).default([]),
	categoryId: z.string().optional(),
});

export type CreateProduct = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = CreateProductSchema.partial();

export type UpdateProduct = z.infer<typeof UpdateProductSchema>;

export const ProductListQuerySchema = z.object({
	categoryId: z.string().optional(),
	categorySlug: z.string().optional(),
	search: z.string().optional(),
	limit: z.number().int().min(1).max(100).default(20),
	offset: z.number().int().min(0).default(0),
	sortBy: z.enum(["createdAt", "price", "name"]).default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ProductListQuery = z.infer<typeof ProductListQuerySchema>;

export const ProductListResponseSchema = z.object({
	products: z.array(ProductWithCategorySchema),
	total: z.number().int(),
	limit: z.number().int(),
	offset: z.number().int(),
	hasMore: z.boolean(),
});

export type ProductListResponse = z.infer<typeof ProductListResponseSchema>;
