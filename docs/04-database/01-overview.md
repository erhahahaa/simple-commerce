# Database Overview

Overview of the Simple Commerce database.

## Database System

- **Engine:** PostgreSQL 15
- **ORM:** Drizzle ORM 0.45.1
- **Migration Tool:** Drizzle Kit 0.31.9

## Schema Overview

### Authentication Tables

| Table | Description |
|-------|-------------|
| user | User accounts |
| session | Active sessions |
| account | OAuth provider accounts |
| verification | Email verification tokens |

### E-commerce Tables

| Table | Description |
|-------|-------------|
| category | Product categories |
| product | Product catalog |
| cart | Shopping carts |
| cart_item | Items in cart |
| address | Shipping addresses |
| order | Customer orders |
| order_item | Order line items |
| shipping_info | Shipping details |
| wishlist | Wishlist items |

## Key Design Decisions

1. **Soft Deletes:** Not implemented; hard deletes used
2. **Timestamps:** All tables have createdAt and updatedAt
3. **Relations:** Defined separately in relations.ts
4. **Currency:** Prices stored as integers (cents/IDR)
5. **IDs:** UUID v4 for all primary keys

## Related Documents

- [Authentication Tables](./02-authentication-tables.md)
- [Category Table](./03-category-table.md)
- [Product Table](./04-product-table.md)
