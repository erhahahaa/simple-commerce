import z from "zod";

export const UserSchema = z.object({
	id: z.string().min(1, "User ID is required"),
	name: z.string().min(1, "Name is required"),
	email: z.email("Invalid email address"),
	emailVerified: z.boolean().default(false),
	image: z.string().url("Invalid image URL").nullable().optional(),
	phone: z
		.string()
		.regex(/^(\+62|62|0)[0-9]{9,13}$/, "Invalid phone number format")
		.nullable()
		.optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
export type User = z.infer<typeof UserSchema>;

export const UpdateProfileSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(100, "Name is too long")
		.optional(),
	phone: z
		.string()
		.regex(/^(\+62|62|0)[0-9]{9,13}$/, "Invalid phone number format")
		.nullable()
		.optional(),
	image: z.string().url("Invalid image URL").nullable().optional(),
});
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;

export const UserStatsSchema = z.object({
	totalOrders: z.number(),
	totalSpent: z.number(),
	wishlistCount: z.number(),
	pendingOrders: z.number(),
});
export type UserStats = z.infer<typeof UserStatsSchema>;
