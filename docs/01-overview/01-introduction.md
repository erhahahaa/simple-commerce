# Introduction

Simple Commerce is a full-stack e-commerce mobile application designed specifically for the Indonesian market. It provides a complete, production-ready shopping experience with modern technologies and local payment and shipping integrations.

## What is Simple Commerce?

Simple Commerce is an end-to-end e-commerce solution consisting of:

- **Mobile Application** - React Native app built with Expo for iOS and Android
- **Backend API** - Type-safe API built with Hono and ORPC
- **Database** - PostgreSQL with Drizzle ORM for data persistence
- **Payment Integration** - Midtrans for Indonesian payment methods
- **Shipping Integration** - Raja Ongkir for domestic shipping calculations

## Why Simple Commerce?

### Market-Specific

Unlike generic e-commerce solutions, Simple Commerce is built for Indonesia:

- **Midtrans Integration** - Supports all major Indonesian payment methods (BCA, BNI, Mandiri, GoPay, ShopeePay, etc.)
- **Raja Ongkir** - Calculates shipping costs using JNE, TIKI, and POS Indonesia
- **IDR Currency** - Native Indonesian Rupiah handling
- **Local Context** - Designed for Indonesian e-commerce patterns

### Modern Stack

Built with current best practices:

- **Type Safety** - End-to-end TypeScript with type-safe APIs
- **Performance** - Optimized database queries and efficient mobile rendering
- **Developer Experience** - Hot reloading, great tooling, clear documentation
- **Scalability** - Microservice-ready architecture

### Complete Solution

Everything needed for e-commerce:

- Product catalog with categories
- Shopping cart management
- User authentication (email + Google OAuth)
- Address management
- Shipping cost calculation
- Payment processing
- Order tracking
- Order history

## Key Capabilities

### For Customers

- Browse products by category
- Search products
- View product details with images
- Add items to cart
- Manage multiple shipping addresses
- Calculate shipping costs
- Pay with preferred method
- Track order status
- View order history

### For Developers

- Type-safe API with automatic client generation
- Hot reloading for fast development
- Clear database schema with migrations
- Well-organized codebase
- Comprehensive documentation
- Docker support for easy setup
- Seed data for testing

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    MOBILE APP (Expo/RN)                      │
│  React Native + Expo Router + HeroUI + TanStack Query       │
└──────────────────────────┬──────────────────────────────────┘
                           │ ORPC (Type-safe RPC)
┌──────────────────────────┴──────────────────────────────────┐
│                    BACKEND (Hono + ORPC)                     │
│  File-based routing + Better Auth + ORPC Procedures         │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
   ┌─────▼─────┐    ┌─────▼─────┐    ┌─────▼─────┐
   │ Midtrans  │    │Raja Ongkir│    │ PostgreSQL│
   │  Payments │    │  Shipping │    │  Database │
   └───────────┘    └───────────┘    └───────────┘
```

## Who Is This For?

### Primary Users

- **Indonesian E-commerce Businesses** - Ready-to-use platform
- **Developers** - Learning modern full-stack development
- **Startups** - Quick time-to-market solution
- **Students** - Understanding e-commerce architecture

### Use Cases

- Online retail stores
- Digital product sales
- Service booking platforms
- Learning modern React Native development
- Teaching full-stack architecture

## Project Status

- **Status**: Production-ready
- **Version**: 1.0.0
- **License**: MIT
- **Maintenance**: Active

## Getting Started

Ready to dive in? Choose your path:

1. **Quick Setup** - See [Installation](../02-getting-started/02-installation.md)
2. **Understand Architecture** - Read [System Overview](../03-architecture/01-system-overview.md)
3. **Explore the API** - Check [API Overview](../05-api/01-overview.md)
4. **Mobile Development** - Review [Mobile Screens](../06-mobile-screens/01-navigation-structure.md)

## Support and Resources

- **Documentation**: You're reading it! 🎉
- **Code Examples**: See `assets/code-snippets/`
- **Glossary**: [Terms and Definitions](../glossary.md)
- **Changelog**: [Recent Changes](../changelog.md)

## Next Steps

- Learn about [Features](./02-features.md)
- Review the [Technology Stack](./03-tech-stack.md)
- Understand [Project Structure](./04-project-structure.md)

---

**Built with** [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack) - A modern TypeScript stack combining Hono, ORPC, and more.
