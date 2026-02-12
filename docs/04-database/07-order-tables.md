# Order Tables

Order management and history.

## Order Table

Customer orders.

**Schema:**
```typescript
{
  id: string (uuid, primary key)
  userId: string (foreign key → user.id)
  addressId: string (foreign key → address.id)
  status: OrderStatus
  totalAmount: integer (cents)
  shippingCost: integer (cents)
  paymentStatus: PaymentStatus
  snapToken: string (optional)
  snapUrl: string (optional)
  midtransOrderId: string (optional)
  paidAt: timestamp (optional)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Enums:**

OrderStatus:
- pending
- processing
- shipped
- delivered
- cancelled

PaymentStatus:
- pending
- paid
- failed
- expired
- refunded

## Order Item Table

Line items in an order.

**Schema:**
```typescript
{
  id: string (uuid, primary key)
  orderId: string (foreign key → order.id)
  productId: string (foreign key → product.id)
  productName: string
  productPrice: integer
  quantity: integer
  subtotal: integer
  createdAt: timestamp
}
```

**Fields:**
- productName: Snapshot of product name at order time
- productPrice: Snapshot of product price at order time
- subtotal: productPrice * quantity

**Relations:**
- Many-to-One: order
- Many-to-One: product
