import { z } from "zod";

// ============================================
// Category Schemas
// ============================================

export const CategorySchema = z.object({
	id: z.string(),
	name: z.string(),
	slug: z.string(),
	description: z.string().nullable(),
	image: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type Category = z.infer<typeof CategorySchema>;

export const CreateCategorySchema = z.object({
	name: z.string().min(1, "Name is required").max(100),
	slug: z
		.string()
		.min(1)
		.max(100)
		.regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
	description: z.string().max(500).optional(),
	image: z.string().url().optional(),
});

export type CreateCategory = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = CreateCategorySchema.partial();

export type UpdateCategory = z.infer<typeof UpdateCategorySchema>;

export const CategoryListResponseSchema = z.array(CategorySchema);

export type CategoryListResponse = z.infer<typeof CategoryListResponseSchema>;
