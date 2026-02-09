import { relations } from "drizzle-orm";
import { address } from "./address";
// Import all tables
import { user } from "./auth";
import { cart, cartItem } from "./cart";
import { category } from "./category";
import { order, orderItem } from "./order";
import { product } from "./product";
import { shippingInfo } from "./shipping";
import { wishlist } from "./wishlist";

// ============================================
// Category Relations
// ============================================

export const categoryRelations = relations(category, ({ many }) => ({
	products: many(product),
}));

// ============================================
// Product Relations
// ============================================

export const productRelations = relations(product, ({ one, many }) => ({
	category: one(category, {
		fields: [product.categoryId],
		references: [category.id],
	}),
	cartItems: many(cartItem),
	orderItems: many(orderItem),
	wishlistItems: many(wishlist),
}));

// ============================================
// Cart Relations
// ============================================

export const cartRelations = relations(cart, ({ one, many }) => ({
	user: one(user, {
		fields: [cart.userId],
		references: [user.id],
	}),
	items: many(cartItem),
}));

export const cartItemRelations = relations(cartItem, ({ one }) => ({
	cart: one(cart, {
		fields: [cartItem.cartId],
		references: [cart.id],
	}),
	product: one(product, {
		fields: [cartItem.productId],
		references: [product.id],
	}),
}));

// ============================================
// Address Relations
// ============================================

export const addressRelations = relations(address, ({ one, many }) => ({
	user: one(user, {
		fields: [address.userId],
		references: [user.id],
	}),
	orders: many(order),
}));

// ============================================
// Order Relations
// ============================================

export const orderRelations = relations(order, ({ one, many }) => ({
	user: one(user, {
		fields: [order.userId],
		references: [user.id],
	}),
	address: one(address, {
		fields: [order.addressId],
		references: [address.id],
	}),
	items: many(orderItem),
	shippingInfo: one(shippingInfo),
}));

export const orderItemRelations = relations(orderItem, ({ one }) => ({
	order: one(order, {
		fields: [orderItem.orderId],
		references: [order.id],
	}),
	product: one(product, {
		fields: [orderItem.productId],
		references: [product.id],
	}),
}));

// ============================================
// Shipping Relations
// ============================================

export const shippingInfoRelations = relations(shippingInfo, ({ one }) => ({
	order: one(order, {
		fields: [shippingInfo.orderId],
		references: [order.id],
	}),
}));

// ============================================
// Wishlist Relations
// ============================================

export const wishlistRelations = relations(wishlist, ({ one }) => ({
	user: one(user, {
		fields: [wishlist.userId],
		references: [user.id],
	}),
	product: one(product, {
		fields: [wishlist.productId],
		references: [product.id],
	}),
}));
