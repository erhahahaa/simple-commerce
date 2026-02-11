import { expo } from "@better-auth/expo";
import { db, markUserVerified } from "@simple-commerce/db";
import * as schema from "@simple-commerce/db/schema/auth";
import { env } from "@simple-commerce/env/server";
import { mailer } from "@simple-commerce/mailer";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
	baseURL: env.BETTER_AUTH_URL,
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
	trustedOrigins: [
		env.CORS_ORIGIN,
		"simple-commerce://",
		...(env.NODE_ENV === "development"
			? [
					"exp://",
					"exp://**",
					"exp://192.168.*.*:*/**",
					"http://localhost:8081",
				]
			: []),
	],
	emailAndPassword: {
		enabled: true,
		sendResetPassword: async ({ user, token }) => {
			await mailer.sendResetPasswordEmail({
				to: user.email,
				name: user.name ?? undefined,
				token,
			});
		},
		onPasswordReset: async ({ user }) => {
			await Promise.allSettled([
				markUserVerified(user.id),
				mailer.sendPasswordResetConfirmation({
					to: user.email,
					name: user.name ?? undefined,
				}),
			]);
		},
	},
	emailVerification: {
		sendVerificationEmail: async ({ user, token }) => {
			await mailer.sendVerificationEmail({
				to: user.email,
				name: user.name ?? undefined,
				token,
			});
		},
	},
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
	},
	plugins: [expo()],
});
