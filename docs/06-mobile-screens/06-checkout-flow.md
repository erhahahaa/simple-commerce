# Checkout Flow

Multi-step checkout process.

## Files

- `apps/native/app/(app)/checkout/index.tsx` - Main checkout
- `apps/native/app/(app)/checkout/payment.tsx` - Payment
- `apps/native/app/(app)/checkout/success.tsx` - Success
- `apps/native/app/(app)/checkout/failed.tsx` - Failed

## Steps

1. **Select Address**
   - List saved addresses
   - Add new address option

2. **Shipping Selection**
   - Calculate shipping costs
   - Select courier and service

3. **Order Summary**
   - Review items
   - Confirm total

4. **Payment**
   - Open Midtrans WebView
   - Complete payment

5. **Confirmation**
   - Success or failure screen

## Data Flow

```typescript
// Create order
const order = await api.order.checkout.mutate({
  addressId: selectedAddress,
  shippingData: selectedShipping,
});

// Get payment token
const { token } = await api.payment.createTransaction.mutate({
  orderId: order.id,
});

// Open payment
router.push(`/checkout/payment?token=${token}`);
```
