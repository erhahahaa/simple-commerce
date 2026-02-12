# System Overview

High-level architecture of Simple Commerce.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    MOBILE APP (Expo/RN)                      │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────────┐  │
│  │   Products    │ │     Cart      │ │     Checkout      │  │
│  │   - List      │ │   - Items     │ │   - Address       │  │
│  │   - Detail    │ │   - Quantity  │ │   - Shipping      │  │
│  │   - Category  │ │   - Total     │ │   - Payment       │  │
│  └───────────────┘ └───────────────┘ └───────────────────┘  │
│                            │                                  │
│  ┌────────────────────────┴────────────────────────────┐    │
│  │              Midtrans Snap WebView                   │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────────┘
                           │ ORPC (Type-safe RPC)
┌──────────────────────────┴──────────────────────────────────┐
│                    BACKEND (Hono + ORPC)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Routers                                          │   │
│  │  - Products    - Cart    - Orders    - Payment        │   │
│  │  - Categories  - User    - Address   - Shipping       │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Midtrans   │  │  Raja Ongkir │  │   PostgreSQL     │   │
│  │   Gateway    │  │  Shipping    │  │   (Drizzle)      │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Key Architectural Principles

### 1. Type Safety

Every layer of the stack uses TypeScript:
- Mobile app: React Native with TypeScript
- Backend: TypeScript with Hono
- Database: Drizzle ORM with inferred types
- API: ORPC provides end-to-end type safety

### 2. Monorepo Structure

Code organized for reusability:
- Shared packages in `packages/`
- Clear separation of concerns
- Workspace dependencies with `workspace:*`

### 3. Modern Stack

Using current best practices:
- File-based routing with Expo Router
- Type-safe RPC with ORPC
- Utility-first CSS with Tailwind
- Server state management with TanStack Query

## System Layers

### Presentation Layer (Mobile App)

**Responsibilities:**
- User interface rendering
- User interactions
- Navigation
- Form handling
- API client

**Technologies:**
- React Native
- Expo Router
- HeroUI Native
- Tailwind CSS
- TanStack Query

### API Layer (Backend)

**Responsibilities:**
- Request handling
- Authentication/authorization
- Business logic
- Database operations
- External service integration

**Technologies:**
- Hono web framework
- ORPC procedures
- Better Auth
- Zod validation

### Data Layer (Database)

**Responsibilities:**
- Data persistence
- Data relationships
- Query optimization
- Schema migrations

**Technologies:**
- PostgreSQL
- Drizzle ORM
- Drizzle Kit

### Integration Layer

**Responsibilities:**
- Payment processing
- Shipping calculations
- Email delivery
- OAuth authentication

**Services:**
- Midtrans (payments)
- Raja Ongkir (shipping)
- Resend (email)
- Google OAuth

## Communication Flow

### Mobile to Backend

```
1. User Action (e.g., Add to Cart)
   ↓
2. API Client Call (TanStack Query)
   ↓
3. ORPC Request (HTTP POST)
   ↓
4. Hono Server Receives Request
   ↓
5. ORPC Handler Processes
   ↓
6. Database Operation (Drizzle)
   ↓
7. Response Returns
   ↓
8. UI Updates
```

### Authentication Flow

```
1. User Enters Credentials
   ↓
2. Better Auth Client (Mobile)
   ↓
3. Auth Request to Server
   ↓
4. Better Auth Server Validates
   ↓
5. Database Check (Drizzle)
   ↓
6. Session Created
   ↓
7. Token Stored (Secure Store)
   ↓
8. User Authenticated
```

### Payment Flow

```
1. User Confirms Order
   ↓
2. Create Order in Database
   ↓
3. Generate Midtrans Snap Token
   ↓
4. Open Midtrans WebView
   ↓
5. User Completes Payment
   ↓
6. Midtrans Redirects Back
   ↓
7. Webhook Notification Sent
   ↓
8. Order Status Updated
   ↓
9. User Sees Confirmation
```

## Scalability Considerations

### Horizontal Scaling

- **Stateless backend** - Easy to scale horizontally
- **Database** - PostgreSQL supports read replicas
- **External services** - All integrations are stateless

### Performance

- **Query optimization** - Drizzle ORM with proper indexing
- **Caching** - TanStack Query for client-side caching
- **Image optimization** - Expo Image with lazy loading
- **Bundle size** - Tree shaking and code splitting

### Security

- **Authentication** - JWT with secure storage
- **Authorization** - Protected procedures with ORPC
- **Input validation** - Zod schemas everywhere
- **Payment security** - PCI-DSS compliant via Midtrans

## Deployment Architecture

### Development

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Developer   │────▶│   Docker     │────▶│  PostgreSQL  │
│   Machine    │     │  Container   │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
```

### Production (Suggested)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│     CDN      │────▶│    VPS/      │────▶│  Managed     │
│   (Static)   │     │   Container  │     │ PostgreSQL   │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                     ┌──────┴──────┐
                     │             │
               ┌─────▼─────┐ ┌────▼────┐
               │  Midtrans │ │  Raja   │
               │           │ │ Ongkir  │
               └───────────┘ └─────────┘
```

## Related Documents

- [Monorepo Structure](./02-monorepo-structure.md)
- [Mobile App Architecture](./03-mobile-app-architecture.md)
- [Backend Architecture](./04-backend-architecture.md)
- [Data Flow](./05-data-flow.md)
