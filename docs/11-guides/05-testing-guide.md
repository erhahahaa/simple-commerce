# Testing Guide

Testing strategies for Simple Commerce.

## Types of Tests

### Unit Tests

Test individual functions/components.

**Setup (when implemented):**
```bash
bun test
```

### Integration Tests

Test API endpoints and database operations.

### E2E Tests

Test complete user flows.

**Tools:**
- Detox (React Native E2E)
- Playwright (Web)

## Manual Testing Checklist

### Authentication
- [ ] Sign up with email
- [ ] Sign in with email
- [ ] Sign in with Google
- [ ] Password reset
- [ ] Email verification

### Products
- [ ] Browse categories
- [ ] Search products
- [ ] View product details
- [ ] Filter by category

### Cart
- [ ] Add to cart
- [ ] Update quantity
- [ ] Remove item
- [ ] View cart total

### Checkout
- [ ] Add address
- [ ] Calculate shipping
- [ ] Create order
- [ ] Complete payment

### Orders
- [ ] View order history
- [ ] View order details
- [ ] Track order status
- [ ] Cancel order

## API Testing

Use API reference at `http://localhost:3000/api-reference`

Or use tools like:
- Postman
- Insomnia
- curl

## Testing Payment (Sandbox)

Use Midtrans sandbox test credentials:
- Bank transfer: Use any account number
- Credit card: Use test card numbers from Midtrans docs

## Performance Testing

### Backend

```bash
# Load test with k6 or artillery
k6 run load-test.js
```

### Mobile

- Use React Native Performance Monitor
- Check memory usage
- Test on low-end devices

## Test Data

Use seed data for consistent testing:

```bash
bun run db:seed
```

## Future Testing Setup

Consider adding:
- Jest for unit tests
- React Native Testing Library
- Detox for E2E tests
- CI/CD test automation
