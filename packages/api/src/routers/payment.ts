import {
	CreateTransactionSchema,
	MidtransNotificationSchema,
	PaymentConfigSchema,
	SnapTransactionResponseSchema,
	type TransactionItem,
	TransactionStatusSchema,
} from "@simple-commerce/schema";
import { z } from "zod";

import { protectedProcedure, publicProcedure } from "../index";
import {
	createSnapTransaction,
	getClientKey,
	getTransactionStatus,
	isProduction,
	type MidtransNotification,
	mapTransactionStatus,
	verifyNotificationSignature,
} from "../services/midtrans";

export const paymentRouter = {
	/**
	 * Get payment configuration for client
	 * Returns client key and environment info
	 */
	getConfig: publicProcedure.output(PaymentConfigSchema).handler(() => {
		return {
			clientKey: getClientKey(),
			isProduction: isProduction(),
		};
	}),

	/**
	 * Create a Snap transaction for payment
	 * Returns token and redirect URL for Midtrans Snap
	 */
	createTransaction: protectedProcedure
		.input(CreateTransactionSchema)
		.output(SnapTransactionResponseSchema)
		.handler(async ({ input }) => {
			// Create transaction with Midtrans
			const snapResponse = await createSnapTransaction({
				transaction_details: {
					order_id: input.orderId,
					gross_amount: input.grossAmount,
				},
				item_details: input.items.map((item: TransactionItem) => ({
					id: item.id,
					price: item.price,
					quantity: item.quantity,
					name: item.name,
				})),
				customer_details: {
					first_name: input.customerName,
					email: input.customerEmail,
					phone: input.customerPhone,
				},
				// Enable all common payment methods in Indonesia
				enabled_payments: [
					// Virtual Accounts
					"bca_va",
					"bni_va",
					"bri_va",
					"permata_va",
					"other_va",
					// E-Wallets
					"gopay",
					"shopeepay",
					// Credit Card
					"credit_card",
					// Convenience Store
					"indomaret",
					"alfamart",
					// Bank Transfer
					"echannel", // Mandiri Bill Payment
				],
				credit_card: {
					secure: true,
				},
				expiry: {
					unit: "hour",
					duration: 24, // 24 hours expiry
				},
			});

			return {
				token: snapResponse.token,
				redirectUrl: snapResponse.redirect_url,
			};
		}),

	/**
	 * Get transaction status from Midtrans
	 */
	getStatus: protectedProcedure
		.input(z.object({ orderId: z.string() }))
		.output(TransactionStatusSchema)
		.handler(async ({ input }) => {
			const status = await getTransactionStatus(input.orderId);

			return {
				orderId: status.order_id,
				transactionStatus: status.transaction_status,
				paymentType: status.payment_type,
				grossAmount: status.gross_amount,
				fraudStatus: status.fraud_status,
			};
		}),

	/**
	 * Process webhook notification from Midtrans
	 * This should be called from a separate webhook endpoint
	 */
	handleNotification: publicProcedure
		.input(MidtransNotificationSchema)
		.output(
			z.object({
				success: z.boolean(),
				orderId: z.string(),
				paymentStatus: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			// Verify signature
			const isValid = verifyNotificationSignature(
				input as MidtransNotification,
			);

			if (!isValid) {
				throw new Error("Invalid notification signature");
			}

			// Map transaction status to our payment status
			const paymentStatus = mapTransactionStatus(
				input.transaction_status,
				input.fraud_status,
			);

			// Note: Order update logic will be handled in the order router
			// This router just validates and returns the mapped status
			// The webhook endpoint will call this and then update the order

			return {
				success: true,
				orderId: input.order_id,
				paymentStatus,
			};
		}),
};
