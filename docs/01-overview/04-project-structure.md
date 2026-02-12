# Project Structure

Detailed breakdown of the Simple Commerce project structure and organization.

## Root Level

```
simple-commerce/
├── apps/                  # Application code
├── packages/              # Shared packages
├── docs/                  # Documentation (you are here!)
├── biome.json            # Linting and formatting config
├── turbo.json            # Turborepo configuration
├── package.json          # Root package.json
├── tsconfig.json         # Root TypeScript config
├── bun.lock              # Bun lock file
└── .gitignore            # Git ignore rules
```

### Root Configuration Files

| File | Purpose |
|------|---------|
| `biome.json` | Code formatting and linting rules |
| `turbo.json` | Turborepo pipeline and caching configuration |
| `package.json` | Workspace configuration and shared dependencies |
| `tsconfig.json` | Root TypeScript configuration |
| `bun.lock` | Locked dependency versions |
| `.gitignore` | Files excluded from Git |

## Apps Directory (`apps/`)

Contains deployable applications.

```
apps/
├── native/               # React Native mobile app
│   ├── app/              # Expo Router screens
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Library configurations
│   ├── utils/            # Utility functions
│   ├── assets/           # Static assets
│   ├── .env              # Environment variables
│   ├── app.json          # Expo configuration
│   ├── metro.config.js   # Metro bundler config
│   ├── package.json      # App dependencies
│   └── tsconfig.json     # App TypeScript config
│
└── server/               # Hono backend server
    ├── src/
    │   └── index.ts      # Server entry point
    ├── .env              # Environment variables
    ├── package.json      # Server dependencies
    └── tsconfig.json     # Server TypeScript config
```

### Native App Structure (`apps/native/`)

#### App Directory (`app/`)

Uses Expo Router's file-based routing:

```
app/
├── _layout.tsx           # Root layout with providers
├── +not-found.tsx        # 404 page
│
├── (auth)/               # Authentication group
│   ├── _layout.tsx       # Auth layout
│   ├── sign-in.tsx       # Sign in screen
│   └── sign-up.tsx       # Sign up screen
│
└── (app)/                # Main app group
    ├── _layout.tsx       # App layout
    ├── wishlist.tsx      # Wishlist screen
    │
    ├── (tabs)/           # Tab navigation
    │   ├── _layout.tsx   # Tab layout
    │   ├── index.tsx     # Home tab
    │   ├── products.tsx  # Products tab
    │   ├── cart.tsx      # Cart tab
    │   ├── orders.tsx    # Orders tab
    │   └── profile.tsx   # Profile tab
    │
    ├── checkout/         # Checkout flow
    │   ├── index.tsx     # Main checkout
    │   ├── payment.tsx   # Payment WebView
    │   ├── success.tsx   # Success screen
    │   ├── failed.tsx    # Failed screen
    │   └── address/      # Address management
    │       ├── new.tsx
    │       └── [id]/
    │           └── edit.tsx
    │
    ├── order/            # Order detail
    │   └── [id].tsx
    │
    ├── product/          # Product detail
    │   └── [slug].tsx
    │
    └── profile/          # Profile screens
        └── addresses.tsx
```

#### Components Directory (`components/`)

```
components/
├── gradient-background.tsx
└── uniwind.tsx
```

#### Contexts Directory (`contexts/`)

```
contexts/
└── session-context.tsx    # Session management context
```

#### Hooks Directory (`hooks/`)

```
hooks/
├── products.ts           # Product-related hooks
├── cart.ts               # Cart-related hooks
└── checkout.ts           # Checkout-related hooks
```

#### Lib Directory (`lib/`)

```
lib/
└── auth-client.ts        # Better Auth client setup
```

#### Utils Directory (`utils/`)

```
utils/
└── orpc.ts               # ORPC client configuration
```

### Server Structure (`apps/server/`)

```
server/
├── src/
│   └── index.ts          # Main server entry
│                         # - Hono app setup
│                         # - ORPC mounting
│                         # - Auth routes
│                         # - Webhook handlers
├── .env                  # Environment variables
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript config
```

## Packages Directory (`packages/`)

Contains shared code used by apps.

```
packages/
├── api/                  # ORPC API definitions
├── auth/                 # Better Auth configuration
├── config/               # Shared TypeScript config
├── db/                   # Database schema and client
├── env/                  # Environment validation
├── mailer/               # Email service
└── schema/               # Shared Zod schemas
```

### API Package (`packages/api/`)

```
api/
└── src/
    ├── index.ts          # Procedure exports
    ├── context.ts        # Request context
    ├── routers/          # API routers
    │   ├── index.ts      # Main router
    │   ├── category.ts   # Category router
    │   ├── product.ts    # Product router
    │   ├── cart.ts       # Cart router
    │   ├── address.ts    # Address router
    │   ├── shipping.ts   # Shipping router
    │   ├── order.ts      # Order router
    │   ├── payment.ts    # Payment router
    │   └── wishlist.ts   # Wishlist router
    └── services/         # External services
        └── midtrans.ts   # Midtrans integration
```

### Auth Package (`packages/auth/`)

```
auth/
└── src/
    └── index.ts          # Better Auth configuration
                          # - Database adapter
                          # - OAuth providers
                          # - Email templates
```

### Config Package (`packages/config/`)

```
config/
└── tsconfig.base.json    # Shared TypeScript configuration
```

### Database Package (`packages/db/`)

```
db/
├── src/
│   ├── index.ts          # Database client export
│   ├── schema/           # Schema definitions
│   │   ├── index.ts      # Schema exports
│   │   ├── auth.ts       # Auth tables
│   │   ├── category.ts   # Category table
│   │   ├── product.ts    # Product table
│   │   ├── cart.ts       # Cart tables
│   │   ├── address.ts    # Address table
│   │   ├── order.ts      # Order tables
│   │   ├── shipping.ts   # Shipping table
│   │   ├── wishlist.ts   # Wishlist table
│   │   └── relations.ts  # Table relationships
│   ├── seed.ts           # Database seeding
│   └── reset.ts          # Database reset
├── drizzle.config.ts     # Drizzle configuration
├── docker-compose.yml    # PostgreSQL container
└── package.json          # Dependencies
```

### Environment Package (`packages/env/`)

```
env/
└── src/
    ├── server.ts         # Server environment schema
    └── native.ts         # Client environment schema
```

### Mailer Package (`packages/mailer/`)

```
mailer/
└── src/
    └── emails/           # React Email templates
        └── (email templates)
```

### Schema Package (`packages/schema/`)

```
schema/
└── src/
    └── index.ts          # Shared Zod schemas
```

## Directory Conventions

### Naming

- **Directories**: kebab-case (e.g., `getting-started`)
- **Files**: kebab-case (e.g., `order-router.ts`)
- **Components**: PascalCase (e.g., `ProductCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useProducts.ts`)

### Organization Principles

1. **Co-location**: Keep related files together
2. **Feature-based**: Group by feature, not type
3. **Public API**: Use `index.ts` for clean exports
4. **Tests**: Co-locate with source files (future)

### Import Conventions

```typescript
// Good - Use workspace aliases
import { api } from "@simple-commerce/api";
import { db } from "@simple-commerce/db";

// Good - Relative imports for same directory
import { ProductCard } from "./product-card";

// Good - Parent directory imports
import { Layout } from "../components/layout";

// Avoid - Deep relative paths
import { something } from "../../../../packages/api/src/routers/product";
```

## Key Files by Purpose

### Entry Points

| Purpose | File |
|---------|------|
| Mobile App Entry | `apps/native/app/_layout.tsx` |
| Server Entry | `apps/server/src/index.ts` |
| Database Entry | `packages/db/src/index.ts` |
| API Entry | `packages/api/src/index.ts` |

### Configuration Files

| Purpose | File |
|---------|------|
| Turborepo | `turbo.json` |
| Biome | `biome.json` |
| TypeScript (Root) | `tsconfig.json` |
| TypeScript (Base) | `packages/config/tsconfig.base.json` |
| Drizzle | `packages/db/drizzle.config.ts` |
| Expo | `apps/native/app.json` |

### Environment Files

| Purpose | File |
|---------|------|
| Server Env | `apps/server/.env` |
| Native Env | `apps/native/.env` |

## Navigation Tips

### Finding Files Quickly

| Looking for... | Check... |
|----------------|----------|
| API endpoint | `packages/api/src/routers/` |
| Database table | `packages/db/src/schema/` |
| Screen component | `apps/native/app/(app)/` |
| Auth screen | `apps/native/app/(auth)/` |
| Shared component | `apps/native/components/` |
| Custom hook | `apps/native/hooks/` |
| Utility function | `apps/native/utils/` |
| Environment vars | `packages/env/src/` |

### Common Patterns

```
# Find all API routers
find packages/api/src/routers -name "*.ts"

# Find all database schemas
find packages/db/src/schema -name "*.ts"

# Find all screen files
find apps/native/app -name "*.tsx"

# Search for specific component
grep -r "ProductCard" apps/native/
```

## Next Steps

- Learn about [System Architecture](../03-architecture/01-system-overview.md)
- Review [Database Schema](../04-database/01-overview.md)
- Explore [API Reference](../05-api/01-overview.md)
- Start [Getting Started](../02-getting-started/01-prerequisites.md)
