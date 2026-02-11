import { db } from "@simple-commerce/db";
import {
	address,
	cart,
	cartItem,
	order,
	orderItem,
	product,
	shippingInfo,
} from "@simple-commerce/db/schema";
import {
	CheckoutResponseSchema,
	CreateOrderSchema,
	OrderListQuerySchema,
	OrderListResponseSchema,
	OrderSchema,
	OrderWithItemsSchema,
	SimulateStepInputSchema,
	SimulateStepResponseSchema,
	UpdateOrderStatusSchema,
	UpdateShippingSchema,
} from "@simple-commerce/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { protectedProcedure } from "../index";

// Helper to generate unique IDs
function generateId(prefix: string) {
	return `${prefix}_${crypto.randomUUID()}`;
}

// Helper to generate Midtrans order ID (must be unique across all transactions)
function generateMidtransOrderId() {
	const timestamp = Date.now();
	const random = Math.random().toString(36).substring(2, 8);
	return `ORDER-${timestamp}-${random}`.toUpperCase();
}

export const orderRouter = {
	/**
	 * Get user's orders with pagination and filtering
	 */
	list: protectedProcedure
		.input(OrderListQuerySchema)
		.output(OrderListResponseSchema)
		.handler(async ({ context, input }) => {
			const userId = context.session.user.id;

			// Build where conditions
			const conditions = [eq(order.userId, userId)];
			if (input.status) {
				conditions.push(eq(order.status, input.status));
			}
			if (input.paymentStatus) {
				conditions.push(eq(order.paymentStatus, input.paymentStatus));
			}

			// Get total count
			const [countResult] = await db
				.select({ count: sql<number>`count(*)::int` })
				.from(order)
				.where(and(...conditions));

			const total = countResult?.count ?? 0;

			// Get orders with items and shipping
			const orders = await db.query.order.findMany({
				where: and(...conditions),
				orderBy: [desc(order.createdAt)],
				limit: input.limit,
				offset: input.offset,
				with: {
					items: true,
					shippingInfo: true,
				},
			});

			return {
				orders: orders.map((o) => ({
					...o,
					items: o.items ?? [],
					shipping: o.shippingInfo ?? null,
				})),
				total,
				limit: input.limit,
				offset: input.offset,
			};
		}),

	/**
	 * Get order by ID
	 */
	getById: protectedProcedure
		.input(z.object({ id: z.string().min(1, "Order ID is required") }))
		.output(OrderWithItemsSchema.nullable())
		.handler(async ({ context, input }) => {
			const userId = context.session.user.id;

			const result = await db.query.order.findFirst({
				where: and(eq(order.id, input.id), eq(order.userId, userId)),
				with: {
					items: true,
					shippingInfo: true,
				},
			});

			if (!result) return null;

			return {
				...result,
				items: result.items ?? [],
				shipping: result.shippingInfo ?? null,
			};
		}),

	/**
	 * Get order by Midtrans order ID
	 */
	getByMidtransId: protectedProcedure
		.input(
			z.object({
				midtransOrderId: z.string().min(1, "Midtrans order ID is required"),
			}),
		)
		.output(OrderWithItemsSchema.nullable())
		.handler(async ({ context, input }) => {
			const userId = context.session.user.id;

			const result = await db.query.order.findFirst({
				where: and(
					eq(order.midtransOrderId, input.midtransOrderId),
					eq(order.userId, userId),
				),
				with: {
					items: true,
					shippingInfo: true,
				},
			});

			if (!result) return null;

			return {
				...result,
				items: result.items ?? [],
				shipping: result.shippingInfo ?? null,
			};
		}),

	/**
	 * Checkout - Create order from cart and get payment token
	 * This is the main checkout flow:
	 * 1. Get cart items
	 * 2. Validate stock
	 * 3. Create order and order items
	 * 4. Create shipping info
	 * 5. Create Midtrans transaction
	 * 6. Clear cart
	 * 7. Return order with snap token
	 */
	checkout: protectedProcedure
		.input(CreateOrderSchema)
		.output(CheckoutResponseSchema)
		.handler(async ({ context, input }) => {
			const userId = context.session.user.id;
			const user = context.session.user;

			// Validate address exists and belongs to user
			const userAddress = await db.query.address.findFirst({
				where: and(eq(address.id, input.addressId), eq(address.userId, userId)),
			});

			if (!userAddress) {
				throw new Error(`Address not found (ID: ${input.addressId})`);
			}

			// 1. Get user's cart with items
			const userCart = await db.query.cart.findFirst({
				where: eq(cart.userId, userId),
				with: {
					items: {
						with: {
							product: true,
						},
					},
				},
			});

			if (!userCart || !userCart.items || userCart.items.length === 0) {
				throw new Error("Cart is empty. Please add items before checkout.");
			}

			// 2. Validate stock and calculate subtotal
			let subtotal = 0;
			const itemsToCreate: {
				productId: string;
				productName: string;
				productImage: string | null;
				quantity: number;
				price: number;
			}[] = [];

			for (const item of userCart.items) {
				if (!item.product) {
					throw new Error(
						`Product not found (ID: ${item.productId}). It may have been removed.`,
					);
				}

				// Re-validate stock at checkout time
				const currentProduct = await db.query.product.findFirst({
					where: eq(product.id, item.productId),
				});

				if (!currentProduct) {
					throw new Error(
						`Product "${item.product.name}" is no longer available.`,
					);
				}

				if (currentProduct.stock < item.quantity) {
					throw new Error(
						`Insufficient stock for "${item.product.name}". Only ${currentProduct.stock} available, but you have ${item.quantity} in cart.`,
					);
				}

				const itemTotal = currentProduct.price * item.quantity;
				subtotal += itemTotal;

				itemsToCreate.push({
					productId: item.productId,
					productName: item.product.name,
					productImage: item.product.images?.[0] ?? null,
					quantity: item.quantity,
					price: currentProduct.price, // Use current price
				});
			}

			const totalAmount = subtotal + input.shippingCost;

			// 3. Create order
			const orderId = generateId("ord");
			const midtransOrderId = generateMidtransOrderId();

			// Use dynamic import for Midtrans to avoid circular dependency issues
			const { createSnapTransaction } = await import("../services/midtrans");

			// 4. Create Midtrans transaction first to get token
			const snapResponse = await createSnapTransaction({
				transaction_details: {
					order_id: midtransOrderId,
					gross_amount: totalAmount,
				},
				item_details: [
					...itemsToCreate.map((item) => ({
						id: item.productId,
						price: item.price,
						quantity: item.quantity,
						name: item.productName.substring(0, 50), // Midtrans limit
					})),
					// Add shipping as an item
					{
						id: "SHIPPING",
						price: input.shippingCost,
						quantity: 1,
						name: `Shipping (${input.courier.toUpperCase()} ${input.service})`,
					},
				],
				customer_details: {
					first_name: user.name ?? "Customer",
					email: user.email,
				},
				enabled_payments: [
					"bca_va",
					"bni_va",
					"bri_va",
					"permata_va",
					"other_va",
					"gopay",
					"shopeepay",
					"credit_card",
					"indomaret",
					"alfamart",
					"echannel",
				],
				credit_card: {
					secure: true,
				},
				expiry: {
					unit: "hour",
					duration: 24,
				},
			});

			// 5. Create order in database (inside transaction for atomicity)
			await db.transaction(async (tx) => {
				// Insert order
				await tx.insert(order).values({
					id: orderId,
					userId,
					addressId: input.addressId,
					status: "pending",
					paymentStatus: "pending",
					subtotal,
					shippingCost: input.shippingCost,
					totalAmount,
					midtransOrderId,
					snapToken: snapResponse.token,
					snapUrl: snapResponse.redirect_url,
				});

				// Insert order items and decrease stock atomically
				for (const item of itemsToCreate) {
					await tx.insert(orderItem).values({
						id: generateId("oi"),
						orderId,
						productId: item.productId,
						productName: item.productName,
						productImage: item.productImage,
						quantity: item.quantity,
						price: item.price,
					});

					// Decrease product stock with check constraint
					const [updatedProduct] = await tx
						.update(product)
						.set({
							stock: sql`GREATEST(0, ${product.stock} - ${item.quantity})`,
						})
						.where(eq(product.id, item.productId))
						.returning({ stock: product.stock });

					// Verify stock didn't go negative (race condition check)
					if (updatedProduct && updatedProduct.stock < 0) {
						throw new Error(
							`Stock exhausted for product "${item.productName}" during checkout. Please try again.`,
						);
					}
				}

				// Insert shipping info
				await tx.insert(shippingInfo).values({
					id: generateId("ship"),
					orderId,
					courier: input.courier,
					service: input.service,
					estimatedDays: input.estimatedDays ?? null,
					status: "pending",
				});

				// Clear cart
				await tx.delete(cartItem).where(eq(cartItem.cartId, userCart.id));
			});

			// 6. Get created order
			const createdOrder = await db.query.order.findFirst({
				where: eq(order.id, orderId),
			});

			if (!createdOrder) {
				throw new Error("Failed to create order. Please try again.");
			}

			return {
				order: createdOrder,
				snapToken: snapResponse.token,
				snapUrl: snapResponse.redirect_url,
			};
		}),

	/**
	 * Update order status (for admin or webhook)
	 */
	updateStatus: protectedProcedure
		.input(UpdateOrderStatusSchema)
		.output(OrderSchema)
		.handler(async ({ context, input }) => {
			const userId = context.session.user.id;

			return db.transaction(async (tx) => {
				// Verify ownership (in production, add admin check)
				const existing = await tx.query.order.findFirst({
					where: and(eq(order.id, input.orderId), eq(order.userId, userId)),
				});

				if (!existing) {
					throw new Error(`Order not found (ID: ${input.orderId})`);
				}

				// Validate status transition
				const validTransitions: Record<string, string[]> = {
					pending: ["processing", "cancelled"],
					processing: ["shipped", "cancelled"],
					shipped: ["delivered"],
					delivered: [], // Terminal state
					cancelled: [], // Terminal state
				};

				const allowedStatuses = validTransitions[existing.status] ?? [];
				if (!allowedStatuses.includes(input.status)) {
					throw new Error(
						`Cannot transition order from "${existing.status}" to "${input.status}". Allowed: ${allowedStatuses.join(", ") || "none"}`,
					);
				}

				const [updated] = await tx
					.update(order)
					.set({
						status: input.status,
						updatedAt: new Date(),
					})
					.where(eq(order.id, input.orderId))
					.returning();

				if (!updated) {
					throw new Error("Failed to update order status");
				}

				return updated;
			});
		}),

	/**
	 * Update shipping info
	 */
	updateShipping: protectedProcedure
		.input(UpdateShippingSchema)
		.output(z.object({ success: z.boolean() }))
		.handler(async ({ context, input }) => {
			const userId = context.session.user.id;

			return db.transaction(async (tx) => {
				// Verify order ownership
				const existing = await tx.query.order.findFirst({
					where: and(eq(order.id, input.orderId), eq(order.userId, userId)),
					with: {
						shippingInfo: true,
					},
				});

				if (!existing) {
					throw new Error(`Order not found (ID: ${input.orderId})`);
				}

				if (!existing.shippingInfo) {
					throw new Error(
						`Shipping info not found for order (ID: ${input.orderId})`,
					);
				}

				const updateData: Record<string, unknown> = {
					updatedAt: new Date(),
				};

				if (input.trackingNumber !== undefined) {
					updateData.trackingNumber = input.trackingNumber;
				}

				if (input.status !== undefined) {
					// Validate shipping status transition
					const currentStatus = existing.shippingInfo.status;
					const validTransitions: Record<string, string[]> = {
						pending: ["processing", "shipped"],
						processing: ["shipped"],
						shipped: ["in_transit"],
						in_transit: ["delivered", "returned"],
						delivered: [], // Terminal state
						returned: [], // Terminal state
					};

					const allowedStatuses = validTransitions[currentStatus] ?? [];
					if (!allowedStatuses.includes(input.status)) {
						throw new Error(
							`Cannot transition shipping from "${currentStatus}" to "${input.status}". Allowed: ${allowedStatuses.join(", ") || "none"}`,
						);
					}

					updateData.status = input.status;
					if (input.status === "shipped") {
						updateData.shippedAt = new Date();
					} else if (input.status === "delivered") {
						updateData.deliveredAt = new Date();
					}
				}

				await tx
					.update(shippingInfo)
					.set(updateData)
					.where(eq(shippingInfo.orderId, input.orderId));

				// Update order status if shipping status changed
				if (input.status === "shipped") {
					await tx
						.update(order)
						.set({ status: "shipped", updatedAt: new Date() })
						.where(eq(order.id, input.orderId));
				} else if (input.status === "delivered") {
					await tx
						.update(order)
						.set({ status: "delivered", updatedAt: new Date() })
						.where(eq(order.id, input.orderId));
				}

				return { success: true };
			});
		}),

	/**
	 * Cancel order (only if pending payment)
	 */
	cancel: protectedProcedure
		.input(z.object({ orderId: z.string().min(1, "Order ID is required") }))
		.output(OrderSchema)
		.handler(async ({ context, input }) => {
			const userId = context.session.user.id;

			const existing = await db.query.order.findFirst({
				where: and(eq(order.id, input.orderId), eq(order.userId, userId)),
				with: {
					items: true,
				},
			});

			if (!existing) {
				throw new Error(`Order not found (ID: ${input.orderId})`);
			}

			if (existing.paymentStatus !== "pending") {
				throw new Error(
					`Cannot cancel order with payment status "${existing.paymentStatus}". Only pending orders can be cancelled.`,
				);
			}

			if (existing.status !== "pending") {
				throw new Error(
					`Cannot cancel order with status "${existing.status}". Only pending orders can be cancelled.`,
				);
			}

			// Restore stock in transaction
			await db.transaction(async (tx) => {
				for (const item of existing.items ?? []) {
					await tx
						.update(product)
						.set({
							stock: sql`${product.stock} + ${item.quantity}`,
						})
						.where(eq(product.id, item.productId));
				}

				// Update order status
				await tx
					.update(order)
					.set({
						status: "cancelled",
						paymentStatus: "failed",
						updatedAt: new Date(),
					})
					.where(eq(order.id, input.orderId));
			});

			// Try to cancel on Midtrans if has order ID
			if (existing.midtransOrderId) {
				try {
					const { cancelTransaction } = await import("../services/midtrans");
					await cancelTransaction(existing.midtransOrderId);
				} catch (e) {
					// Log but don't fail - order is already cancelled locally
					console.error("Failed to cancel Midtrans transaction:", e);
				}
			}

			const updated = await db.query.order.findFirst({
				where: eq(order.id, input.orderId),
			});

			if (!updated) {
				throw new Error("Failed to get updated order");
			}

			return updated;
		}),

	/**
	 * Simulate order progression (for testing/demo purposes)
	 * Advances order through: processing -> shipped -> in_transit -> delivered
	 * This simulates what would normally happen via admin dashboard
	 */
	simulateNextStep: protectedProcedure
		.input(SimulateStepInputSchema)
		.output(SimulateStepResponseSchema)
		.handler(async ({ context, input }) => {
			const userId = context.session.user.id;

			return db.transaction(async (tx) => {
				// Get order with shipping info
				const existing = await tx.query.order.findFirst({
					where: and(eq(order.id, input.orderId), eq(order.userId, userId)),
					with: {
						shippingInfo: true,
					},
				});

				if (!existing) {
					throw new Error(`Order not found (ID: ${input.orderId})`);
				}

				if (existing.paymentStatus !== "paid") {
					throw new Error(
						`Order must be paid before simulation. Current payment status: "${existing.paymentStatus}"`,
					);
				}

				if (existing.status === "cancelled") {
					throw new Error("Cannot simulate cancelled order");
				}

				if (existing.status === "delivered") {
					throw new Error("Order is already delivered");
				}

				const currentShippingStatus =
					existing.shippingInfo?.status ?? "pending";

				// Validate step is valid for current state
				const validTransitions: Record<string, string[]> = {
					pending: ["shipped"],
					processing: ["shipped"],
					shipped: ["in_transit"],
					in_transit: ["delivered"],
				};

				const allowedSteps = validTransitions[currentShippingStatus] ?? [];
				if (!allowedSteps.includes(input.step)) {
					throw new Error(
						`Invalid step "${input.step}" for current shipping status "${currentShippingStatus}". ` +
							`Allowed: ${allowedSteps.join(", ") || "none"}`,
					);
				}

				let trackingNumber: string | null =
					existing.shippingInfo?.trackingNumber ?? null;
				let message = "";
				let nextStep: "shipped" | "in_transit" | "delivered" | null = null;

				// Execute the simulation step
				if (input.step === "shipped") {
					// Generate fake tracking number
					const courier =
						existing.shippingInfo?.courier?.toUpperCase() ?? "JNE";
					const timestamp = Date.now().toString().slice(-10);
					const random = Math.random()
						.toString(36)
						.substring(2, 6)
						.toUpperCase();
					trackingNumber = `${courier}${timestamp}${random}`;

					// Update shipping info
					await tx
						.update(shippingInfo)
						.set({
							status: "shipped",
							trackingNumber,
							shippedAt: new Date(),
							updatedAt: new Date(),
						})
						.where(eq(shippingInfo.orderId, input.orderId));

					// Update order status
					await tx
						.update(order)
						.set({
							status: "shipped",
							updatedAt: new Date(),
						})
						.where(eq(order.id, input.orderId));

					message = `Order shipped! Tracking number ${trackingNumber} has been generated. Package handed to ${courier} courier.`;
					nextStep = "in_transit";
				} else if (input.step === "in_transit") {
					// Update shipping status to in_transit
					await tx
						.update(shippingInfo)
						.set({
							status: "in_transit",
							updatedAt: new Date(),
						})
						.where(eq(shippingInfo.orderId, input.orderId));

					message =
						"Package is now in transit. It's being delivered to your address by the courier.";
					nextStep = "delivered";
				} else if (input.step === "delivered") {
					// Update shipping info
					await tx
						.update(shippingInfo)
						.set({
							status: "delivered",
							deliveredAt: new Date(),
							updatedAt: new Date(),
						})
						.where(eq(shippingInfo.orderId, input.orderId));

					// Update order status
					await tx
						.update(order)
						.set({
							status: "delivered",
							updatedAt: new Date(),
						})
						.where(eq(order.id, input.orderId));

					message =
						"Order delivered successfully! The package has been received.";
					nextStep = null;
				}

				// Get updated order/shipping status
				const updatedOrder = await tx.query.order.findFirst({
					where: eq(order.id, input.orderId),
					with: {
						shippingInfo: true,
					},
				});

				return {
					success: true,
					message,
					trackingNumber,
					orderStatus: updatedOrder?.status ?? "processing",
					shippingStatus: updatedOrder?.shippingInfo?.status ?? "pending",
					nextStep,
				};
			});
		}),
};
