import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url(),
		CORS_ORIGIN: z.url(),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
		GOOGLE_CLIENT_ID: z.string().min(1),
		GOOGLE_CLIENT_SECRET: z.string().min(1),
		RESEND_API_KEY: z.string().min(1),
		// Optional: Expo Go URL for development deep links (e.g., "exp://192.168.1.100:8081")
		EXPO_GO_URL: z.string().optional(),
		// Midtrans payment gateway
		MIDTRANS_SERVER_KEY: z.string().min(1),
		MIDTRANS_CLIENT_KEY: z.string().min(1),
		MIDTRANS_IS_PRODUCTION: z
			.enum(["true", "false"])
			.default("false")
			.transform((val) => val === "true"),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
