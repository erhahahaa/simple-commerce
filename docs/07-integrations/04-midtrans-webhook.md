# Midtrans Webhook

Handling payment notifications.

## Webhook Endpoint

POST /api/payments/webhook/midtrans

## Process

1. Receive notification from Midtrans
2. Verify signature
3. Update order payment status
4. Send confirmation email

## Security

- Signature verification required
- No authentication token needed
- Validates notification authenticity

## Payload Example

```json
{
  "transaction_status": "settlement",
  "order_id": "order-uuid",
  "gross_amount": "150000",
  "payment_type": "bank_transfer"
}
```
