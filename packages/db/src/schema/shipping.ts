import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { order } from "./order";

// Shipping status enum values
export const SHIPPING_STATUS = {
	PENDING: "pending",
	PROCESSING: "processing",
	SHIPPED: "shipped",
	IN_TRANSIT: "in_transit",
	DELIVERED: "delivered",
	RETURNED: "returned",
} as const;

export type ShippingStatus =
	(typeof SHIPPING_STATUS)[keyof typeof SHIPPING_STATUS];

export const shippingInfo = pgTable(
	"shipping_info",
	{
		id: text("id").primaryKey(),
		orderId: text("order_id")
			.notNull()
			.unique()
			.references(() => order.id, { onDelete: "cascade" }),
		courier: text("courier").notNull(), // e.g., "jne", "pos", "tiki"
		service: text("service").notNull(), // e.g., "REG", "YES", "OKE"
		estimatedDays: integer("estimated_days"),
		trackingNumber: text("tracking_number"),
		status: text("status").$type<ShippingStatus>().default("pending").notNull(),
		shippedAt: timestamp("shipped_at"),
		deliveredAt: timestamp("delivered_at"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("shipping_order_idx").on(table.orderId),
		index("shipping_tracking_idx").on(table.trackingNumber),
	],
);
