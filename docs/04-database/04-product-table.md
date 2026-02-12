# Product Table

Product catalog with details and inventory.

## Schema

```typescript
{
  id: string (uuid, primary key)
  name: string
  slug: string (unique)
  description: string
  price: integer (cents)
  stock: integer
  images: string[]
  isFeatured: boolean
  categoryId: string (foreign key → category.id)
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Fields

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| name | string | Product name |
| slug | string | URL-friendly identifier |
| description | string | Product description |
| price | integer | Price in cents (IDR) |
| stock | integer | Available quantity |
| images | string[] | Array of image URLs |
| isFeatured | boolean | Featured on home page |
| categoryId | uuid | Category reference |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last update time |

## Relations

- Many-to-One: category
- One-to-Many: cart_items
- One-to-Many: order_items

## Indexes

- slug (unique) - For lookups by URL
- categoryId - For category filtering
- isFeatured - For featured products query
