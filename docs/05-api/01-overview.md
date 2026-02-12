# API Overview

Overview of the Simple Commerce API.

## Architecture

The API uses ORPC (Type-safe RPC) for communication between mobile app and backend.

## Key Features

- **Type-safe:** End-to-end TypeScript types
- **REST-like:** HTTP-based transport
- **Validation:** Zod schemas for all inputs
- **Authorization:** Protected procedures for auth routes

## Router Structure

```
appRouter
├── healthCheck (public)
├── privateData (protected)
├── user (protected)
├── category (public/protected)
├── product (public/protected)
├── cart (protected)
├── address (protected)
├── shipping (protected)
├── order (protected)
├── payment (protected)
└── wishlist (protected)
```

## Procedure Types

### Public Procedure

No authentication required.

### Protected Procedure

Requires valid session.

## HTTP Endpoints

| Route | Description |
|-------|-------------|
| /api/auth/* | Authentication (Better Auth) |
| /api/payments/webhook/midtrans | Midtrans webhook |
| /rpc/* | ORPC API routes |
| /api-reference/* | API documentation |

## Related Documents

- [Authentication Router](./02-authentication.md)
- [Category Router](./03-category-router.md)
- [Product Router](./04-product-router.md)
