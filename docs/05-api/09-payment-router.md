# Payment Router

API endpoints for payment processing.

## Procedures

### createTransaction

Create Midtrans transaction.

**Access:** Protected

**Input:** `{ orderId: string }`

**Output:**
```typescript
{
  token: string
  redirect_url: string
}
```

### getStatus

Get payment status.

**Access:** Protected

**Input:** `{ orderId: string }`

**Output:**
```typescript
{
  status: PaymentStatus
  midtransStatus?: string
}
```

## Webhook

### Midtrans Webhook

Endpoint: POST /api/payments/webhook/midtrans

**Description:** Receives payment notifications from Midtrans.

**Process:**
1. Verify signature
2. Update order payment status
3. Send confirmation email

**No authentication required** (uses signature verification).
