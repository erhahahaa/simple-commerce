# Cart Router

API endpoints for shopping cart.

## Procedures

### get

Get user's cart.

**Access:** Protected

**Input:** None

**Output:**
```typescript
{
  id: string
  items: CartItem[]
  totalItems: number
  totalPrice: number
}
```

### addItem

Add item to cart.

**Access:** Protected

**Input:**
```typescript
{
  productId: string
  quantity: number
}
```

### updateQuantity

Update item quantity.

**Access:** Protected

**Input:**
```typescript
{
  cartItemId: string
  quantity: number
}
```

### removeItem

Remove item from cart.

**Access:** Protected

**Input:** `{ cartItemId: string }`

### clear

Clear entire cart.

**Access:** Protected

**Input:** None
