# Backend Architecture

Architecture of the Hono backend server.

## Architecture Overview

```
┌────────────────────────────────────────────────────────────┐
│                      HTTP LAYER                             │
├────────────────────────────────────────────────────────────┤
│  Hono App                                                   │
│  ├── CORS Middleware                                        │
│  ├── Auth Routes          # Better Auth                     │
│  ├── Webhook Routes       # Midtrans                        │
│  └── ORPC Handler         # API routes                      │
├────────────────────────────────────────────────────────────┤
│                       API LAYER                             │
├────────────────────────────────────────────────────────────┤
│  ORPC Routers                                               │
│  ├── Procedures           # public, protected               │
│  ├── Context            # Request context                   │
│  └── Routers            # Business logic                    │
├────────────────────────────────────────────────────────────┤
│                     SERVICE LAYER                           │
├────────────────────────────────────────────────────────────┤
│  External Services                                          │
│  ├── Midtrans Service     # Payment processing              │
│  ├── Raja Ongkir Service  # Shipping calculation            │
│  └── Resend Service       # Email delivery                  │
├────────────────────────────────────────────────────────────┤
│                      DATA LAYER                             │
├────────────────────────────────────────────────────────────┤
│  Database                                                   │
│  └── Drizzle ORM          # PostgreSQL                      │
└────────────────────────────────────────────────────────────┘
```

## Server Entry Point

**File:** `apps/server/src/index.ts`

**Responsibilities:**
1. Create Hono app
2. Configure CORS
3. Mount auth routes
4. Mount ORPC handler
5. Mount webhook routes
6. Start server

```typescript
const app = new Hono();

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

// Auth routes
app.route("/api/auth", auth.handler);

// Webhook routes
app.post("/api/payments/webhook/midtrans", handleMidtransWebhook);

// ORPC handler
app.use("/rpc/*", orpcHandler);

// Start server
Bun.serve({
  fetch: app.fetch,
  port: 3000,
});
```

## ORPC Architecture

### Procedures

**Public Procedure:**
```typescript
export const publicProcedure = os
  .use(async ({ next }) => {
    const context = await createContext();
    return next({ context });
  });
```

**Protected Procedure:**
```typescript
export const protectedProcedure = os
  .use(async ({ next }) => {
    const context = await createContext();
    if (!context.session) {
      throw new Error("Unauthorized");
    }
    return next({ context });
  });
```

### Context Creation

**File:** `packages/api/src/context.ts`

```typescript
export async function createContext() {
  // Get session from request
  const session = await getSession();
  
  return {
    session,
    db,
    user: session?.user,
  };
}
```

### Router Structure

```typescript
// packages/api/src/routers/index.ts
export const appRouter = os.router({
  category: categoryRouter,
  product: productRouter,
  cart: cartRouter,
  address: addressRouter,
  shipping: shippingRouter,
  order: orderRouter,
  payment: paymentRouter,
  wishlist: wishlistRouter,
});
```

## Router Patterns

### Query (Read Operations)

```typescript
export const productRouter = os.router({
  list: publicProcedure
    .input(z.object({ categoryId: z.string().optional() }))
    .handler(async ({ input, context }) => {
      const products = await context.db.query.product.findMany({
        where: input.categoryId ? eq(product.categoryId, input.categoryId) : undefined,
      });
      return products;
    }),
});
```

### Mutation (Write Operations)

```typescript
export const cartRouter = os.router({
  addItem: protectedProcedure
    .input(z.object({ productId: z.string(), quantity: z.number() }))
    .handler(async ({ input, context }) => {
      const cartItem = await context.db.insert(cartItem).values({
        cartId: context.user.cartId,
        productId: input.productId,
        quantity: input.quantity,
      }).returning();
      
      return cartItem;
    }),
});
```

## External Service Integration

### Midtrans Service

**File:** `packages/api/src/services/midtrans.ts`

**Responsibilities:**
- Create Snap transactions
- Handle webhooks
- Verify payments

```typescript
export class MidtransService {
  async createTransaction(order: Order) {
    const snap = new MidtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });
    
    const parameter = {
      transaction_details: {
        order_id: order.id,
        gross_amount: order.totalAmount,
      },
      customer_details: {
        email: order.user.email,
        phone: order.user.phone,
      },
    };
    
    return snap.createTransaction(parameter);
  }
}
```

### Raja Ongkir Service

**Responsibilities:**
- Get provinces and cities
- Calculate shipping costs

```typescript
export class RajaOngkirService {
  async calculateShipping(origin: string, destination: string, weight: number) {
    const response = await fetch(
      `${process.env.RAJA_ONGKIR_BASE_URL}/cost`,
      {
        method: "POST",
        headers: {
          key: process.env.RAJA_ONGKIR_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin,
          destination,
          weight,
          courier: "jne",
        }),
      }
    );
    
    return response.json();
  }
}
```

## Authentication Integration

### Better Auth Setup

**File:** `packages/auth/src/index.ts`

```typescript
export const auth = betterAuth({
  database: drizzleAdapter(db),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
});
```

### Protected Routes

```typescript
// Check session in procedure
const session = await auth.api.getSession({
  headers: c.req.raw.headers,
});

if (!session) {
  throw new Error("Unauthorized");
}
```

## Error Handling

### Global Error Handler

```typescript
app.onError((err, c) => {
  console.error(err);
  
  return c.json({
    error: err.message,
    code: err.code || "INTERNAL_ERROR",
  }, 500);
});
```

### ORPC Error Handling

```typescript
.handler(async ({ input, context }) => {
  try {
    const result = await operation();
    return result;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new ORPCError({
        code: "NOT_FOUND",
        message: "Resource not found",
      });
    }
    throw error;
  }
});
```

## Performance Considerations

### 1. Database Query Optimization

```typescript
// Use select instead of returning all fields
const product = await db
  .select({
    id: product.id,
    name: product.name,
    price: product.price,
  })
  .from(product)
  .where(eq(product.id, id));
```

### 2. Connection Pooling

```typescript
// Configure connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
});
```

### 3. Response Caching

```typescript
// Cache expensive queries
app.use("/api/products", cache({
  maxAge: 300, // 5 minutes
}));
```

## Related Documents

- [API Overview](../05-api/01-overview.md)
- [System Overview](./01-system-overview.md)
- [Monorepo Structure](./02-monorepo-structure.md)
