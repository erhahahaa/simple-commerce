# Product Router

API endpoints for products.

## Procedures

### list

Get products with filtering and pagination.

**Access:** Public

**Input:**
```typescript
{
  categoryId?: string
  search?: string
  limit?: number
  offset?: number
  sortBy?: "name" | "price" | "createdAt"
  sortOrder?: "asc" | "desc"
}
```

**Output:**
```typescript
{
  products: Product[]
  total: number
}
```

### getById

Get product by ID.

**Access:** Public

**Input:** `{ id: string }`

### getBySlug

Get product by slug.

**Access:** Public

**Input:** `{ slug: string }`

### featured

Get featured products.

**Access:** Public

**Input:** `{ limit?: number }`

### create

Create product.

**Access:** Protected

**Input:**
```typescript
{
  name: string
  slug: string
  description: string
  price: number
  stock: number
  images: string[]
  isFeatured?: boolean
  categoryId: string
}
```

### update

Update product.

**Access:** Protected

**Input:** Product fields with id

### delete

Delete product.

**Access:** Protected

**Input:** `{ id: string }`
