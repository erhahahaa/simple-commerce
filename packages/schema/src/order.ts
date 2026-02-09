import { z } from "zod";

// Order status enum
export const OrderStatusSchema = z.enum([
	"pending",
	"processing",
	"shipped",
	"delivered",
	"cancelled",
]);

export type OrderStatus = z.infer<typeof OrderStatusSchema>;

// Payment status enum
export const PaymentStatusSchema = z.enum([
	"pending",
	"paid",
	"failed",
	"expired",
	"refunded",
]);

export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

// Shipping status enum
export const ShippingStatusSchema = z.enum([
	"pending",
	"processing",
	"shipped",
	"in_transit",
	"delivered",
	"returned",
]);

export type ShippingStatus = z.infer<typeof ShippingStatusSchema>;

// Order item schema
export const OrderItemSchema = z.object({
	id: z.string(),
	orderId: z.string(),
	productId: z.string(),
	productName: z.string(),
	productImage: z.string().nullable(),
	quantity: z.number().int().positive(),
	price: z.number().int().nonnegative(),
	createdAt: z.coerce.date(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;

// Shipping info schema
export const ShippingInfoSchema = z.object({
	id: z.string(),
	orderId: z.string(),
	courier: z.string(),
	service: z.string(),
	estimatedDays: z.number().int().positive().nullable(),
	trackingNumber: z.string().nullable(),
	status: ShippingStatusSchema,
	shippedAt: z.coerce.date().nullable(),
	deliveredAt: z.coerce.date().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type ShippingInfo = z.infer<typeof ShippingInfoSchema>;

// Order schema
export const OrderSchema = z.object({
	id: z.string(),
	userId: z.string(),
	addressId: z.string().nullable(),
	status: OrderStatusSchema,
	paymentStatus: PaymentStatusSchema,
	subtotal: z.number().int().nonnegative(),
	shippingCost: z.number().int().nonnegative(),
	totalAmount: z.number().int().nonnegative(),
	midtransOrderId: z.string().nullable(),
	snapToken: z.string().nullable(),
	snapUrl: z.string().nullable(),
	paymentMethod: z.string().nullable(),
	paidAt: z.coerce.date().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type Order = z.infer<typeof OrderSchema>;

// Order with items
export const OrderWithItemsSchema = OrderSchema.extend({
	items: z.array(OrderItemSchema),
	shipping: ShippingInfoSchema.nullable(),
});

export type OrderWithItems = z.infer<typeof OrderWithItemsSchema>;

// Create order input (checkout)
export const CreateOrderSchema = z.object({
	addressId: z.string(),
	// Shipping details
	courier: z.string(), // e.g., "jne", "pos", "tiki"
	service: z.string(), // e.g., "REG", "YES", "OKE"
	shippingCost: z.number().int().nonnegative(),
	estimatedDays: z.number().int().positive().optional(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

// Order list query params
export const OrderListQuerySchema = z.object({
	status: OrderStatusSchema.optional(),
	paymentStatus: PaymentStatusSchema.optional(),
	limit: z.number().int().positive().max(50).default(20),
	offset: z.number().int().nonnegative().default(0),
});

export type OrderListQuery = z.infer<typeof OrderListQuerySchema>;

// Order list response
export const OrderListResponseSchema = z.object({
	orders: z.array(OrderWithItemsSchema),
	total: z.number().int().nonnegative(),
	limit: z.number().int().positive(),
	offset: z.number().int().nonnegative(),
});

export type OrderListResponse = z.infer<typeof OrderListResponseSchema>;

// Update order status (admin)
export const UpdateOrderStatusSchema = z.object({
	orderId: z.string(),
	status: OrderStatusSchema,
});

export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;

// Update shipping info
export const UpdateShippingSchema = z.object({
	orderId: z.string(),
	trackingNumber: z.string().optional(),
	status: ShippingStatusSchema.optional(),
});

export type UpdateShippingInput = z.infer<typeof UpdateShippingSchema>;

// Checkout response
export const CheckoutResponseSchema = z.object({
	order: OrderSchema,
	snapToken: z.string(),
	snapUrl: z.string(),
});

export type CheckoutResponse = z.infer<typeof CheckoutResponseSchema>;
