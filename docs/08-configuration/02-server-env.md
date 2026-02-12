# Server Environment Variables

Variables for backend server.

## Required Variables

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/simple_commerce"

# Authentication
BETTER_AUTH_SECRET="your-secret-key-here-minimum-32-characters"
BETTER_AUTH_URL="http://localhost:3000"

# Midtrans
MIDTRANS_SERVER_KEY="SB-Mid-server-xxx"
MIDTRANS_CLIENT_KEY="SB-Mid-client-xxx"
MIDTRANS_IS_PRODUCTION="false"

# Raja Ongkir
RAJA_ONGKIR_API_KEY="your-api-key"
RAJA_ONGKIR_BASE_URL="https://api.rajaongkir.com/starter"

# Store
STORE_CITY_ID="152"

# CORS
CORS_ORIGIN="http://localhost:8081"
```

## Optional Variables

```env
# Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Email
RESEND_API_KEY=""
```
