# Git Workflow

Git branching and commit conventions.

## Branching Strategy

### Main Branches

- `main` - Production code
- `develop` - Development integration (optional)

### Feature Branches

```
feat/description
fix/description
docs/description
refactor/description
test/description
```

### Examples

```bash
feat/product-search
fix/cart-total-calculation
docs/api-endpoints
refactor/order-router
```

## Commit Conventions

Use conventional commits:

```
<type>: <description>

[optional body]
```

### Types

- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation
- **style:** Formatting
- **refactor:** Code refactoring
- **test:** Tests
- **chore:** Maintenance

### Examples

```
feat: add product search functionality

fix: correct cart total calculation

docs: update API reference

refactor: simplify order creation logic
```

## Pull Request Process

1. Create feature branch
2. Make changes
3. Run checks: `bun run check && bun run check-types`
4. Commit with conventional messages
5. Push branch
6. Create PR to main
7. Request review
8. Merge after approval
