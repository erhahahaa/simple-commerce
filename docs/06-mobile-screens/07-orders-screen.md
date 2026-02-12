# Orders Screen

Order history listing.

## File

`apps/native/app/(app)/(tabs)/orders.tsx`

## Features

- Order list
- Status badges
- Pull-to-refresh
- Pagination

## Data Fetching

```typescript
const { data, fetchNextPage } = useInfiniteQuery({
  queryKey: ["orders"],
  queryFn: ({ pageParam }) => api.order.list.query({
    offset: pageParam,
  }),
});
```

## Order Statuses

- Pending
- Processing
- Shipped
- Delivered
- Cancelled

## Components

- Order list item
- Status badge
- Empty state
- Loading skeletons
