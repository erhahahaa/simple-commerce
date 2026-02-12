# Midtrans Setup

Setting up Midtrans account and credentials.

## Account Registration

1. Go to midtrans.com
2. Click "Sign Up"
3. Fill in registration form
4. Verify email

## Sandbox Environment

1. Login to dashboard
2. Switch to "Sandbox" (top right)
3. Get credentials from Settings → Access Keys

## Credentials Needed

- Server Key (SB-Mid-server-xxx)
- Client Key (SB-Mid-client-xxx)

## Environment Variables

```env
MIDTRANS_SERVER_KEY=SB-Mid-server-xxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxx
MIDTRANS_IS_PRODUCTION=false
```

## Testing

Use Midtrans sandbox credentials for testing payments without real money.
