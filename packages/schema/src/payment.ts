import { z } from "zod";

// Payment status enum
export const PaymentStatusSchema = z.enum([
	"pending",
	"paid",
	"failed",
	"expired",
	"refunded",
]);

export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

// Order status enum
export const OrderStatusSchema = z.enum([
	"pending",
	"processing",
	"shipped",
	"delivered",
	"cancelled",
]);

export type OrderStatus = z.infer<typeof OrderStatusSchema>;

// Transaction item schema
export const TransactionItemSchema = z.object({
	id: z.string(),
	price: z.number().int().positive(),
	quantity: z.number().int().positive(),
	name: z.string(),
});

export type TransactionItem = z.infer<typeof TransactionItemSchema>;

// Create transaction request schema
export const CreateTransactionSchema = z.object({
	orderId: z.string(),
	grossAmount: z.number().int().positive(),
	items: z.array(TransactionItemSchema),
	customerName: z.string(),
	customerEmail: z.string().email(),
	customerPhone: z.string().optional(),
});

export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;

// Snap transaction response schema
export const SnapTransactionResponseSchema = z.object({
	token: z.string(),
	redirectUrl: z.string().url(),
});

export type SnapTransactionResponse = z.infer<
	typeof SnapTransactionResponseSchema
>;

// Midtrans notification schema (webhook payload)
export const MidtransNotificationSchema = z.object({
	transaction_time: z.string(),
	transaction_status: z.enum([
		"capture",
		"settlement",
		"pending",
		"deny",
		"cancel",
		"expire",
		"refund",
		"partial_refund",
		"failure",
	]),
	transaction_id: z.string(),
	status_message: z.string(),
	status_code: z.string(),
	signature_key: z.string(),
	payment_type: z.string(),
	order_id: z.string(),
	merchant_id: z.string(),
	gross_amount: z.string(),
	fraud_status: z.enum(["accept", "challenge", "deny"]).optional(),
	currency: z.string(),
});

export type MidtransNotification = z.infer<typeof MidtransNotificationSchema>;

// Payment config response (for client)
export const PaymentConfigSchema = z.object({
	clientKey: z.string(),
	isProduction: z.boolean(),
});

export type PaymentConfig = z.infer<typeof PaymentConfigSchema>;

// Transaction status response
export const TransactionStatusSchema = z.object({
	orderId: z.string(),
	transactionStatus: z.string(),
	paymentType: z.string().optional(),
	grossAmount: z.string(),
	fraudStatus: z.string().optional(),
});

export type TransactionStatus = z.infer<typeof TransactionStatusSchema>;
