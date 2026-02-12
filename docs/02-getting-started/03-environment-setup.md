# Environment Setup

Configure environment variables for local development.

## Overview

Simple Commerce requires environment variables for:
- Database connection
- Authentication secrets
- Payment gateway credentials
- Shipping API credentials
- Email service configuration

**Files to Create:**
- `apps/server/.env` - Server environment
- `apps/native/.env` - Mobile app environment

## Step 1: Server Environment Variables

Create `apps/server/.env`:

```bash
touch apps/server/.env
```

### Required Variables

Add these variables to `apps/server/.env`:

```env
# =============================================================================
# DATABASE CONFIGURATION
# =============================================================================
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/simple_commerce"

# Format: postgresql://user:password@host:port/database
# Default: postgres/postgres@localhost:5432/simple_commerce

# =============================================================================
# AUTHENTICATION CONFIGURATION
# =============================================================================
BETTER_AUTH_SECRET="your-secret-key-here-minimum-32-characters"
BETTER_AUTH_URL="http://localhost:3000"

# BETTER_AUTH_SECRET: Generate with: openssl rand -base64 32
# BETTER_AUTH_URL: Your server URL (change for production)

# =============================================================================
# GOOGLE OAUTH (Optional)
# =============================================================================
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Get from: https://console.cloud.google.com/apis/credentials
# Required for Google OAuth login

# =============================================================================
# MIDTRANS PAYMENT CONFIGURATION
# =============================================================================
MIDTRANS_SERVER_KEY="SB-Mid-server-your-server-key-here"
MIDTRANS_CLIENT_KEY="SB-Mid-client-your-client-key-here"
MIDTRANS_IS_PRODUCTION="false"

# Get from: https://dashboard.midtrans.com
# Use Sandbox keys for development
# Set IS_PRODUCTION to "true" for production

# =============================================================================
# RAJA ONGKIR SHIPPING CONFIGURATION
# =============================================================================
RAJA_ONGKIR_API_KEY="your-raja-ongkir-api-key"
RAJA_ONGKIR_BASE_URL="https://api.rajaongkir.com/starter"

# Get from: https://rajaongkir.com/akun/daftar
# Starter plan is free

# =============================================================================
# RESEND EMAIL CONFIGURATION (Optional)
# =============================================================================
RESEND_API_KEY="re_your-resend-api-key"

# Get from: https://resend.com/api-keys
# Required for email verification and password reset

# =============================================================================
# STORE CONFIGURATION
# =============================================================================
STORE_CITY_ID="152"

# City ID for shipping origin (152 = Jakarta Selatan)
# Get city ID from Raja Ongkir API

# =============================================================================
# CORS CONFIGURATION
# =============================================================================
CORS_ORIGIN="http://localhost:8081"

# React Native Metro bundler default URL
# Change if using different port
```

### Generating Secrets

**Better Auth Secret:**
```bash
openssl rand -base64 32
```

Copy the output and paste as `BETTER_AUTH_SECRET`.

## Step 2: Native App Environment Variables

Create `apps/native/.env`:

```bash
touch apps/native/.env
```

### Required Variables

Add these variables to `apps/native/.env`:

```env
# =============================================================================
# API CONFIGURATION
# =============================================================================
EXPO_PUBLIC_API_URL="http://YOUR_LOCAL_IP:3000"

# IMPORTANT: Use your computer's local IP, not localhost
# Find your IP: ipconfig (Windows) or ifconfig (macOS/Linux)
# Example: "http://192.168.1.5:3000"

# =============================================================================
# MIDTRANS CLIENT KEY
# =============================================================================
EXPO_PUBLIC_MIDTRANS_CLIENT_KEY="SB-Mid-client-your-client-key-here"

# Same as MIDTRANS_CLIENT_KEY in server .env
```

### Finding Your Local IP

**macOS/Linux:**
```bash
# Method 1
ifconfig | grep "inet " | grep -v 127.0.0.1

# Method 2
ipconfig getifaddr en0

# Method 3
hostname -I
```

**Windows:**
```cmd
ipconfig

# Look for "IPv4 Address" under your active connection
```

**Example Output:**
```
inet 192.168.1.5 netmask 0xffffff00 broadcast 192.168.1.255
```

Your IP is `192.168.1.5`, so set:
```env
EXPO_PUBLIC_API_URL="http://192.168.1.5:3000"
```

## Step 3: Getting External API Keys

### Midtrans Setup

1. **Register:**
   - Go to [midtrans.com](https://midtrans.com)
   - Click "Sign Up" and create account
   - Verify email

2. **Access Sandbox:**
   - Login to dashboard
   - Switch to "Sandbox" environment (top right)

3. **Get Keys:**
   - Go to Settings → Access Keys
   - Copy "Server Key" (starts with `SB-Mid-server-`)
   - Copy "Client Key" (starts with `SB-Mid-client-`)

4. **Configure Webhook (Optional for local dev):**
   - Go to Settings → Notification URL
   - Set URL: `https://your-ngrok-url/api/payments/webhook/midtrans`
   - Or use local tunnel for testing

### Raja Ongkir Setup

1. **Register:**
   - Go to [rajaongkir.com](https://rajaongkir.com/akun/daftar)
   - Fill registration form
   - Verify email

2. **Get API Key:**
   - Login to dashboard
   - Copy "API Key" from dashboard

3. **Test API:**
   ```bash
   curl -X GET \
     https://api.rajaongkir.com/starter/province \
     -H "key: YOUR_API_KEY"
   ```

### Google OAuth Setup (Optional)

1. **Create Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project or select existing

2. **Enable API:**
   - Go to APIs & Services → Library
   - Search "Google+ API" or "Google Identity Toolkit API"
   - Click Enable

3. **Create Credentials:**
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: Web application
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `com.yourapp.native://` (for mobile)

4. **Get Keys:**
   - Copy "Client ID"
   - Copy "Client Secret"

### Resend Setup (Optional)

1. **Register:**
   - Go to [resend.com](https://resend.com)
   - Create account

2. **Get API Key:**
   - Go to API Keys
   - Create new API key
   - Copy the key (starts with `re_`)

3. **Verify Domain (Production):**
   - Add and verify your domain
   - Required for sending emails

## Step 4: Environment Validation

The project uses `@simple-commerce/env` for type-safe environment variables. Variables are validated at runtime.

### Validation Errors

If you see errors like:
```
❌ Invalid environment variables:
   - DATABASE_URL: Required
   - BETTER_AUTH_SECRET: Required
```

Check that:
1. `.env` file exists in correct location
2. Variables are spelled correctly
3. Values are not empty

### Testing Environment Setup

**Test server env:**
```bash
cd apps/server
bun run dev

# Should start without errors if env is valid
```

**Test native env:**
```bash
cd apps/native
bun run dev

# App should connect to API
```

## Environment File Security

### Do Not Commit

Environment files are in `.gitignore` and should never be committed:

```gitignore
# .gitignore
.env
.env.local
.env.*.local
```

### Sharing Environment Variables

For team members:

1. **Create `.env.example` files** (already done)
2. **Share credentials securely** (1Password, Vault, etc.)
3. **Document required variables** in this guide

### Production Environment

For production deployment:

1. **Use production API keys:**
   - Midtrans: Use production keys, set `MIDTRANS_IS_PRODUCTION=true`
   - Raja Ongkir: Use production API key

2. **Set production URLs:**
   ```env
   BETTER_AUTH_URL="https://api.yourdomain.com"
   CORS_ORIGIN="https://app.yourdomain.com"
   ```

3. **Use strong secrets:**
   - Generate new `BETTER_AUTH_SECRET`
   - Use different secrets than development

## Troubleshooting

### Issue: Database Connection Failed

```
Error: Connection refused
```

**Solutions:**
1. Start PostgreSQL: `bun run db:start`
2. Check port: Ensure port 5432 is available
3. Verify credentials: Check username/password

### Issue: Cannot Connect to API from Mobile App

```
Network request failed
```

**Solutions:**
1. Use local IP, not `localhost`
2. Ensure devices are on same network
3. Check firewall settings
4. Verify `EXPO_PUBLIC_API_URL` format

### Issue: Invalid Environment Variables

**Solutions:**
1. Check variable names match exactly
2. Ensure no extra spaces
3. Quote values with special characters
4. Verify `.env` file location

## Next Steps

With environment variables configured:

1. **Set up Database** → [Database Setup](./04-database-setup.md)
2. **Run the App** → [Running Locally](./05-running-locally.md)
3. **Configure Mobile App** → [Mobile App Setup](./06-mobile-app-setup.md)

## Quick Reference

| Variable | Location | Source |
|----------|----------|--------|
| `DATABASE_URL` | `apps/server/.env` | Local PostgreSQL |
| `BETTER_AUTH_SECRET` | `apps/server/.env` | Generate with openssl |
| `MIDTRANS_SERVER_KEY` | `apps/server/.env` | Midtrans Dashboard |
| `MIDTRANS_CLIENT_KEY` | Both `.env` files | Midtrans Dashboard |
| `RAJA_ONGKIR_API_KEY` | `apps/server/.env` | Raja Ongkir Dashboard |
| `EXPO_PUBLIC_API_URL` | `apps/native/.env` | Your local IP |
