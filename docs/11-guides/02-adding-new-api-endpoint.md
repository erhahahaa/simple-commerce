# Adding a New API Endpoint

Step-by-step guide for adding API endpoints.

## Step 1: Define the Endpoint

What will it do? What are the inputs/outputs?

Example: Get product reviews

## Step 2: Update Router

File: `packages/api/src/routers/product.ts`

```typescript
export const productRouter = os.router({
  // ... existing procedures
  
  getReviews: publicProcedure
    .input(z.object({ productId: z.string() }))
    .output(z.array(reviewSchema))
    .handler(async ({ input, context }) => {
      const reviews = await context.db.query.review.findMany({
        where: eq(review.productId, input.productId),
      });
      return reviews;
    }),
});
```

## Step 3: Add Schema (if needed)

File: `packages/schema/src/index.ts`

```typescript
export const reviewSchema = z.object({
  id: z.string(),
  productId: z.string(),
  userId: z.string(),
  rating: z.number(),
  comment: z.string(),
  createdAt: z.date(),
});
```

## Step 4: Test the Endpoint

```bash
# Restart server
bun run dev:server

# Test with curl
curl http://localhost:3000/rpc/product.getReviews \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"productId": "uuid-here"}'
```

## Step 5: Use in Mobile App

```typescript
const { data: reviews } = useQuery({
  queryKey: ["reviews", productId],
  queryFn: () => api.product.getReviews.query({ productId }),
});
```

## Step 6: Document

Add documentation in `docs/05-api/`.
