# Order Detail Screen

Detailed order information.

## File

`apps/native/app/(app)/order/[id].tsx`

## Features

- Order information
- Item list
- Shipping details
- Payment status
- Tracking information
- Cancel order button

## Route Parameters

- `id`: Order ID

## Data Fetching

```typescript
const { id } = useLocalSearchParams();
const { data: order } = useQuery({
  queryKey: ["order", id],
  queryFn: () => api.order.getById.query({ id }),
});
```

## Components

- Order header
- Item list
- Shipping card
- Payment status
- Action buttons
