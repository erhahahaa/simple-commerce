# Shipping Table

Shipping information for orders.

## Shipping Info Table

**Schema:**
```typescript
{
  id: string (uuid, primary key)
  orderId: string (foreign key → order.id, unique)
  courier: string
  service: string
  estimatedDays: string
  trackingNumber: string (optional)
  cost: integer
  status: ShippingStatus
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Fields

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| orderId | uuid | Order reference (unique) |
| courier | string | Courier name (jne, tiki, pos) |
| service | string | Service type (REG, OKE, etc.) |
| estimatedDays | string | Estimated delivery time |
| trackingNumber | string | Tracking number (optional) |
| cost | integer | Shipping cost in cents |
| status | ShippingStatus | Shipping status |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last update time |

## Shipping Status Values

- pending
- processing
- shipped
- in_transit
- delivered
- cancelled

## Relations

- One-to-One: order
