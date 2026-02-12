# Installation

Step-by-step guide to installing Simple Commerce on your local machine.

## Overview

This guide will walk you through:
1. Cloning the repository
2. Installing dependencies
3. Verifying the installation

**Estimated Time:** 10-15 minutes

## Step 1: Clone the Repository

### Using HTTPS

```bash
git clone https://github.com/erhahahaa/simple-commerce.git
cd simple-commerce
```

### Using SSH

```bash
git clone git@github.com:erhahahaa/simple-commerce.git
cd simple-commerce
```

### Using GitHub CLI

```bash
gh repo clone erhahahaa/simple-commerce
cd simple-commerce
```

## Step 2: Verify Prerequisites

Before installing dependencies, ensure all prerequisites are met:

```bash
# Check Bun
bun --version
# Expected: 1.3.5 or higher

# Check Docker
docker --version
docker-compose --version

# Check Git
git --version
```

If any checks fail, see [Prerequisites](./01-prerequisites.md) for installation instructions.

## Step 3: Install Dependencies

Install all project dependencies using Bun:

```bash
bun install
```

This command will:
- Install root workspace dependencies
- Install dependencies for all packages
- Install dependencies for all apps
- Generate lock file (`bun.lock`)

### Expected Output

```
bun install v1.3.5
  Resolving dependencies
  Resolved, downloaded and extracted [ thousands of packages ]
  Saved lockfile
  + simple-commerce@workspace
  + native@workspace
  + server@workspace
  + @simple-commerce/api@workspace
  + @simple-commerce/auth@workspace
  + @simple-commerce/db@workspace
  + @simple-commerce/env@workspace
  + @simple-commerce/mailer@workspace
  + @simple-commerce/schema@workspace
```

### Installation Time

- First install: 2-5 minutes (depending on connection)
- Subsequent installs: 10-30 seconds

## Step 4: Verify Workspace Structure

After installation, verify the workspace structure:

```bash
# List workspaces
ls -la apps/
ls -la packages/

# Check if node_modules exists in root
ls node_modules/

# Verify workspace dependencies are linked
ls -la node_modules/@simple-commerce/
```

You should see symlinks to local packages:
```
api -> ../../packages/api
auth -> ../../packages/auth
db -> ../../packages/db
env -> ../../packages/env
mailer -> ../../packages/mailer
schema -> ../../packages/schema
```

## Step 5: Verify Scripts

Check available scripts:

```bash
# View all available scripts
bun run

# Or check package.json
cat package.json | grep -A 30 '"scripts"'
```

### Key Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start all applications |
| `bun run build` | Build all applications |
| `bun run check` | Run linting and formatting |
| `bun run check-types` | TypeScript type checking |

## Step 6: Quick Verification

Run a quick verification to ensure everything is installed:

```bash
# Check TypeScript compilation
bun run check-types
```

Expected output:
```
task @simple-commerce/api check-types$ tsc --noEmit
task @simple-commerce/db check-types$ tsc --noEmit
...
 Tasks:    9 successful
```

## Installation Troubleshooting

### Issue: Permission Denied

**Problem:** Cannot install dependencies due to permissions

**Solution:**
```bash
# Fix npm permissions (if needed)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Or use sudo (not recommended)
sudo bun install
```

### Issue: Network Timeout

**Problem:** Installation times out

**Solution:**
```bash
# Increase timeout
bun install --timeout 60000

# Or use different registry
bun install --registry https://registry.npmmirror.com
```

### Issue: Lock File Conflicts

**Problem:** `bun.lock` conflicts with `package.json`

**Solution:**
```bash
# Remove lock file and reinstall
rm bun.lock
bun install
```

### Issue: Workspace Dependencies Not Linked

**Problem:** Cannot find workspace packages

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules
bun install
```

### Issue: Platform-Specific Packages

**Problem:** Packages fail to install on certain platforms

**Solution:**
```bash
# Skip optional dependencies
bun install --no-optional

# Or force install
bun install --force
```

## Post-Installation Checklist

After successful installation, verify:

- [ ] Repository cloned successfully
- [ ] All dependencies installed
- [ ] No errors during installation
- [ ] Workspace packages linked
- [ ] `bun.lock` file created
- [ ] `node_modules` directories present
- [ ] Type checking passes

## What's Installed?

### Root Dependencies

| Category | Packages |
|----------|----------|
| **Linting** | @biomejs/biome |
| **Monorepo** | turbo |
| **Environment** | dotenv, zod |
| **Types** | @types/bun, typescript |

### App Dependencies

**Native App:**
- React Native and Expo SDK
- Navigation libraries
- UI components (HeroUI)
- State management (TanStack Query)
- Form handling (React Hook Form)

**Server:**
- Hono web framework
- ORPC for type-safe APIs
- Better Auth for authentication
- Drizzle ORM integration

### Package Dependencies

**API Package:**
- ORPC server and client
- Zod for validation
- Hono integration

**Database Package:**
- Drizzle ORM and Kit
- PostgreSQL driver (pg)

**Auth Package:**
- Better Auth
- Email integration

## Next Steps

Once installation is complete:

1. **Set up Environment** → [Environment Setup](./03-environment-setup.md)
2. **Configure Database** → [Database Setup](./04-database-setup.md)
3. **Run the App** → [Running Locally](./05-running-locally.md)

## Updating Dependencies

### Update All Dependencies

```bash
# Update to latest versions
bun update

# Update specific package
bun update @simple-commerce/api
```

### Clean Install

If you encounter persistent issues:

```bash
# Remove all node_modules
rm -rf node_modules apps/*/node_modules packages/*/node_modules

# Clear Bun cache
bun pm cache rm

# Reinstall
bun install
```

## Need Help?

If you encounter issues not covered here:

1. Check [Troubleshooting](../09-development/05-troubleshooting.md)
2. Review [Prerequisites](./01-prerequisites.md)
3. Search existing issues
4. Ask in team chat
