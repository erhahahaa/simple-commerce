# Database Relations

Table relationships defined in Drizzle ORM.

## Relation Definitions

Relations are defined in `packages/db/src/schema/relations.ts` to avoid circular imports.

## User Relations

```typescript
export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  cart: one(cart, {
    fields: [user.id],
    references: [cart.userId],
  }),
  addresses: many(address),
  orders: many(order),
}));
```

## Product Relations

```typescript
export const productRelations = relations(product, ({ one, many }) => ({
  category: one(category, {
    fields: [product.categoryId],
    references: [category.id],
  }),
  cartItems: many(cartItem),
  orderItems: many(orderItem),
}));
```

## Order Relations

```typescript
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
  shippingInfo: one(shippingInfo, {
    fields: [order.id],
    references: [shippingInfo.orderId],
  }),
}));
```

## ERD Overview

```
user ||--o{ session : has
user ||--o{ account : has
user ||--|| cart : owns
user ||--o{ address : has
user ||--o{ order : places
user ||--o{ wishlist : has

category ||--o{ product : contains

cart ||--o{ cartItem : contains
product ||--o{ cartItem : in

address ||--o{ order : ships_to

order ||--o{ orderItem : contains
product ||--o{ orderItem : in
order ||--|| shippingInfo : has
```
