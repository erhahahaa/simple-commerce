import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { createContext } from "@simple-commerce/api/context";
import { appRouter } from "@simple-commerce/api/routers/index";
import {
	isTransactionSuccess,
	type MidtransNotification,
	mapTransactionStatus,
	verifyNotificationSignature,
} from "@simple-commerce/api/services/midtrans";
import { auth } from "@simple-commerce/auth";
import { db } from "@simple-commerce/db";
import { order } from "@simple-commerce/db/schema";
import { env } from "@simple-commerce/env/server";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());
app.use(
	"/*",
	cors({
		origin: env.CORS_ORIGIN,
		allowMethods: ["GET", "POST", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

// Midtrans payment webhook endpoint
// This endpoint receives payment notifications from Midtrans
app.post("/api/webhooks/midtrans", async (c) => {
	try {
		const notification = (await c.req.json()) as MidtransNotification;

		console.log("Received Midtrans notification:", {
			orderId: notification.order_id,
			transactionStatus: notification.transaction_status,
			paymentType: notification.payment_type,
		});

		// Verify signature
		const isValid = verifyNotificationSignature(notification);
		if (!isValid) {
			console.error("Invalid Midtrans notification signature");
			return c.json({ error: "Invalid signature" }, 403);
		}

		// Map transaction status to our payment status
		const paymentStatus = mapTransactionStatus(
			notification.transaction_status,
			notification.fraud_status,
		);

		console.log("Mapped payment status:", paymentStatus);

		// Find and update order
		const existingOrder = await db.query.order.findFirst({
			where: eq(order.midtransOrderId, notification.order_id),
		});

		if (!existingOrder) {
			console.error(
				"Order not found for Midtrans order ID:",
				notification.order_id,
			);
			return c.json({ error: "Order not found" }, 404);
		}

		// Update order payment status
		const updateData: Record<string, unknown> = {
			paymentStatus,
			paymentMethod: notification.payment_type,
			updatedAt: new Date(),
		};

		// If payment successful, update status and paidAt
		if (
			isTransactionSuccess(
				notification.transaction_status,
				notification.fraud_status,
			)
		) {
			updateData.status = "processing";
			updateData.paidAt = new Date();
		}

		// If payment failed/expired, update status
		if (paymentStatus === "failed" || paymentStatus === "expired") {
			updateData.status = "cancelled";
		}

		await db
			.update(order)
			.set(updateData)
			.where(eq(order.id, existingOrder.id));

		console.log("Order updated:", existingOrder.id, updateData);

		// Return 200 OK to Midtrans
		return c.json({
			success: true,
			orderId: notification.order_id,
			paymentStatus,
		});
	} catch (error) {
		console.error("Midtrans webhook error:", error);
		return c.json({ error: "Internal server error" }, 500);
	}
});

export const apiHandler = new OpenAPIHandler(appRouter, {
	plugins: [
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
		}),
	],
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

export const rpcHandler = new RPCHandler(appRouter, {
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

app.use("/*", async (c, next) => {
	const context = await createContext({ context: c });

	const rpcResult = await rpcHandler.handle(c.req.raw, {
		prefix: "/rpc",
		context: context,
	});

	if (rpcResult.matched) {
		return c.newResponse(rpcResult.response.body, rpcResult.response);
	}

	const apiResult = await apiHandler.handle(c.req.raw, {
		prefix: "/api-reference",
		context: context,
	});

	if (apiResult.matched) {
		return c.newResponse(apiResult.response.body, apiResult.response);
	}

	await next();
});

app.get("/", (c) => {
	return c.text("OK");
});

// Reset password redirect page - opens app via deep link
app.get("/app/reset-password", (c) => {
	const token = c.req.query("token");

	if (!token) {
		return c.text("Invalid reset password link: missing token", 400);
	}

	const encodedToken = encodeURIComponent(token);

	// Use Expo Go URL in development, custom scheme in production
	const deepLink = env.EXPO_GO_URL
		? `${env.EXPO_GO_URL}/--/reset-password?token=${encodedToken}`
		: `simple-commerce://reset-password?token=${encodedToken}`;

	const html = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Reset Password - Simple Commerce</title>
	<style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		body {
			font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
			min-height: 100vh;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 20px;
		}
		.container {
			background: white;
			border-radius: 16px;
			padding: 40px;
			max-width: 400px;
			width: 100%;
			text-align: center;
			box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		}
		.logo {
			font-size: 24px;
			font-weight: bold;
			color: #1a1a2e;
			margin-bottom: 24px;
		}
		h1 {
			font-size: 20px;
			color: #111827;
			margin-bottom: 12px;
		}
		p {
			color: #6b7280;
			margin-bottom: 24px;
			line-height: 1.5;
		}
		.button {
			display: inline-block;
			background: #3b82f6;
			color: white;
			padding: 14px 32px;
			border-radius: 8px;
			text-decoration: none;
			font-weight: 600;
			font-size: 16px;
			transition: background 0.2s;
		}
		.button:hover {
			background: #2563eb;
		}
		.fallback {
			margin-top: 24px;
			padding-top: 24px;
			border-top: 1px solid #e5e7eb;
		}
		.fallback p {
			font-size: 14px;
			margin-bottom: 8px;
		}
		.token-box {
			background: #f3f4f6;
			padding: 12px;
			border-radius: 8px;
			word-break: break-all;
			font-family: monospace;
			font-size: 12px;
			color: #374151;
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="logo">Simple Commerce</div>
		<h1>Reset Your Password</h1>
		<p>Tap the button below to open the app and reset your password.</p>
		<a href="${deepLink}" class="button">Open App</a>
		<div class="fallback">
			<p>If the button doesn't work, copy this token and paste it in the app:</p>
			<div class="token-box">${token}</div>
		</div>
	</div>
	<script>
		// Auto-redirect to app on mobile
		setTimeout(function() {
			window.location.href = "${deepLink}";
		}, 100);
	</script>
</body>
</html>`;

	return c.html(html);
});

export default app;
