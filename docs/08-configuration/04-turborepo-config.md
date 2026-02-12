# Turborepo Configuration

Turborepo pipeline and caching configuration.

## File

`turbo.json`

## Configuration

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
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

## Key Features

- **Caching:** Skip unchanged tasks
- **Parallelization:** Run independent tasks in parallel
- **Pipeline:** Define task dependencies

## Common Tasks

| Task | Description |
|------|-------------|
| build | Build all applications |
| dev | Start development mode |
| db:push | Push database schema |
| db:studio | Open Drizzle Studio |
