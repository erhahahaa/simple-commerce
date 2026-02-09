import crypto from "node:crypto";
import { env } from "@simple-commerce/env/server";

// Midtrans API endpoints
const SANDBOX_BASE_URL = "https://app.sandbox.midtrans.com";
const PRODUCTION_BASE_URL = "https://app.midtrans.com";

// Get base URL based on environment
function getBaseUrl() {
	return env.MIDTRANS_IS_PRODUCTION ? PRODUCTION_BASE_URL : SANDBOX_BASE_URL;
}

// Get authorization header
function getAuthHeader() {
	const serverKey = env.MIDTRANS_SERVER_KEY;
	const encoded = Buffer.from(`${serverKey}:`).toString("base64");
	return `Basic ${encoded}`;
}

// Transaction item for Midtrans
export interface TransactionItem {
	id: string;
	price: number;
	quantity: number;
	name: string;
}

// Customer details for Midtrans
export interface CustomerDetails {
	first_name: string;
	last_name?: string;
	email: string;
	phone?: string;
	billing_address?: {
		first_name: string;
		last_name?: string;
		email: string;
		phone?: string;
		address: string;
		city: string;
		postal_code: string;
		country_code: string;
	};
	shipping_address?: {
		first_name: string;
		last_name?: string;
		email: string;
		phone?: string;
		address: string;
		city: string;
		postal_code: string;
		country_code: string;
	};
}

// Snap transaction request
export interface SnapTransactionRequest {
	transaction_details: {
		order_id: string;
		gross_amount: number;
	};
	item_details?: TransactionItem[];
	customer_details?: CustomerDetails;
	enabled_payments?: string[];
	credit_card?: {
		secure: boolean;
		save_card?: boolean;
	};
	callbacks?: {
		finish?: string;
		error?: string;
		pending?: string;
	};
	expiry?: {
		start_time?: string;
		unit: "minute" | "hour" | "day";
		duration: number;
	};
}

// Snap transaction response
export interface SnapTransactionResponse {
	token: string;
	redirect_url: string;
}

// Notification/Webhook payload from Midtrans
export interface MidtransNotification {
	transaction_time: string;
	transaction_status:
		| "capture"
		| "settlement"
		| "pending"
		| "deny"
		| "cancel"
		| "expire"
		| "refund"
		| "partial_refund"
		| "failure";
	transaction_id: string;
	status_message: string;
	status_code: string;
	signature_key: string;
	payment_type: string;
	order_id: string;
	merchant_id: string;
	gross_amount: string;
	fraud_status?: "accept" | "challenge" | "deny";
	currency: string;
}

// Transaction status response
export interface TransactionStatusResponse {
	transaction_time: string;
	transaction_status: string;
	transaction_id: string;
	status_message: string;
	status_code: string;
	signature_key: string;
	payment_type: string;
	order_id: string;
	merchant_id: string;
	gross_amount: string;
	fraud_status?: string;
	currency: string;
}

/**
 * Create a Snap transaction token for payment
 */
export async function createSnapTransaction(
	request: SnapTransactionRequest,
): Promise<SnapTransactionResponse> {
	const baseUrl = getBaseUrl();
	const url = `${baseUrl}/snap/v1/transactions`;

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: getAuthHeader(),
		},
		body: JSON.stringify(request),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(
			`Midtrans Snap API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`,
		);
	}

	return response.json() as Promise<SnapTransactionResponse>;
}

/**
 * Get transaction status from Midtrans
 */
export async function getTransactionStatus(
	orderId: string,
): Promise<TransactionStatusResponse> {
	const baseUrl = getBaseUrl().replace("app", "api");
	const url = `${baseUrl}/v2/${orderId}/status`;

	const response = await fetch(url, {
		method: "GET",
		headers: {
			Accept: "application/json",
			Authorization: getAuthHeader(),
		},
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(
			`Midtrans API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`,
		);
	}

	return response.json() as Promise<TransactionStatusResponse>;
}

/**
 * Cancel a transaction
 */
export async function cancelTransaction(orderId: string): Promise<void> {
	const baseUrl = getBaseUrl().replace("app", "api");
	const url = `${baseUrl}/v2/${orderId}/cancel`;

	const response = await fetch(url, {
		method: "POST",
		headers: {
			Accept: "application/json",
			Authorization: getAuthHeader(),
		},
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(
			`Midtrans cancel error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`,
		);
	}
}

/**
 * Verify notification signature from Midtrans webhook
 * Signature = SHA512(order_id + status_code + gross_amount + server_key)
 */
export function verifyNotificationSignature(
	notification: MidtransNotification,
): boolean {
	const serverKey = env.MIDTRANS_SERVER_KEY;
	const signatureString = `${notification.order_id}${notification.status_code}${notification.gross_amount}${serverKey}`;
	const expectedSignature = crypto
		.createHash("sha512")
		.update(signatureString)
		.digest("hex");

	return notification.signature_key === expectedSignature;
}

/**
 * Map Midtrans transaction status to our payment status
 */
export function mapTransactionStatus(
	transactionStatus: string,
	fraudStatus?: string,
): "pending" | "paid" | "failed" | "expired" | "refunded" {
	switch (transactionStatus) {
		case "capture":
			// For credit card, need to check fraud status
			if (fraudStatus === "accept") {
				return "paid";
			}
			if (fraudStatus === "challenge") {
				return "pending";
			}
			return "failed";
		case "settlement":
			return "paid";
		case "pending":
			return "pending";
		case "deny":
		case "cancel":
		case "failure":
			return "failed";
		case "expire":
			return "expired";
		case "refund":
		case "partial_refund":
			return "refunded";
		default:
			return "pending";
	}
}

/**
 * Check if transaction is successful
 */
export function isTransactionSuccess(
	transactionStatus: string,
	fraudStatus?: string,
): boolean {
	if (transactionStatus === "capture") {
		return fraudStatus === "accept";
	}
	return transactionStatus === "settlement";
}

/**
 * Get client key for frontend
 */
export function getClientKey(): string {
	return env.MIDTRANS_CLIENT_KEY;
}

/**
 * Check if using production environment
 */
export function isProduction(): boolean {
	return env.MIDTRANS_IS_PRODUCTION;
}
