# Native Environment Variables

Variables for mobile app.

## Required Variables

```env
# API URL
EXPO_PUBLIC_API_URL="http://YOUR_LOCAL_IP:3000"

# Midtrans Client Key
EXPO_PUBLIC_MIDTRANS_CLIENT_KEY="SB-Mid-client-xxx"
```

## Finding Your IP

**macOS:**
```bash
ipconfig getifaddr en0
```

**Linux:**
```bash
hostname -I
```

**Windows:**
```cmd
ipconfig
```

## Example

```env
EXPO_PUBLIC_API_URL="http://192.168.1.5:3000"
EXPO_PUBLIC_MIDTRANS_CLIENT_KEY="SB-Mid-client-abc123"
```

## Important

- Use your computer's local IP, not localhost
- Must be on same WiFi network as mobile device
