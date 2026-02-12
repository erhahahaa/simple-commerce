# Category Table

Product categories for organizing products.

## Schema

```typescript
{
  id: string (uuid, primary key)
  name: string
  slug: string (unique)
  description: string
  image: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Fields

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| name | string | Category name (e.g., Electronics) |
| slug | string | URL-friendly identifier |
| description | string | Category description |
| image | string | Category image URL |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last update time |

## Relations

- One-to-Many: products

## Indexes

- slug (unique) - For lookups by URL
