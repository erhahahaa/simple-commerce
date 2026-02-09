import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { address } from "./address";
import { user } from "./auth";
import { product } from "./product";

// Order status enum values
export const ORDER_STATUS = {
	PENDING: "pending",
	PROCESSING: "processing",
	SHIPPED: "shipped",
	DELIVERED: "delivered",
	CANCELLED: "cancelled",
} as const;

// Payment status enum values
export const PAYMENT_STATUS = {
	PENDING: "pending",
	PAID: "paid",
	FAILED: "failed",
	EXPIRED: "expired",
	REFUNDED: "refunded",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
export type PaymentStatus =
	(typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const order = pgTable(
	"order",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		addressId: text("address_id").references(() => address.id, {
			onDelete: "set null",
		}),
		status: text("status").$type<OrderStatus>().default("pending").notNull(),
		paymentStatus: text("payment_status")
			.$type<PaymentStatus>()
			.default("pending")
			.notNull(),
		subtotal: integer("subtotal").notNull(), // Product total in cents (IDR)
		shippingCost: integer("shipping_cost").notNull().default(0),
		totalAmount: integer("total_amount").notNull(), // subtotal + shippingCost
		// Midtrans fields
		midtransOrderId: text("midtrans_order_id").unique(),
		snapToken: text("snap_token"),
		snapUrl: text("snap_url"),
		paymentMethod: text("payment_method"),
		paidAt: timestamp("paid_at"),
		// Timestamps
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("order_user_idx").on(table.userId),
		index("order_midtrans_idx").on(table.midtransOrderId),
		index("order_status_idx").on(table.status),
	],
);

export const orderItem = pgTable(
	"order_item",
	{
		id: text("id").primaryKey(),
		orderId: text("order_id")
			.notNull()
			.references(() => order.id, { onDelete: "cascade" }),
		productId: text("product_id")
			.notNull()
			.references(() => product.id, { onDelete: "cascade" }),
		productName: text("product_name").notNull(), // Snapshot of product name
		productImage: text("product_image"), // Snapshot of product image
		quantity: integer("quantity").notNull(),
		price: integer("price").notNull(), // Price at time of order in cents (IDR)
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("order_item_order_idx").on(table.orderId),
		index("order_item_product_idx").on(table.productId),
	],
);
