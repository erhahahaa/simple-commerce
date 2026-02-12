# Monorepo Structure

Understanding the Turborepo monorepo organization.

## Why Monorepo?

### Benefits

1. **Code Sharing** - Reuse packages across apps
2. **Single Source of Truth** - One place for shared code
3. **Atomic Changes** - Update code and consumers together
4. **Tooling Consistency** - Shared configs and dependencies
5. **Simplified CI/CD** - One pipeline for everything

### Trade-offs

- **Repository Size** - Larger initial clone
- **Build Complexity** - More complex build pipeline
- **Learning Curve** - Understanding workspace concepts

## Workspace Configuration

### Root package.json

```json
{
  "name": "simple-commerce",
  "private": true,
  "workspaces": {
    "packages": [
      "apps/*",
      "packages/*"
    ]
  }
}
```

### Workspace Types

| Type | Location | Purpose |
|------|----------|---------|
| **Apps** | `apps/` | Deployable applications |
| **Packages** | `packages/` | Shared libraries |

## Apps Directory

### Structure

```
apps/
├── native/          # React Native mobile app
└── server/          # Hono backend API
```

### Native App

**Purpose:** Mobile e-commerce application

**Key Files:**
```
apps/native/
├── app/              # Expo Router screens
├── components/       # UI components
├── hooks/            # React hooks
├── lib/              # Auth client
├── utils/            # Utilities
├── app.json          # Expo config
└── package.json      # Dependencies
```

**Workspace Dependencies:**
```json
{
  "dependencies": {
    "@simple-commerce/api": "workspace:*",
    "@simple-commerce/env": "workspace:*",
    "@simple-commerce/schema": "workspace:*"
  }
}
```

### Server App

**Purpose:** Backend API server

**Key Files:**
```
apps/server/
├── src/
│   └── index.ts      # Server entry
├── .env              # Environment variables
└── package.json      # Dependencies
```

**Workspace Dependencies:**
```json
{
  "dependencies": {
    "@simple-commerce/api": "workspace:*",
    "@simple-commerce/auth": "workspace:*",
    "@simple-commerce/db": "workspace:*",
    "@simple-commerce/env": "workspace:*"
  }
}
```

## Packages Directory

### Structure

```
packages/
├── api/              # ORPC API definitions
├── auth/             # Better Auth configuration
├── config/           # Shared TypeScript config
├── db/               # Database schema and client
├── env/              # Environment validation
├── mailer/           # Email service
└── schema/           # Shared Zod schemas
```

### Package Details

#### api

**Exports:**
```typescript
// Router definitions
export { appRouter } from "./routers";

// Procedures
export { publicProcedure, protectedProcedure } from "./index";

// Context
export { createContext } from "./context";
```

#### auth

**Exports:**
```typescript
// Auth instance
export { auth } from "./index";
```

#### config

**Exports:**
```typescript
// Base TypeScript config
export { default as baseConfig } from "./tsconfig.base.json";
```

#### db

**Exports:**
```typescript
// Database client
export { db } from "./index";

// Schema
export * from "./schema";
```

#### env

**Exports:**
```typescript
// Server environment
export { env as serverEnv } from "./server";

// Native environment
export { env as nativeEnv } from "./native";
```

#### mailer

**Exports:**
```typescript
// Email sending
export { sendEmail } from "./index";
```

#### schema

**Exports:**
```typescript
// Zod schemas
export * from "./index";
```

## Dependency Management

### Catalog Dependencies

Shared dependency versions in root `package.json`:

```json
{
  "workspaces": {
    "catalog": {
      "typescript": "^5",
      "hono": "^4.11.9",
      "@orpc/server": "^1.12.2",
      "better-auth": "^1.4.18"
    }
  }
}
```

### Using Catalog

```json
{
  "dependencies": {
    "typescript": "catalog:",
    "hono": "catalog:"
  }
}
```

### Workspace Dependencies

Link local packages with `workspace:*`:

```json
{
  "dependencies": {
    "@simple-commerce/api": "workspace:*"
  }
}
```

## Turborepo Pipeline

### Configuration (turbo.json)

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "db:push": {
      "cache": false
    }
  }
}
```

### Pipeline Flow

```
build
  └─▶ native build
  │    └─▶ depends on api build
  └─▶ server build
       └─▶ depends on api, auth, db builds
```

## Scripts and Commands

### Root Level

```bash
# Install all dependencies
bun install

# Start all apps
bun run dev

# Build all apps
bun run build

# Type check all
bun run check-types
```

### App/Package Specific

```bash
# Start specific app
bun run dev:native    # Mobile only
bun run dev:server    # Backend only

# Database commands
bun run db:start      # Start PostgreSQL
bun run db:push       # Push schema
bun run db:seed       # Seed data
```

## Adding New Workspaces

### New App

1. Create directory: `apps/new-app/`
2. Add `package.json` with workspace dependencies
3. Add to root `package.json` workspaces
4. Run `bun install`

### New Package

1. Create directory: `packages/new-package/`
2. Add `package.json` with exports
3. Add to root `package.json` workspaces
4. Update consumers to use new package

## Best Practices

### 1. Keep Packages Focused

Each package should have a single responsibility:
- ✅ `api` - API definitions
- ✅ `db` - Database operations
- ❌ `utils` - Too vague

### 2. Minimize Cross-Dependencies

Avoid circular dependencies:
```
✅ api depends on db
✅ db is independent
❌ api depends on db, db depends on api
```

### 3. Version Workspace Dependencies

Use `workspace:*` for internal packages:
```json
"@simple-commerce/api": "workspace:*"
```

### 4. Share Configuration

Use `@simple-commerce/config` for shared configs:
```json
{
  "extends": "@simple-commerce/config/tsconfig.base.json"
}
```

## Related Documents

- [System Overview](./01-system-overview.md)
- [Mobile App Architecture](./03-mobile-app-architecture.md)
- [Backend Architecture](./04-backend-architecture.md)
