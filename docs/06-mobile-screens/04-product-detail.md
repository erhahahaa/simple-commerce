# Product Detail Screen

Individual product information.

## File

`apps/native/app/(app)/product/[slug].tsx`

## Features

- Image gallery
- Product info (name, price, description)
- Stock indicator
- Add to cart button
- Related products

## Route Parameters

- `slug`: Product slug from URL

## Data Fetching

```typescript
const { slug } = useLocalSearchParams();
const { data: product } = useQuery({
  queryKey: ["product", slug],
  queryFn: () => api.product.getBySlug.query({ slug }),
});
```

## Components

- Image carousel
- Product header
- Quantity selector
- Action buttons
