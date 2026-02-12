# Midtrans Payment Flow

How payment processing works.

## Flow Overview

```
1. User confirms order
   ↓
2. Backend creates Midtrans transaction
   ↓
3. Return Snap token to mobile
   ↓
4. Mobile opens Midtrans WebView
   ↓
5. User completes payment
   ↓
6. Midtrans redirects back
   ↓
7. User sees result screen
```

## Code Example

```typescript
// 1. Create transaction
const { token } = await api.payment.createTransaction.mutate({
  orderId: order.id,
});

// 2. Open payment
router.push(`/checkout/payment?token=${token}`);
```

## Snap WebView

The payment.tsx screen loads Midtrans Snap in a WebView with the token.
