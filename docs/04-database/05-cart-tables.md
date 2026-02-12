# Cart Tables

Shopping cart functionality.

## Cart Table

User shopping cart container.

**Schema:**
```typescript
{
  id: string (uuid, primary key)
  userId: string (foreign key → user.id, unique)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Relations:**
- One-to-One: user
- One-to-Many: cart_items

## Cart Item Table

Individual items in a cart.

**Schema:**
```typescript
{
  id: string (uuid, primary key)
  cartId: string (foreign key → cart.id)
  productId: string (foreign key → product.id)
  quantity: integer
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| cartId | uuid | Cart reference |
| productId | uuid | Product reference |
| quantity | integer | Item quantity |
| createdAt | timestamp | Added time |
| updatedAt | timestamp | Last update |

**Relations:**
- Many-to-One: cart
- Many-to-One: product

**Indexes:**
- cartId - For cart queries
- productId - For product lookups
- Unique constraint on (cartId, productId)
