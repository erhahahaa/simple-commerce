# Technology Stack

Complete technology stack used in Simple Commerce with versions and purposes.

## Runtime and Package Management

| Technology | Version | Purpose |
|------------|---------|---------|
| **Bun** | 1.3.5+ | JavaScript runtime, package manager, bundler |

**Why Bun?**
- Fast package installation
- Built-in TypeScript support
- Native hot reloading
- Single tool for runtime + package management

## Monorepo Management

| Technology | Version | Purpose |
|------------|---------|---------|
| **Turborepo** | 2.6.3 | Monorepo task runner and caching |

**Key Features:**
- Task pipelines
- Remote caching
- Parallel execution
- Dependency graph visualization

## Mobile Application

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.0 | UI library |
| **React Native** | 0.81.5 | Mobile app framework |
| **Expo SDK** | 54.0.23 | Development platform |
| **Expo Router** | 6.0.14 | File-based routing |

### Navigation

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Navigation** | 7.x | Navigation library |
| **React Navigation Drawer** | 7.3.9 | Drawer navigator |

### State Management

| Technology | Version | Purpose |
|------------|---------|---------|
| **TanStack Query** | 5.90.12 | Server state management |
| **React Hook Form** | 7.71.1 | Form state management |

### UI Components

| Technology | Version | Purpose |
|------------|---------|---------|
| **HeroUI Native** | 1.0.0-beta.13 | Component library |
| **Tailwind CSS** | 4.1.18 | Utility-first CSS |
| **Tailwind Variants** | 3.2.2 | Component variants |
| **Uniwind** | 1.2.2 | React Native Tailwind |

### Animations and Gestures

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Native Reanimated** | 4.1.1 | Smooth animations |
| **React Native Gesture Handler** | 2.28.0 | Touch gestures |
| **Bottom Sheet** | 5.x | Modal bottom sheets |

### Utilities

| Technology | Version | Purpose |
|------------|---------|---------|
| **Zod** | 4.1.13 | Schema validation |
| **Expo Secure Store** | 15.0.8 | Secure local storage |
| **Expo Web Browser** | 15.0.10 | In-app browser |
| **Expo WebView** | 13.15.0 | Web content rendering |

### TypeScript Support

| Technology | Version | Purpose |
|------------|---------|---------|
| **TypeScript** | 5.x | Type checking |
| **@types/react** | 19.1.10 | React types |
| **@types/node** | 24.10.12 | Node types |

## Backend

### Web Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **Hono** | 4.11.9 | Web framework |
| **React** | 19.1.0 | Server-side rendering |
| **React DOM** | 19.2.3 | DOM rendering |

### API Layer

| Technology | Version | Purpose |
|------------|---------|---------|
| **ORPC** | 1.12.2 | Type-safe RPC |
| **ORPC Server** | 1.12.2 | Server procedures |
| **ORPC Client** | 1.12.2 | Client procedures |
| **ORPC OpenAPI** | 1.12.2 | OpenAPI generation |
| **ORPC Zod** | 1.12.2 | Zod integration |
| **ORPC TanStack Query** | 1.12.2 | Query integration |

### Build Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| **tsdown** | 0.20.3 | TypeScript compilation |

## Database

### Database Engine

| Technology | Version | Purpose |
|------------|---------|---------|
| **PostgreSQL** | 15+ | Relational database |
| **pg** | 8.17.1 | Node.js PostgreSQL driver |

### ORM and Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| **Drizzle ORM** | 0.45.1 | Type-safe ORM |
| **Drizzle Kit** | 0.31.9 | Migrations and studio |

## Authentication

| Technology | Version | Purpose |
|------------|---------|---------|
| **Better Auth** | 1.4.18 | Authentication framework |
| **Better Auth Expo** | 1.4.18 | Expo integration |

**Features:**
- Email/password authentication
- Google OAuth
- Session management
- Email verification
- Password reset

## External Integrations

### Payment Gateway

| Technology | Version | Purpose |
|------------|---------|---------|
| **Midtrans** | Snap API | Payment processing |

**Supported Methods:**
- Bank Transfer (BCA, BNI, BRI, Mandiri, Permata)
- E-Wallet (GoPay, ShopeePay)
- Credit Card
- Retail (Indomaret, Alfamart)

### Shipping API

| Technology | Version | Purpose |
|------------|---------|---------|
| **Raja Ongkir** | Starter API | Shipping cost calculation |

**Supported Couriers:**
- JNE
- TIKI
- POS Indonesia

### Email Service

| Technology | Version | Purpose |
|------------|---------|---------|
| **Resend** | 6.9.1 | Transactional emails |
| **React Email** | 1.0.7 | Email templates |
| **React Email Preview** | 5.2.8 | Email development |

## Development Tools

### Linting and Formatting

| Technology | Version | Purpose |
|------------|---------|---------|
| **Biome** | 2.2.0 | Linting and formatting |

### Environment Management

| Technology | Version | Purpose |
|------------|---------|---------|
| **T3 Env Core** | 0.13.1 | Environment validation |
| **dotenv** | 17.2.2 | Environment files |

### Type Definitions

| Technology | Version | Purpose |
|------------|---------|---------|
| **@types/bun** | 1.3.4 | Bun types |
| **@types/pg** | 8.16.0 | PostgreSQL types |

## Infrastructure

### Containerization

| Technology | Version | Purpose |
|------------|---------|---------|
| **Docker** | Latest | Container platform |
| **Docker Compose** | Latest | Multi-container orchestration |

### Version Control

| Technology | Version | Purpose |
|------------|---------|---------|
| **Git** | 2.x+ | Version control |

## Stack Comparison

### Why This Stack?

| Layer | Our Choice | Alternatives | Why Ours |
|-------|-----------|--------------|----------|
| **Runtime** | Bun | Node.js, Deno | Faster, all-in-one |
| **Monorepo** | Turborepo | Nx, Lerna | Simpler config |
| **Mobile** | Expo | Bare React Native | Faster development |
| **Backend** | Hono | Express, Fastify | Lightweight, fast |
| **API** | ORPC | tRPC, REST | Type-safe, simple |
| **Database** | PostgreSQL + Drizzle | MongoDB, Prisma | SQL power, type-safe |
| **Auth** | Better Auth | Auth0, Firebase | Open source, flexible |
| **Styling** | Tailwind | Styled Components | Utility-first, fast |
| **Forms** | React Hook Form | Formik | Performance, simplicity |

## Version Compatibility

All packages are tested and compatible with the versions listed above. To ensure compatibility:

1. Use exact versions in `package.json`
2. Run `bun install` after pulling updates
3. Check for peer dependency warnings
4. Test thoroughly after updates

## Updating Dependencies

### Safe to Update (Patch/Minor)

```bash
bun update
```

### Major Updates

1. Check changelogs for breaking changes
2. Update one package at a time
3. Test thoroughly
4. Update documentation

### Lock File

The project uses `bun.lock` for reproducible installs. Commit this file.

## Next Steps

- Review [Project Structure](./04-project-structure.md)
- Check [Getting Started](../02-getting-started/01-prerequisites.md)
- Explore [Architecture](../03-architecture/01-system-overview.md)
