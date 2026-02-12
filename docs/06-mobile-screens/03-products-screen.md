# Products Screen

Product listing with search and filters.

## File

`apps/native/app/(app)/(tabs)/products.tsx`

## Features

- Product grid
- Search functionality
- Category filter
- Pull-to-refresh
- Infinite scroll

## Data Fetching

```typescript
const { data, fetchNextPage } = useInfiniteQuery({
  queryKey: ["products", search, categoryId],
  queryFn: ({ pageParam }) => api.product.list.query({
    search,
    categoryId,
    offset: pageParam,
  }),
});
```

## Components

- Search input
- Category filter chips
- Product grid
- Loading skeletons
