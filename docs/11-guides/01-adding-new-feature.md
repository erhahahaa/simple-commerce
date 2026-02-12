# Adding a New Feature

Guide for adding new features to Simple Commerce.

## Step 1: Plan the Feature

- Define requirements
- Design database schema (if needed)
- Design API endpoints
- Design UI screens

## Step 2: Database Changes

1. Update schema in `packages/db/src/schema/`
2. Run `bun run db:push`
3. Update relations if needed
4. Update seed data if applicable

## Step 3: API Development

1. Create/update router in `packages/api/src/routers/`
2. Add Zod schemas for validation
3. Implement procedures
4. Export from main router

## Step 4: Mobile UI

1. Create screen in `apps/native/app/`
2. Add to navigation if needed
3. Use TanStack Query for data
4. Test on device

## Step 5: Testing

1. Test API endpoints
2. Test mobile screens
3. Test full user flow
4. Run type checks

## Step 6: Documentation

1. Update relevant docs
2. Add code comments
3. Update README if needed

## Example: Adding Product Reviews

1. **Database:** Create `review` table
2. **API:** Add review router with CRUD operations
3. **Mobile:** Add review screen on product detail
4. **Test:** Test review creation and display
