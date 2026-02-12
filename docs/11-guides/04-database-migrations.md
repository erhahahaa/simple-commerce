# Database Migrations

Working with database migrations.

## When to Use Migrations

- Production database changes
- Schema versioning
- Team collaboration

## Generate Migration

```bash
bun run db:generate
```

This creates migration files in `packages/db/migrations/`.

## Run Migrations

```bash
bun run db:migrate
```

## Migration Workflow

1. **Development:** Use `db:push` for quick iteration
2. **Staging/Production:** Use `db:generate` and `db:migrate`

## Migration Files

```sql
-- 0000_initial.sql
CREATE TABLE IF NOT EXISTS "user" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" text NOT NULL UNIQUE
);
```

## Best Practices

- One migration per logical change
- Test migrations on staging first
- Never modify existing migration files
- Keep migrations backward compatible when possible

## Rollback

Drizzle Kit doesn't have automatic rollback. To revert:

1. Create new migration with revert changes
2. Or restore from backup

## Migration Checklist

- [ ] Generated migration file
- [ ] Tested locally
- [ ] Tested on staging
- [ ] Backup production database
- [ ] Run during low traffic
