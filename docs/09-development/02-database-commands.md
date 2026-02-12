# Database Commands

All database-related commands.

## Docker Commands

```bash
# Start database
bun run db:start

# Stop database
bun run db:stop

# Remove container and volumes
bun run db:down
```

## Schema Commands

```bash
# Push schema to database
bun run db:push

# Generate migration files
bun run db:generate

# Run migrations
bun run db:migrate
```

## Data Commands

```bash
# Seed database
bun run db:seed

# Reset database (drop and recreate)
bun run db:reset
```

## Management Commands

```bash
# Open Drizzle Studio
bun run db:studio

# Watch database changes
bun run db:watch
```

## Direct SQL Access

```bash
# Connect to database
docker exec -it simple-commerce-db psql -U postgres -d simple_commerce

# Run SQL
\dt              # List tables
\d table_name    # Describe table
\q               # Quit
```
