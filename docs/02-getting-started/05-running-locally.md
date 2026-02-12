# Running Locally

Start the Simple Commerce application on your local machine.

## Overview

This guide covers running both the backend server and mobile application in development mode.

**Prerequisites:**
- Dependencies installed
- Environment variables configured
- Database set up and running

## Option 1: Start All Services (Recommended)

Run both server and mobile app simultaneously:

```bash
# From project root
bun run dev
```

This command:
- Starts the Hono backend server
- Starts the Expo development server
- Enables hot reloading for both

### Expected Output

**Terminal 1 (Server):**
```
Server running at http://localhost:3000
Database connected successfully
```

**Terminal 2 (Mobile):**
```
Starting Metro Bundler
Waiting on http://localhost:8081
Expo is ready

› Scan the QR code with Expo Go
› Press 'a' to open Android
› Press 'i' to open iOS
› Press 'r' to reload
› Press 'm' to toggle menu
› Press 'd' to show developer tools
```

## Option 2: Start Services Individually

### Start Backend Server Only

```bash
bun run dev:server
```

**Expected Output:**
```
Server running at http://localhost:3000
Database connected successfully
API Documentation: http://localhost:3000/api-reference
Health Check: http://localhost:3000/
```

**Verify Server is Running:**
```bash
# Health check
curl http://localhost:3000/

# Expected: {"status":"ok"}
```

### Start Mobile App Only

```bash
bun run dev:native
```

**Expected Output:**
```
Starting project at /path/to/simple-commerce/apps/native
Starting Metro Bundler

› Scan the QR code above with Expo Go
...
```

## Step-by-Step: Running the Full Stack

### Step 1: Start Database (if not running)

```bash
bun run db:start
```

### Step 2: Verify Environment

```bash
# Check server env
cat apps/server/.env | grep DATABASE_URL

# Check native env
cat apps/native/.env | grep EXPO_PUBLIC_API_URL
```

### Step 3: Start Development Server

```bash
bun run dev
```

### Step 4: Open on Mobile Device

**Physical Device:**
1. Ensure phone and computer are on same WiFi network
2. Open **Expo Go** app on your phone
3. Scan the QR code displayed in terminal
4. Wait for app to load

**iOS Simulator (macOS only):**
1. Press `i` in terminal
2. Or run: `bun run ios`

**Android Emulator:**
1. Start Android emulator first
2. Press `a` in terminal
3. Or run: `bun run android`

## Troubleshooting

### Issue: Cannot Connect to Server from Mobile

**Problem:** Mobile app shows "Network request failed"

**Solutions:**

1. **Check IP Address:**
   ```bash
   # Get your local IP
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Update .env
   # EXPO_PUBLIC_API_URL="http://YOUR_IP:3000"
   ```

2. **Check Firewall:**
   ```bash
   # macOS: Allow connections
   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add bun
   
   # Linux: Check ufw
   sudo ufw allow 3000
   sudo ufw allow 8081
   ```

3. **Check Server is Running:**
   ```bash
   curl http://YOUR_IP:3000/
   # Should return: {"status":"ok"}
   ```

### Issue: Metro Bundler Won't Start

**Problem:** Port 8081 already in use

**Solution:**
```bash
# Find and kill process
lsof -i :8081
kill -9 <PID>

# Or use different port
bun run dev --port 8082
```

### Issue: Database Connection Failed

**Problem:** Server cannot connect to database

**Solutions:**

1. **Check Docker:**
   ```bash
   docker ps
   # Should show postgres container
   ```

2. **Check Environment:**
   ```bash
   cat apps/server/.env | grep DATABASE_URL
   ```

3. **Restart Database:**
   ```bash
   bun run db:stop
   bun run db:start
   ```

### Issue: App Loads But Shows White Screen

**Problem:** JavaScript bundle error

**Solutions:**

1. **Clear Metro Cache:**
   ```bash
   cd apps/native
   bun run dev --clear
   ```

2. **Reset Cache:**
   ```bash
   # Press 'c' in terminal
   # Or
   bun run start --reset-cache
   ```

3. **Check for Errors:**
   - Look in terminal for red error messages
   - Check Metro logs
   - Review Flipper/React Native Debugger

### Issue: QR Code Not Visible

**Problem:** Cannot see QR code in terminal

**Solutions:**

1. **Make terminal wider:** Resize terminal window
2. **Check logs:** QR code might be above visible area
3. **Use direct URL:** Connect via URL instead
   ```
   exp://YOUR_IP:8081
   ```

## Development Workflow

### Hot Reloading

Both server and mobile app support hot reloading:

**Backend:**
- Changes to `apps/server/src/` auto-reload
- Database connections persist

**Mobile:**
- Changes to `apps/native/` auto-reload
- State is preserved (with Fast Refresh)

### Common Commands During Development

| Key | Action |
|-----|--------|
| `r` | Reload app |
| `m` | Toggle performance monitor |
| `d` | Open developer menu |
| `i` | Open iOS simulator |
| `a` | Open Android emulator |
| `j` | Open debugger |
| `c` | Clear Metro bundler cache |
| `q` | Quit development server |

### Logs and Debugging

**Server Logs:**
```bash
# Server logs appear in terminal
# Add console.log() statements for debugging
```

**Mobile Logs:**
```bash
# View logs
bun run logs

# Or use React Native Debugger
# Or Flipper (built into React Native)
```

**Flipper:**
- Download from [fbflipper.com](https://fbflipper.com/)
- Automatically connects to running app
- View network requests, logs, state

## Testing the Application

### Test Authentication

1. Open app on mobile device
2. Tap "Sign Up"
3. Create account with email/password
4. Verify email (if Resend configured)
5. Sign in

### Test Product Browsing

1. Browse categories on home screen
2. Tap a product
3. View product details
4. Add to cart

### Test Checkout Flow

1. Go to cart
2. Tap "Checkout"
3. Add address (if none exists)
4. Select shipping
5. Complete payment (use Midtrans sandbox)

## Stopping the Application

### Stop All Services

Press `Ctrl+C` in each terminal window, or:

```bash
# Kill all bun processes
pkill -f bun

# Or more specifically
pkill -f "expo start"
pkill -f "bun run src/index.ts"
```

### Stop Database

```bash
bun run db:stop
```

## Performance Tips

### Speed Up Development

1. **Use physical device** (faster than simulator)
2. **Disable animations** during testing
3. **Use production build** for final testing

### Reduce Bundle Size

```bash
# Analyze bundle
bun run bundle:analyze
```

## Next Steps

- **Mobile Development:** [Mobile App Setup](./06-mobile-app-setup.md)
- **API Testing:** Test endpoints at `http://localhost:3000/api-reference`
- **Database:** Explore data in Drizzle Studio (`bun run db:studio`)
- **Development:** Read [Development Workflow](../09-development/01-available-scripts.md)

## Quick Reference

| Task | Command |
|------|---------|
| Start all | `bun run dev` |
| Start server only | `bun run dev:server` |
| Start mobile only | `bun run dev:native` |
| Clear cache | `bun run dev --clear` |
| View logs | `bun run logs` |
| Stop all | `Ctrl+C` or `pkill -f bun` |
