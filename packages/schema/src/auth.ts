import z from "zod";
import { UserSchema } from "./user";
import { createApiResponseSchema } from "./utils";

export const SessionSchema = z.object({
	id: z.string(),
	userId: z.string(),
	expiresAt: z.date(),
	token: z.string(),
	ipAddress: z.string().nullable().optional(),
	userAgent: z.string().nullable().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
export type Session = z.infer<typeof SessionSchema>;

const PasswordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters long")
	.max(128, "Password must be at most 128 characters long")
	.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
	.regex(/[a-z]/, "Password must contain at least one lowercase letter")
	.regex(/[0-9]/, "Password must contain at least one number")
	.regex(
		/[^A-Za-z0-9]/,
		"Password must contain at least one special character",
	);

export const SignInRequestSchema = z.object({
	email: z
		.email("Invalid email address")
		.min(1, "Email is required")
		.max(255, "Email is too long"),
	password: PasswordSchema,
	rememberMe: z.boolean().optional(),
});
export type SignInRequest = z.infer<typeof SignInRequestSchema>;

export const SignInResponseSchema = createApiResponseSchema(UserSchema);
export type SignInResponse = z.infer<typeof SignInResponseSchema>;

export const SignUpRequestSchema = z
	.object({
		name: z.string().min(1, "Name is required").max(100, "Name is too long"),
		email: z
			.email("Invalid email address")
			.min(1, "Email is required")
			.max(255, "Email is too long"),
		password: PasswordSchema,
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});
export type SignUpRequest = z.infer<typeof SignUpRequestSchema>;

export const SignUpResponseSchema = createApiResponseSchema(UserSchema);
export type SignUpResponse = z.infer<typeof SignUpResponseSchema>;

export const GetSessionResponseSchema = createApiResponseSchema(
	z.object({
		user: UserSchema,
		session: SessionSchema,
	}),
);
export type GetSessionResponse = z.infer<typeof GetSessionResponseSchema>;

export const ForgotPasswordRequestSchema = z.object({
	email: z
		.email("Invalid email address")
		.min(1, "Email is required")
		.max(255, "Email is too long"),
});
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;

export const ResetPasswordRequestSchema = z
	.object({
		token: z.string().min(1, "Token is required"),
		newPassword: PasswordSchema,
		confirmNewPassword: z.string().min(1, "Please confirm your new password"),
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "Passwords do not match",
		path: ["confirmNewPassword"],
	});
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;

export const SocialProviderSchema = z.enum(["google", "apple", "github"]);
export type SocialProvider = z.infer<typeof SocialProviderSchema>;
