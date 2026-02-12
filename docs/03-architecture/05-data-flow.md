# Data Flow

Understanding how data flows through the Simple Commerce system.

## Overview

This document describes data flow for key user actions in the system.

## 1. User Authentication Flow

```
User enters credentials
       ↓
Mobile App (Auth Client)
       ↓
POST /api/auth/sign-in/email
       ↓
Better Auth Server
       ↓
Database Query (user table)
       ↓
Password Verification
       ↓
Session Created (session table)
       ↓
Token Returned to Mobile
       ↓
Token Stored (Secure Store)
       ↓
User Authenticated
```

### Components Involved

- **Mobile:** Better Auth Client
- **Server:** Better Auth Handler
- **Database:** user, session tables

## 2. Product Browsing Flow

```
User opens app
       ↓
Home Screen Mounts
       ↓
TanStack Query fetches featured products
       ↓
ORPC Client → GET /rpc/product.featured
       ↓
Product Router
       ↓
Database Query (product table)
       ↓
Return featured products
       ↓
UI Updates with Products
```

### Components Involved

- **Mobile:** TanStack Query, useQuery hook
- **API:** product router
- **Database:** product table

## 3. Add to Cart Flow

```
User taps "Add to Cart"
       ↓
Cart Screen Component
       ↓
TanStack Mutation (addItem)
       ↓
ORPC Client → POST /rpc/cart.addItem
       ↓
Protected Procedure (check auth)
       ↓
Cart Router
       ↓
Database Operations:
  1. Get or create cart
  2. Add item to cart_item
       ↓
Return updated cart
       ↓
Query Cache Invalidated
       ↓
UI Updates with new cart count
```

### Components Involved

- **Mobile:** TanStack Query useMutation
- **API:** protectedProcedure, cart router
- **Database:** cart, cart_item tables

## 4. Checkout Flow

### Step 1: Select Address

```
User taps "Checkout"
       ↓
Checkout Screen Loads
       ↓
Fetch user addresses
       ↓
User selects address
       ↓
Fetch shipping options
       ↓
User selects shipping
```

### Step 2: Create Order

```
User confirms order
       ↓
Create Order Mutation
       ↓
ORPC Client → POST /rpc/order.checkout
       ↓
Protected Procedure
       ↓
Order Router
       ↓
Database Operations:
  1. Create order record
  2. Create order_item records
  3. Get cart items
  4. Clear cart
       ↓
Return order with ID
```

### Step 3: Payment

```
Order created
       ↓
Create Midtrans Transaction
       ↓
Midtrans API Call
       ↓
Return Snap Token & URL
       ↓
Open WebView with Snap URL
       ↓
User completes payment
       ↓
Midtrans Redirects to App
       ↓
Show Success/Failure Screen
```

### Step 4: Webhook Notification

```
Payment completed (Midtrans)
       ↓
Midtrans sends webhook
       ↓
POST /api/payments/webhook/midtrans
       ↓
Verify signature
       ↓
Update order status
       ↓
Update payment status
       ↓
Send confirmation email (optional)
```

## 5. Order Tracking Flow

```
User opens Orders screen
       ↓
TanStack Query fetches orders
       ↓
ORPC Client → GET /rpc/order.list
       ↓
Protected Procedure
       ↓
Order Router
       ↓
Database Query (order table)
       ↓
Return orders with status
       ↓
UI displays order list
```

## Data Flow Patterns

### Read Operations (Queries)

```
UI Component
    ↓
useQuery Hook
    ↓
ORPC Client
    ↓
HTTP Request
    ↓
Public/Protected Procedure
    ↓
Router Handler
    ↓
Database Query
    ↓
Return Data
    ↓
Cache in TanStack Query
    ↓
UI Updates
```

### Write Operations (Mutations)

```
User Action
    ↓
useMutation Hook
    ↓
ORPC Client
    ↓
HTTP Request
    ↓
Protected Procedure
    ↓
Router Handler
    ↓
Database Operation
    ↓
Return Result
    ↓
Invalidate Related Queries
    ↓
UI Updates
```

## State Management Flow

### Client State (React)

- Form inputs
- UI state (modals, tabs)
- Navigation state

### Server State (TanStack Query)

- API data
- Cached responses
- Loading/error states

### Global State (Context)

- Authentication session
- Theme preferences
- App-wide settings

## External Service Integration

### Midtrans Payment Flow

```
Create Order
    ↓
Generate Snap Token
    ↓
Client opens Snap
    ↓
User pays
    ↓
Payment notification
    ↓
Webhook handler
    ↓
Update order status
```

### Raja Ongkir Shipping Flow

```
Select Address
    ↓
Get city/province IDs
    ↓
Calculate shipping cost
    ↓
Raja Ongkir API call
    ↓
Return shipping options
    ↓
User selects option
```

## Error Flow

```
Operation Fails
    ↓
Error Caught
    ↓
Error Transform
    ↓
Return Error Response
    ↓
Client Receives Error
    ↓
UI Shows Error State
    ↓
User Can Retry
```

## Performance Optimizations

### 1. Request Deduplication

TanStack Query automatically deduplicates concurrent requests with the same key.

### 2. Optimistic Updates

```typescript
const mutation = useMutation({
  mutationFn: api.cart.addItem.mutate,
  onMutate: async (newItem) => {
    // Optimistically update cache
    queryClient.setQueryData(["cart"], (old) => ({
      ...old,
      items: [...old.items, newItem],
    }));
  },
  onError: (err, newItem, context) => {
    // Rollback on error
    queryClient.setQueryData(["cart"], context.previousCart);
  },
});
```

### 3. Prefetching

```typescript
// Prefetch on hover
const prefetchProduct = (id) => {
  queryClient.prefetchQuery({
    queryKey: ["product", id],
    queryFn: () => api.product.getById.query(id),
  });
};
```

## Related Documents

- [System Overview](./01-system-overview.md)
- [Mobile App Architecture](./03-mobile-app-architecture.md)
- [Backend Architecture](./04-backend-architecture.md)
