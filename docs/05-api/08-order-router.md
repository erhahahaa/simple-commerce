# Order Router

API endpoints for orders.

## Procedures

### list

Get user's orders.

**Access:** Protected

**Input:**
```typescript
{
  limit?: number
  offset?: number
  status?: OrderStatus
}
```

**Output:**
```typescript
{
  orders: Order[]
  total: number
}
```

### getById

Get order by ID.

**Access:** Protected

**Input:** `{ id: string }`

### checkout

Create order from cart.

**Access:** Protected

**Input:**
```typescript
{
  addressId: string
  shippingData: {
    courier: string
    service: string
    cost: number
  }
}
```

**Output:** Order object

### cancel

Cancel pending order.

**Access:** Protected

**Input:** `{ id: string }`
