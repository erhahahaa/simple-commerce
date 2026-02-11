import { z } from "zod";
import { CategorySchema } from "./category";

// ============================================
// Product Schemas
// ============================================

export const ProductSchema = z.object({
	id: z.string().min(1, "Product ID is required"),
	name: z.string().min(1, "Product name is required"),
	slug: z.string().min(1, "Product slug is required"),
	description: z.string().nullable(),
	price: z.number().int().min(0, "Price must be non-negative"), // Price in cents (IDR)
	stock: z.number().int().min(0, "Stock must be non-negative"),
	images: z.array(z.string().url("Invalid image URL")).nullable(),
	categoryId: z.string().min(1, "Category ID is required").nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type Product = z.infer<typeof ProductSchema>;

export const ProductWithCategorySchema = ProductSchema.extend({
	category: CategorySchema.nullable(),
});

export type ProductWithCategory = z.infer<typeof ProductWithCategorySchema>;

export const CreateProductSchema = z.object({
	name: z.string().min(1, "Name is required").max(200, "Name is too long"),
	slug: z
		.string()
		.min(1, "Slug is required")
		.max(200, "Slug is too long")
		.regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
	description: z.string().max(2000, "Description is too long").optional(),
	price: z.number().int().min(0, "Price must be non-negative"),
	stock: z.number().int().min(0, "Stock must be non-negative").default(0),
	images: z.array(z.string().url("Invalid image URL")).default([]),
	categoryId: z.string().min(1, "Category ID is required").optional(),
});

export type CreateProduct = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = CreateProductSchema.partial();

export type UpdateProduct = z.infer<typeof UpdateProductSchema>;

export const ProductListQuerySchema = z.object({
	categoryId: z.string().min(1, "Category ID is required").optional(),
	categorySlug: z.string().min(1, "Category slug is required").optional(),
	search: z.string().max(100, "Search query is too long").optional(),
	limit: z
		.number()
		.int()
		.min(1, "Limit must be at least 1")
		.max(100, "Limit cannot exceed 100")
		.default(20),
	offset: z.number().int().min(0, "Offset must be non-negative").default(0),
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
