import z from "zod";

export const ErrorResponseSchema = z.object({
	success: z.literal(false),
	error: z.string(),
	details: z.any().optional(),
});
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export const createSuccessResponseSchema = <T extends z.ZodTypeAny>(
	dataSchema: T,
) =>
	z.object({
		success: z.literal(true),
		message: z.string().optional(),
		data: dataSchema,
	});
export type SuccessResponse<T extends z.ZodTypeAny> = z.infer<
	ReturnType<typeof createSuccessResponseSchema<T>>
>;

export const createApiResponseSchema = <T extends z.ZodTypeAny>(
	dataSchema: T,
) =>
	z.discriminatedUnion("success", [
		createSuccessResponseSchema(dataSchema),
		ErrorResponseSchema,
	]);
export type ApiResponse<T extends z.ZodTypeAny> = z.infer<
	ReturnType<typeof createApiResponseSchema<T>>
>;
