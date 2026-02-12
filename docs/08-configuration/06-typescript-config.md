# TypeScript Configuration

TypeScript setup across the monorepo.

## Files

- `tsconfig.json` - Root configuration
- `packages/config/tsconfig.base.json` - Shared base config
- `apps/*/tsconfig.json` - App-specific configs

## Base Configuration

`packages/config/tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## Type Checking

```bash
# Check all packages
bun run check-types

# Check specific package
cd packages/api && bun run check-types
```

## Strict Mode

TypeScript strict mode is enabled for maximum type safety.
