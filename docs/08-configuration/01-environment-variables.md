# Environment Variables

Overview of all environment variables.

## Files

- `apps/server/.env` - Backend configuration
- `apps/native/.env` - Mobile app configuration

## Categories

### Database
- DATABASE_URL

### Authentication
- BETTER_AUTH_SECRET
- BETTER_AUTH_URL
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET

### Payment
- MIDTRANS_SERVER_KEY
- MIDTRANS_CLIENT_KEY
- MIDTRANS_IS_PRODUCTION

### Shipping
- RAJA_ONGKIR_API_KEY
- RAJA_ONGKIR_BASE_URL
- STORE_CITY_ID

### Email
- RESEND_API_KEY

### Server
- CORS_ORIGIN

### Mobile
- EXPO_PUBLIC_API_URL
- EXPO_PUBLIC_MIDTRANS_CLIENT_KEY

## Security

Never commit .env files to Git. They are in .gitignore.
