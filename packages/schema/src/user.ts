import z from "zod";

export const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.email(),
	emailVerified: z.boolean().default(false),
	image: z.string().nullable().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
export type User = z.infer<typeof UserSchema>;
