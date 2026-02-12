# Category Router

API endpoints for product categories.

## Procedures

### list

Get all categories.

**Access:** Public

**Input:** None

**Output:** Array of categories

```typescript
const categories = await api.category.list.query();
```

### getById

Get category by ID.

**Access:** Public

**Input:**
```typescript
{ id: string }
```

### getBySlug

Get category by slug.

**Access:** Public

**Input:**
```typescript
{ slug: string }
```

### create

Create new category.

**Access:** Protected

**Input:**
```typescript
{
  name: string
  slug: string
  description: string
  image: string
}
```

### update

Update category.

**Access:** Protected

**Input:**
```typescript
{
  id: string
  name?: string
  slug?: string
  description?: string
  image?: string
}
```

### delete

Delete category.

**Access:** Protected

**Input:**
```typescript
{ id: string }
```
