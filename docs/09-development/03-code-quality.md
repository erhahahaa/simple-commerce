# Code Quality

Maintaining code quality standards.

## Linting and Formatting

**Biome** handles both linting and formatting.

### Run Checks

```bash
# Check all files
bun run check

# Fix auto-fixable issues
bun run check --write
```

### Pre-commit

Run checks before committing:

```bash
bun run check && bun run check-types
```

## Type Checking

```bash
# Check all packages
bun run check-types

# Check specific package
cd packages/api && bun run check-types
```

## Standards

- **TypeScript:** Strict mode enabled
- **Formatting:** Biome rules
- **Imports:** Organized automatically
- **Naming:** camelCase for variables, PascalCase for components

## IDE Setup

### VS Code

Install extensions:
- Biome
- TypeScript
- Tailwind CSS IntelliSense

### Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "biomejs.biome"
}
```
