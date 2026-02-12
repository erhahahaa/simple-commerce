# Wishlist Table

User wishlist items.

## Schema

```typescript
{
  id: string (uuid, primary key)
  userId: string (foreign key → user.id)
  productId: string (foreign key → product.id)
  createdAt: timestamp
}
```

## Fields

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| userId | uuid | User reference |
| productId | uuid | Product reference |
| createdAt | timestamp | Added time |

## Relations

- Many-to-One: user
- Many-to-One: product

## Indexes

- userId - For user wishlist queries
- productId - For product lookups
- Unique constraint on (userId, productId)
