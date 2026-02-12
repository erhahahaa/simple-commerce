# Database Setup

Set up PostgreSQL database for Simple Commerce.

## Overview

Simple Commerce uses PostgreSQL as its primary database. This guide covers:
1. Starting PostgreSQL with Docker
2. Creating the database
3. Running schema migrations
4. Seeding with sample data

**Estimated Time:** 5-10 minutes

## Prerequisites

- Docker installed and running
- Project dependencies installed
- Environment variables configured

## Step 1: Start PostgreSQL Container

Start the PostgreSQL database using Docker Compose:

```bash
bun run db:start
```

This command:
- Starts PostgreSQL container
- Creates database named `simple_commerce`
- Sets up user `postgres` with password `postgres`
- Exposes port 5432

### Verify Container is Running

```bash
# Check container status
docker ps

# Expected output:
CONTAINER ID   IMAGE      COMMAND                  CREATED         STATUS         PORTS                    NAMES
abc123         postgres   "docker-entrypoint.s…"   5 seconds ago   Up 4 seconds   0.0.0.0:5432->5432/tcp   simple-commerce-db
```

### View Container Logs

```bash
docker logs simple-commerce-db
```

## Step 2: Push Database Schema

Apply the database schema using Drizzle Kit:

```bash
bun run db:push
```

This command:
- Reads schema files from `packages/db/src/schema/`
- Creates tables in the database
- Sets up relationships and constraints

### Expected Output

```
[✓] Changes applied

Created tables:
- user
- session
- account
- verification
- category
- product
- cart
- cart_item
- address
- order
- order_item
- shipping_info
- wishlist
```

### Verify Schema Applied

**Using Drizzle Studio:**
```bash
bun run db:studio
```

Open browser to `http://localhost:4983` to view database visually.

**Using psql:**
```bash
docker exec -it simple-commerce-db psql -U postgres -d simple_commerce

# List tables
\dt

# Exit
\q
```

## Step 3: Seed Database with Sample Data

Populate the database with sample products and categories:

```bash
bun run db:seed
```

This command:
- Creates 6 product categories
- Creates 36 sample products (6 per category)
- Sets up realistic product data with images

### Sample Data Created

**Categories:**
1. Electronics
2. Fashion
3. Home & Living
4. Beauty & Health
5. Sports & Outdoors
6. Food & Beverages

**Products per Category:**
- Each category has 6 products
- Realistic names and descriptions
- Indonesian Rupiah pricing
- Sample images from Unsplash
- Stock quantities

### Verify Seed Data

**Using Drizzle Studio:**
```bash
bun run db:studio
```

Navigate to tables and verify data exists.

**Using SQL:**
```sql
-- Count categories
SELECT COUNT(*) FROM category;
-- Expected: 6

-- Count products
SELECT COUNT(*) FROM product;
-- Expected: 36

-- View sample products
SELECT name, price, stock FROM product LIMIT 5;
```

## Step 4: Verify Database Connection

Test that the server can connect to the database:

```bash
# Start the server
cd apps/server
bun run dev
```

If successful, you should see:
```
Server running at http://localhost:3000
Database connected successfully
```

## Database Commands Reference

### Development Commands

| Command | Description |
|---------|-------------|
| `bun run db:start` | Start PostgreSQL container |
| `bun run db:stop` | Stop PostgreSQL container |
| `bun run db:down` | Remove container and volumes |
| `bun run db:push` | Push schema to database |
| `bun run db:seed` | Seed with sample data |
| `bun run db:studio` | Open Drizzle Studio UI |
| `bun run db:reset` | Reset database (drop & recreate) |

### Migration Commands

| Command | Description |
|---------|-------------|
| `bun run db:generate` | Generate migration files |
| `bun run db:migrate` | Run pending migrations |

## Docker Compose Configuration

The database is configured in `packages/db/docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: simple-commerce-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: simple_commerce
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Customizing Configuration

To change database settings, edit the compose file:

```yaml
environment:
  POSTGRES_USER: your_user
  POSTGRES_PASSWORD: your_password
  POSTGRES_DB: your_database
ports:
  - "5433:5432"  # Change host port
```

After changes:
```bash
bun run db:down
bun run db:start
```

## Database Schema Overview

### Core Tables

| Table | Purpose |
|-------|---------|
| `user` | User accounts |
| `session` | Active sessions |
| `account` | OAuth accounts |
| `verification` | Email verification |

### E-commerce Tables

| Table | Purpose |
|-------|---------|
| `category` | Product categories |
| `product` | Product catalog |
| `cart` | Shopping carts |
| `cart_item` | Cart items |
| `address` | Shipping addresses |
| `order` | Customer orders |
| `order_item` | Order line items |
| `shipping_info` | Shipping details |
| `wishlist` | Wishlist items |

See [Database Schema](../04-database/01-overview.md) for detailed documentation.

## Troubleshooting

### Issue: Port Already in Use

```
Error: Bind for 0.0.0.0:5432 failed: port is already allocated
```

**Solution:**
```bash
# Find process using port
lsof -i :5432

# Kill process
kill -9 <PID>

# Or use different port
docker run -p 5433:5432 postgres:15-alpine
```

### Issue: Container Won't Start

```
Error: database system was interrupted
```

**Solution:**
```bash
# Reset container
bun run db:down
bun run db:start
```

### Issue: Permission Denied

```
Error: permission denied for database simple_commerce
```

**Solution:**
```bash
# Connect as superuser
docker exec -it simple-commerce-db psql -U postgres

# Grant permissions
GRANT ALL PRIVILEGES ON DATABASE simple_commerce TO postgres;
\q
```

### Issue: Schema Push Fails

```
Error: relation already exists
```

**Solution:**
```bash
# Reset database
bun run db:reset

# Then push schema again
bun run db:push
```

### Issue: Cannot Connect to Database

**Check:**
1. Container is running: `docker ps`
2. Port is correct in `.env`
3. Credentials match `docker-compose.yml`
4. Database URL format is correct

## Database Management Tools

### Drizzle Studio

Visual database management:

```bash
bun run db:studio
```

Features:
- Browse tables
- Edit data
- Run queries
- Export data

### TablePlus (GUI Client)

Download from [tableplus.com](https://tableplus.com/)

Connection settings:
- Host: localhost
- Port: 5432
- User: postgres
- Password: postgres
- Database: simple_commerce

### pgAdmin

Download from [pgadmin.org](https://www.pgadmin.org/)

### Command Line (psql)

```bash
# Connect to database
docker exec -it simple-commerce-db psql -U postgres -d simple_commerce

# Common commands
\dt           # List tables
\d table_name # Describe table
\q            # Quit
```

## Next Steps

With database set up:

1. **Start the Server** → [Running Locally](./05-running-locally.md)
2. **Set up Mobile App** → [Mobile App Setup](./06-mobile-app-setup.md)
3. **Learn Database Schema** → [Database Overview](../04-database/01-overview.md)

## Database Maintenance

### Backup Database

```bash
# Create backup
docker exec simple-commerce-db pg_dump -U postgres simple_commerce > backup.sql

# Restore backup
docker exec -i simple-commerce-db psql -U postgres simple_commerce < backup.sql
```

### Reset Database

```bash
# Complete reset
bun run db:reset

# This will:
# 1. Drop container and volumes
# 2. Recreate container
# 3. Push schema
# 4. Seed data
```

### Update Schema

When making schema changes:

1. Edit schema files in `packages/db/src/schema/`
2. Run `bun run db:push` to apply
3. Update seed data if needed
4. Test thoroughly

## Quick Reference

| Task | Command |
|------|---------|
| Start DB | `bun run db:start` |
| Stop DB | `bun run db:stop` |
| Reset DB | `bun run db:reset` |
| View data | `bun run db:studio` |
| Push schema | `bun run db:push` |
| Seed data | `bun run db:seed` |
