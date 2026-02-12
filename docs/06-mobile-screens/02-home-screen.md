# Home Screen

Main screen showing featured content.

## File

`apps/native/app/(app)/(tabs)/index.tsx`

## Features

- Featured products carousel
- Category quick links
- Search bar
- Recent orders (optional)

## Data Fetching

Uses TanStack Query to fetch featured products.

```typescript
const { data: featured } = useQuery({
  queryKey: ["featured-products"],
  queryFn: () => api.product.featured.query({ limit: 6 }),
});
```

## Components

- Hero section
- Category grid
- Product horizontal scroll
- Bottom navigation
