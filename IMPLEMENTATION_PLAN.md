# E-Commerce Mobile App Implementation Plan

## Project Overview

Build a mobile e-commerce application with React Native (Expo) that allows users to:
- Browse and purchase products by category
- Manage shopping cart
- Checkout with Midtrans payment integration
- Track order status and shipping

## Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile App | React Native (Expo SDK 54) |
| UI Library | HeroUI Native + Tailwind CSS |
| Backend | Hono + ORPC (Type-safe RPC) |
| Database | PostgreSQL + Drizzle ORM |
| Authentication | Better Auth (Email, Google OAuth) |
| Payment Gateway | Midtrans (Snap) |
| Shipping API | Raja Ongkir |
| State Management | TanStack Query |
| Forms | react-hook-form + Zod |

---

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
                           │ ORPC (Type-safe)
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

---

## Git Branching Strategy

Each feature will have its own branch and Pull Request:

```
main
 │
 ├── feat/database-schema        → PR #2  ✅ MERGED
 │
 ├── feat/product-api            → PR #3  ✅ MERGED
 │
 ├── feat/cart-api               → PR #4  ✅ MERGED
 │
 ├── feat/address-shipping-api   → PR #5  ✅ MERGED
 │
 ├── feat/midtrans-integration   → PR #6  ✅ MERGED
 │
 ├── feat/order-api              → PR #7  ✅ MERGED
 │
 ├── feat/product-screens        → PR #8  ✅ MERGED
 │
 ├── feat/cart-screens           → PR #9  ✅ MERGED
 │
 ├── feat/checkout-screens       → PR #10 ✅ MERGED
 │
 ├── feat/order-screens          → PR #11 ✅ MERGED
 │
 ├── feat/seed-data              → PR #12 ✅ MERGED
 │
 └── docs/readme                 → PR #13 ✅ MERGED
```

---

## Phase 1: Database Schema ✅ COMPLETE

**Branch:** `feat/database-schema`
**PR:** #2 - MERGED

### Tables to Create

| Table | Primary Columns |
|-------|-----------------|
| `categories` | id, name, slug, image, description |
| `products` | id, name, slug, description, price, stock, images, categoryId |
| `carts` | id, userId, createdAt, updatedAt |
| `cart_items` | id, cartId, productId, quantity |
| `addresses` | id, userId, label, recipientName, phone, province, city, district, postalCode, address, isDefault |
| `orders` | id, userId, addressId, status, totalAmount, shippingCost, paymentStatus, snapToken, snapUrl, midtransOrderId |
| `order_items` | id, orderId, productId, quantity, price |
| `shipping_info` | id, orderId, courier, service, estimatedDays, trackingNumber, status |

### Tasks

- [x] 1.1 Create `categories` schema
- [x] 1.2 Create `products` schema
- [x] 1.3 Create `carts` + `cart_items` schema
- [x] 1.4 Create `addresses` schema
- [x] 1.5 Create `orders` + `order_items` schema
- [x] 1.6 Create `shipping_info` schema
- [x] 1.7 Update `schema/index.ts` exports
- [x] 1.8 Run `db:push` to apply migrations

**PR #2:** Database schema for e-commerce ✅

---

## Phase 2: Product & Category API ✅ COMPLETE

**Branch:** `feat/product-api`
**PR:** #3 - MERGED

### Endpoints

```typescript
// Category Router
- getCategories()
- getCategoryById(id)
- getCategoryBySlug(slug)

// Product Router
- getProducts(categoryId?, search?, limit?, offset?)
- getProductById(id)
- getProductBySlug(slug)
- getFeaturedProducts()
```

### Tasks

- [x] 2.1 Create category router
- [x] 2.2 Create product router
- [x] 2.3 Update main router exports
- [x] 2.4 Create Zod schemas for request/response

**PR #3:** Product & category API endpoints ✅

---

## Phase 3: Cart API ✅ COMPLETE

**Branch:** `feat/cart-api`
**PR:** #4 - MERGED

### Endpoints

```typescript
// Cart Router
- getCart()
- addToCart(productId, quantity)
- updateCartItem(cartItemId, quantity)
- removeFromCart(cartItemId)
- clearCart()
```

### Tasks

- [x] 3.1 Create cart router (CRUD operations)
- [x] 3.2 Create Zod schemas

**PR #4:** Shopping cart API ✅

---

## Phase 4: Address & Shipping API ✅ COMPLETE

**Branch:** `feat/address-shipping-api`
**PR:** #5 - MERGED

### Endpoints

```typescript
// Address Router
- getAddresses()
- getAddressById(id)
- createAddress(data)
- updateAddress(id, data)
- deleteAddress(id)
- setDefaultAddress(id)

// Shipping Router (Raja Ongkir)
- getProvinces()
- getCities(provinceId)
- getSubdistricts(cityId)
- getShippingCost(origin, destination, weight, courier)
```

### Tasks

- [x] 4.1 Create address router (CRUD)
- [x] 4.2 Create shipping router (Raja Ongkir integration)
- [x] 4.3 Setup Raja Ongkir service
- [x] 4.4 Add environment variables for Raja Ongkir

### Environment Variables

```env
RAJAONGKIR_API_KEY=your_api_key
RAJAONGKIR_BASE_URL=https://api.rajaongkir.com/starter
```

**PR #5:** Address management & shipping cost API ✅

---

## Phase 5: Midtrans Integration ✅ COMPLETE

**Branch:** `feat/midtrans-integration`
**PR:** #6 - MERGED

### Endpoints

```typescript
// Payment Router
- createPayment(orderId)        // Generate Snap token
- getPaymentStatus(orderId)     // Check payment status

// Webhook (HTTP endpoint)
POST /api/webhooks/midtrans     // Handle Midtrans notification
```

### Payment Methods to Enable

- Virtual Account (BCA, BNI, Mandiri, Permata, etc.)
- Credit Card
- E-Wallet (GoPay, ShopeePay, DANA)
- Convenience Store (Alfamart, Indomaret)

### Tasks

- [x] 5.1 Setup Midtrans service
- [x] 5.2 Create payment router
- [x] 5.3 Implement Snap token generation
- [x] 5.4 Implement webhook handler
- [x] 5.5 Add environment variables for Midtrans
- [x] 5.6 Setup webhook endpoint in server

### Environment Variables

```env
MIDTRANS_SERVER_KEY=SB-Mid-server-xxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxx
MIDTRANS_IS_PRODUCTION=false
```

**PR #6:** Midtrans payment gateway integration ✅

---

## Phase 6: Order API ✅ COMPLETE

**Branch:** `feat/order-api`
**PR:** #7 - MERGED

### Endpoints

```typescript
// Order Router
- createOrder(addressId, shippingData)  // Create from cart
- getOrders()                           // User's order history
- getOrderById(id)                      // Order details
- getOrderByMidtransId(midtransOrderId) // For webhook lookup
- updateOrderStatus(id, status)         // Internal use
```

### Tasks

- [x] 6.1 Create order router
- [x] 6.2 Implement order creation (from cart)
- [x] 6.3 Implement order status update
- [x] 6.4 Integrate with payment & shipping

**PR #7:** Order management API ✅

---

## Phase 7: Product Screens ✅ COMPLETE

**Branch:** `feat/product-screens`
**PR:** #8 - MERGED

### File Structure

```
apps/native/app/(app)/
├── (tabs)/
│   ├── _layout.tsx         # Tab navigator
│   ├── index.tsx           # Home (featured products)
│   ├── products.tsx        # Product list with search
│   └── profile.tsx         # User profile
├── product/
│   └── [slug].tsx          # Product detail
```

### Components

```
apps/native/components/
├── gradient-background.tsx
├── uniwind.tsx (styled components)
└── (inline components in screens)
```

### Tasks

- [x] 7.1 Create ProductCard component
- [x] 7.2 Create CategoryCard component
- [x] 7.3 Create home screen with featured products
- [x] 7.4 Create product list screen
- [x] 7.5 Create product detail screen
- [x] 7.6 Create category list screen
- [x] 7.7 Create products by category screen
- [x] 7.8 Create product hooks
- [x] 7.9 Setup tab navigation

**PR #8:** Product browsing UI ✅

---

## Phase 8: Cart Screens ✅ COMPLETE

**Branch:** `feat/cart-screens`
**PR:** #9 - MERGED

### File Structure

```
apps/native/app/(app)/
├── (tabs)/
│   └── cart.tsx            # Shopping cart tab
```

### Components

```
apps/native/components/cart/
├── (inline CartItemCard component)
├── (inline quantity controls)
└── (inline cart summary)
```

### Tasks

- [x] 8.1 Create CartItem component
- [x] 8.2 Create QuantitySelector component
- [x] 8.3 Create CartSummary component
- [x] 8.4 Create cart screen
- [x] 8.5 Create cart hooks
- [x] 8.6 Add to cart from product detail

**PR #9:** Shopping cart UI ✅

---

## Phase 9: Checkout Screens ✅ COMPLETE

**Branch:** `feat/checkout-screens`
**PR:** #10 - MERGED

### File Structure

```
apps/native/app/(app)/
├── checkout/
│   ├── index.tsx           # Checkout flow (address + shipping + summary)
│   ├── address/
│   │   └── new.tsx         # Add new address form
│   ├── payment.tsx         # Midtrans WebView
│   ├── success.tsx         # Payment success
│   └── failed.tsx          # Payment failed
```

### Components

```
apps/native/components/checkout/
├── (inline AddressCard component)
├── (inline ShippingCard component)
└── (inline OrderSummary component)
```

### Tasks

- [x] 9.1 Create address selection screen
- [x] 9.2 Create address form component
- [x] 9.3 Create shipping selection screen
- [x] 9.4 Create order summary component
- [x] 9.5 Create Midtrans WebView screen
- [x] 9.6 Handle payment callback/redirect
- [x] 9.7 Create checkout hooks

**PR #10:** Checkout flow UI ✅

---

## Phase 10: Order Screens ✅ COMPLETE

**Branch:** `feat/order-screens`
**PR:** #11 - MERGED

### File Structure

```
apps/native/app/(app)/
├── (tabs)/
│   └── orders.tsx          # Order history tab
├── order/
│   └── [id].tsx            # Order detail
```

### Components

```
apps/native/components/orders/
├── (inline OrderCard component)
├── (inline status badges)
└── (inline order timeline)
```

### Tasks

- [x] 10.1 Create order list screen
- [x] 10.2 Create order detail screen
- [x] 10.3 Create order status badge
- [x] 10.4 Create order timeline (tracking)
- [x] 10.5 Create order hooks

**PR #11:** Order history & status UI ✅

---

## Phase 11: Seed Data ✅ COMPLETE

**Branch:** `feat/seed-data`
**PR:** #12 - MERGED

### Sample Data

- 6 product categories
- 36 products with images (6 per category)
- Sample product images from Unsplash

### Tasks

- [x] 11.1 Create seed script
- [x] 11.2 Seed categories
- [x] 11.3 Seed products with images
- [x] 11.4 Add seed command to package.json

**PR #12:** Sample data for testing ✅

---

## Phase 12: Documentation ✅ COMPLETE

**Branch:** `docs/readme`
**PR:** #13 - MERGED

### Tasks

- [x] 12.1 Update README.md
- [x] 12.2 Document environment setup
- [x] 12.3 Document Midtrans configuration
- [x] 12.4 Document Raja Ongkir setup
- [ ] 12.5 Add APK build instructions (future)
- [ ] 12.6 Add iOS build instructions (future)

**PR #13:** Project documentation ✅

---

## PR Summary

| # | Branch | Depends On | Description | Status |
|---|--------|------------|-------------|--------|
| 2 | `feat/database-schema` | - | Database schema | ✅ MERGED |
| 3 | `feat/product-api` | #2 | Product & Category API | ✅ MERGED |
| 4 | `feat/cart-api` | #2 | Cart API | ✅ MERGED |
| 5 | `feat/address-shipping-api` | #2 | Address & Shipping API | ✅ MERGED |
| 6 | `feat/midtrans-integration` | #2 | Midtrans Payment | ✅ MERGED |
| 7 | `feat/order-api` | #4, #5, #6 | Order API | ✅ MERGED |
| 8 | `feat/product-screens` | #3 | Product UI | ✅ MERGED |
| 9 | `feat/cart-screens` | #4 | Cart UI | ✅ MERGED |
| 10 | `feat/checkout-screens` | #5, #6, #7 | Checkout UI | ✅ MERGED |
| 11 | `feat/order-screens` | #7 | Order UI | ✅ MERGED |
| 12 | `feat/seed-data` | #3 | Sample Data | ✅ MERGED |
| 13 | `docs/readme` | All | Documentation | ✅ MERGED |

---

## Required External Accounts

### Midtrans (Required)

1. Register at https://midtrans.com
2. Get Sandbox credentials from Dashboard
3. Configure webhook URL in Midtrans Dashboard

### Raja Ongkir (Required for Shipping)

1. Register at https://rajaongkir.com
2. Get API Key (Starter tier is free)
3. Note: Starter tier has limited features

---

## Environment Variables

### Server (.env)

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/simple-commerce

# Authentication
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email
RESEND_API_KEY=your_resend_api_key

# Midtrans
MIDTRANS_SERVER_KEY=SB-Mid-server-xxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxx
MIDTRANS_IS_PRODUCTION=false

# Raja Ongkir
RAJAONGKIR_API_KEY=your_api_key
RAJAONGKIR_BASE_URL=https://api.rajaongkir.com/starter

# CORS
CORS_ORIGIN=http://localhost:8081
```

### Native App (.env)

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxx
```

---

## Timeline Estimate

| Phase | Estimated Duration | Actual Status |
|-------|-------------------|---------------|
| Phase 1: Database Schema | 0.5 day | ✅ Complete |
| Phase 2: Product API | 0.5 day | ✅ Complete |
| Phase 3: Cart API | 0.5 day | ✅ Complete |
| Phase 4: Address & Shipping API | 1 day | ✅ Complete |
| Phase 5: Midtrans Integration | 1 day | ✅ Complete |
| Phase 6: Order API | 0.5 day | ✅ Complete |
| Phase 7: Product Screens | 1.5 days | ✅ Complete |
| Phase 8: Cart Screens | 1 day | ✅ Complete |
| Phase 9: Checkout Screens | 1.5 days | ✅ Complete |
| Phase 10: Order Screens | 1 day | ✅ Complete |
| Phase 11: Seed Data | 0.5 day | ✅ Complete |
| Phase 12: Documentation | 0.5 day | ✅ Complete |
| **Total** | **~10 days** | **✅ ALL COMPLETE** |

---

## Features Checklist

### Required Features

- [x] Product listing page with categories
- [x] Product detail with buy button
- [x] Shopping cart with quantity management
- [x] User login/authentication
- [x] Auto-fill shipping data from user profile
- [x] Midtrans payment integration
- [x] Payment notification handling

### Bonus Features

- [x] Google OAuth login
- [x] Order status/history page
- [x] Raja Ongkir shipping integration
- [ ] Android & iOS builds (ready for build)
- [x] Complete documentation

---

## Implementation Files Summary

### Database Schema
- `packages/db/src/schema/category.ts`
- `packages/db/src/schema/product.ts`
- `packages/db/src/schema/cart.ts`
- `packages/db/src/schema/address.ts`
- `packages/db/src/schema/order.ts`
- `packages/db/src/schema/shipping.ts`
- `packages/db/src/schema/relations.ts`

### API Routers
- `packages/api/src/routers/category.ts`
- `packages/api/src/routers/product.ts`
- `packages/api/src/routers/cart.ts`
- `packages/api/src/routers/address.ts`
- `packages/api/src/routers/shipping.ts`
- `packages/api/src/routers/order.ts`
- `packages/api/src/routers/payment.ts`

### Services
- `packages/api/src/services/midtrans.ts`

### Mobile Screens
- `apps/native/app/(app)/(tabs)/index.tsx` - Home
- `apps/native/app/(app)/(tabs)/products.tsx` - Products
- `apps/native/app/(app)/(tabs)/cart.tsx` - Cart
- `apps/native/app/(app)/(tabs)/orders.tsx` - Orders
- `apps/native/app/(app)/(tabs)/profile.tsx` - Profile
- `apps/native/app/(app)/product/[slug].tsx` - Product Detail
- `apps/native/app/(app)/checkout/index.tsx` - Checkout
- `apps/native/app/(app)/checkout/address/new.tsx` - New Address
- `apps/native/app/(app)/checkout/payment.tsx` - Payment WebView
- `apps/native/app/(app)/checkout/success.tsx` - Success
- `apps/native/app/(app)/checkout/failed.tsx` - Failed
- `apps/native/app/(app)/order/[id].tsx` - Order Detail

### Hooks
- `apps/native/hooks/products.ts`
- `apps/native/hooks/cart.ts`
- `apps/native/hooks/checkout.ts`

### Seed Data
- `packages/db/src/seed.ts`
