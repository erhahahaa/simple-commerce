# Available Scripts

All available npm/bun scripts.

## Root Level Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start all applications |
| `bun run build` | Build all applications |
| `bun run check` | Run Biome linting and formatting |
| `bun run check-types` | TypeScript type checking |
| `bun run dev:native` | Start mobile app only |
| `bun run dev:server` | Start backend server only |

## Database Scripts

| Script | Description |
|--------|-------------|
| `bun run db:start` | Start PostgreSQL container |
| `bun run db:stop` | Stop PostgreSQL container |
| `bun run db:push` | Push schema to database |
| `bun run db:seed` | Seed database with sample data |
| `bun run db:studio` | Open Drizzle Studio UI |
| `bun run db:reset` | Reset database |
| `bun run db:generate` | Generate migrations |
| `bun run db:migrate` | Run migrations |

## Email Scripts

| Script | Description |
|--------|-------------|
| `bun run email:dev` | Start React Email development server |

## Using Turbo

Filter commands to specific packages:

```bash
# Run in specific package
turbo -F @simple-commerce/db db:studio

# Run dev for specific app
turbo -F native dev
```
