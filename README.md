# Simple Commerce

A full-stack e-commerce mobile application built with React Native (Expo) and a TypeScript backend. Features product browsing, shopping cart, user authentication, Midtrans payment integration, Raja Ongkir shipping, and order tracking.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile App | React Native (Expo SDK 54) |
| UI Library | HeroUI Native + Tailwind CSS (Uniwind) |
| Backend | Hono + ORPC (Type-safe RPC) |
| Database | PostgreSQL + Drizzle ORM |
| Authentication | Better Auth |
| Payment Gateway | Midtrans |
| Shipping API | Raja Ongkir |
| Runtime | Bun |
| Monorepo | Turborepo |

## Features

### Customer Features
- Browse products by category
- Search products
- Product detail with images and descriptions
- Shopping cart management
- Multiple shipping address management
- Shipping cost calculation (JNE, TIKI, POS Indonesia)
- Secure payment via Midtrans (Bank Transfer, E-Wallet, Credit Card)
- Order history and tracking
- Order cancellation

### Technical Features
- End-to-end type safety with ORPC
- Authentication with email/password and Google OAuth
- Real-time cart updates
- Payment webhook integration
- Shipping tracking integration

## Project Structure

```
simple-commerce/
├── apps/
│   ├── native/          # Expo React Native mobile app
│   │   ├── app/         # Expo Router file-based routing
│   │   │   ├── (auth)/  # Authentication screens
│   │   │   └── (app)/   # Main app screens
│   │   │       ├── (tabs)/     # Tab navigation
│   │   │       ├── product/    # Product detail
│   │   │       ├── checkout/   # Checkout flow
│   │   │       └── order/      # Order detail
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Auth client setup
│   │   └── utils/       # ORPC client setup
│   └── server/          # Hono backend server
│
├── packages/
│   ├── api/             # ORPC API routers
│   │   └── src/
│   │       ├── routers/ # API endpoints
│   │       └── services/ # External service integrations
│   ├── db/              # Drizzle ORM database
│   │   └── src/
│   │       ├── schema/  # Database table definitions
│   │       └── seed.ts  # Seed data script
│   ├── schema/          # Shared Zod validation schemas
│   ├── env/             # Environment variable validation
│   ├── auth/            # Better Auth configuration
│   └── mailer/          # Email service (Resend)
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.3.5+)
- [Docker](https://www.docker.com/) (for PostgreSQL)
- [Expo Go](https://expo.dev/client) app on your mobile device

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/erhahahaa/simple-commerce.git
cd simple-commerce
```

2. Install dependencies:
```bash
bun install
```

3. Create environment files:

**`packages/env/.env`**
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/simple_commerce"

# Authentication
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Midtrans
MIDTRANS_SERVER_KEY="your-midtrans-server-key"
MIDTRANS_CLIENT_KEY="your-midtrans-client-key"
MIDTRANS_IS_PRODUCTION="false"

# Raja Ongkir
RAJA_ONGKIR_API_KEY="your-raja-ongkir-api-key"
RAJA_ONGKIR_BASE_URL="https://api.rajaongkir.com/starter"

# Resend (Email)
RESEND_API_KEY="your-resend-api-key"

# Store Configuration
STORE_CITY_ID="152"  # City ID for shipping origin (Jakarta Selatan)
```

**`apps/native/.env`**
```env
EXPO_PUBLIC_API_URL="http://YOUR_LOCAL_IP:3000"
```

### Database Setup

1. Start PostgreSQL with Docker:
```bash
bun run db:start
```

2. Push the schema to database:
```bash
bun run db:push
```

3. Seed the database with sample data:
```bash
bun run db:seed
```

### Running the Application

1. Start all services in development mode:
```bash
bun run dev
```

Or start individually:
```bash
# Backend server
bun run dev:server

# Mobile app
bun run dev:native
```

2. Open the Expo Go app on your phone and scan the QR code

### API Endpoints

The backend exposes the following API routes:

| Route | Description |
|-------|-------------|
| `/api/auth/*` | Authentication endpoints |
| `/api/category/*` | Category CRUD operations |
| `/api/product/*` | Product listing and details |
| `/api/cart/*` | Shopping cart management |
| `/api/address/*` | User address management |
| `/api/shipping/*` | Shipping cost calculation |
| `/api/order/*` | Order management and checkout |
| `/api/payment/webhook` | Midtrans payment webhook |

## Available Scripts

### Development
| Command | Description |
|---------|-------------|
| `bun run dev` | Start all applications |
| `bun run dev:native` | Start mobile app only |
| `bun run dev:server` | Start backend server only |

### Database
| Command | Description |
|---------|-------------|
| `bun run db:start` | Start PostgreSQL container |
| `bun run db:stop` | Stop PostgreSQL container |
| `bun run db:push` | Push schema to database |
| `bun run db:seed` | Seed database with sample data |
| `bun run db:studio` | Open Drizzle Studio UI |
| `bun run db:generate` | Generate migrations |
| `bun run db:migrate` | Run migrations |

### Code Quality
| Command | Description |
|---------|-------------|
| `bun run check` | Run Biome linting and formatting |
| `bun run check-types` | TypeScript type checking |
| `bun run build` | Build all applications |

## Database Schema

### Core Tables
- **user** - User accounts and profiles
- **session** - Active user sessions
- **account** - OAuth provider accounts

### E-commerce Tables
- **category** - Product categories
- **product** - Product catalog
- **cart** - User shopping carts
- **cart_item** - Items in cart
- **address** - User shipping addresses
- **order** - Customer orders
- **order_item** - Items in order
- **shipping_info** - Order shipping details

## Payment Integration

### Midtrans Setup

1. Create a [Midtrans](https://midtrans.com/) sandbox account
2. Get your Server Key and Client Key from the dashboard
3. Configure webhook URL: `https://your-domain.com/api/payment/webhook`
4. Supported payment methods:
   - Bank Transfer (BCA, BNI, BRI, Permata, Mandiri)
   - E-Wallet (GoPay, ShopeePay)
   - Credit Card
   - Retail (Indomaret, Alfamart)

### Payment Flow
1. User completes checkout
2. Backend creates Midtrans transaction
3. User redirected to Midtrans payment page
4. Payment completed via chosen method
5. Midtrans sends webhook notification
6. Order status updated automatically

## Shipping Integration

### Raja Ongkir Setup

1. Create a [Raja Ongkir](https://rajaongkir.com/) account
2. Get your API key
3. Supported couriers:
   - JNE
   - TIKI
   - POS Indonesia

### Shipping Flow
1. User selects shipping address
2. App fetches available shipping options
3. User selects courier and service
4. Shipping cost added to order total

## Seed Data

The seed script (`packages/db/src/seed.ts`) creates:

### Categories (6)
- Electronics
- Fashion
- Home & Living
- Beauty & Health
- Sports & Outdoors
- Food & Beverages

### Products (36)
Each category has 6 products with:
- Realistic names and descriptions
- Indonesian Rupiah (IDR) pricing
- Stock quantities
- Sample images from Unsplash

## License

MIT License - see [LICENSE](LICENSE) for details.

## Credits

Built with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack) - A modern TypeScript stack combining Hono, ORPC, and more.
