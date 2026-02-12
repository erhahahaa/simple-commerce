# Cart Screen

Shopping cart management.

## File

`apps/native/app/(app)/(tabs)/cart.tsx`

## Features

- Cart items list
- Quantity adjustment
- Item removal
- Cart total
- Checkout button

## Data Fetching

```typescript
const { data: cart } = useQuery({
  queryKey: ["cart"],
  queryFn: () => api.cart.get.query(),
});
```

## Mutations

- Update quantity
- Remove item
- Clear cart

## Components

- Cart item cards
- Quantity controls
- Cart summary
- Empty state
