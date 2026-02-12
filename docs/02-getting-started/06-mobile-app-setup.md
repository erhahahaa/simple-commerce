# Mobile App Setup

Additional setup steps specifically for mobile development.

## Overview

This guide covers mobile-specific configuration and development setup.

## Prerequisites

- Expo Go app installed on mobile device
- Mobile device and computer on same WiFi network
- Environment variables configured ([see guide](./03-environment-setup.md))

## Step 1: Install Expo Go

### iOS (iPhone/iPad)

1. Open App Store
2. Search for "Expo Go"
3. Install the app by Expo

Requirements:
- iOS 13.0 or later

### Android

1. Open Google Play Store
2. Search for "Expo Go"
3. Install the app by Expo

Requirements:
- Android 8.0 (API level 26) or later

## Step 2: Configure Network Access

### Ensure Same Network

Your mobile device and development computer must be on the same WiFi network.

Check:
```bash
# On computer
ifconfig | grep "inet " | head -1

# On mobile device
# Check WiFi settings to confirm same network
```

### Configure API URL

Update `apps/native/.env`:

```env
EXPO_PUBLIC_API_URL="http://YOUR_COMPUTER_IP:3000"
```

Find your IP:

macOS:
```bash
ipconfig getifaddr en0
# or
ipconfig getifaddr en1
```

Linux:
```bash
hostname -I
```

Windows:
```cmd
ipconfig
# Look for "IPv4 Address"
```

Example:
```env
EXPO_PUBLIC_API_URL="http://192.168.1.5:3000"
```

## Step 3: Start Development Server

```bash
bun run dev:native
```

Wait for Metro bundler to start and display QR code.

## Step 4: Connect with Expo Go

### Method 1: Scan QR Code

1. Open Expo Go app
2. Tap "Scan QR Code"
3. Point camera at QR code in terminal
4. Wait for app to load

### Method 2: Enter URL Manually

1. Open Expo Go app
2. Tap "Enter URL manually"
3. Type: `exp://YOUR_COMPUTER_IP:8081`
4. Tap "Connect"

## iOS Simulator Setup (macOS Only)

### Install Xcode

1. Open App Store
2. Search for "Xcode"
3. Install (large download ~10GB)

### Install Command Line Tools

```bash
xcode-select --install
```

### Open iOS Simulator

From terminal:
```bash
cd apps/native
bun run ios
```

Or:
1. Press `i` in development server terminal
2. Wait for simulator to open
3. App will automatically load

### iOS Simulator Tips

- Hardware keyboard: Press `Cmd+K` to toggle
- Shake gesture: Press `Cmd+Ctrl+Z`
- Screenshot: Press `Cmd+S`
- Home button: Press `Cmd+Shift+H`

## Android Emulator Setup

### Install Android Studio

1. Download from developer.android.com/studio
2. Install with default settings
3. Complete setup wizard

### Create Virtual Device

1. Open Android Studio
2. Click "More Actions" then "Virtual Device Manager"
3. Click "Create Device"
4. Select device (e.g., Pixel 6)
5. Select system image (recommend API 33)
6. Finish setup

### Open Android Emulator

From terminal:
```bash
cd apps/native
bun run android
```

Or:
1. Press `a` in development server terminal
2. Wait for emulator to open
3. App will automatically load

### Android Emulator Tips

- Hardware keyboard: Click emulator, then Extended Controls, then Settings
- Shake gesture: Press `Cmd+M` (macOS) or `Ctrl+M` (Windows/Linux)
- Screenshot: Click camera icon in toolbar
- Reload: Press `R` twice

## Mobile-Specific Configuration

### iOS Specific

Info.plist Configuration:

File: `apps/native/ios/YourApp/Info.plist`

Expo handles this automatically, but useful for ejected apps.

### Android Specific

AndroidManifest.xml:

File: `apps/native/android/app/src/main/AndroidManifest.xml`

Already configured by Expo for:
- Internet access
- Camera permissions
- Storage access

### Deep Linking Configuration

iOS URL Scheme:

Already configured in `app.json`:
```json
{
  "expo": {
    "scheme": "simplecommerce"
  }
}
```

Usage:
```
simplecommerce://app/reset-password
simplecommerce://app/verify-email
```

## Development Tips

### Fast Refresh

React Native Fast Refresh is enabled by default:
- Edit code and save
- Changes appear instantly
- State is preserved

### Shake for Dev Menu

Shake device (or use keyboard shortcut) to open developer menu:
- Reload
- Debug JS Remotely
- Show Element Inspector
- Toggle Performance Monitor

### Console Logs

View logs in terminal. Logs appear in same terminal as bun run dev:native.

Or use Flipper for better log viewing.

### Network Debugging

Use Flipper to inspect network requests:
1. Download Flipper from fbflipper.com
2. Open Flipper
3. Connect to running app
4. View Network plugin

## Testing on Physical Device

### Enable Developer Mode

iOS:
- Not required for Expo Go

Android:
1. Settings then About Phone
2. Tap "Build Number" 7 times
3. Enable Developer Options
4. Enable USB Debugging (for USB connection)

### Connect via USB (Alternative to WiFi)

Android:
```bash
# Connect device via USB
adb devices

# Should show device
# Then start app
bun run android
```

iOS:
- Connect via USB
- Trust computer on device
- Run: `bun run ios --device`

## Troubleshooting

### Issue: Could not connect to development server

Solutions:

1. Check same network:
   - Ensure phone and computer on same WiFi
   - Try different network if issues persist

2. Check firewall:
   ```bash
   # macOS
   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add node
   
   # Linux
   sudo ufw allow 8081
   sudo ufw allow 3000
   ```

3. Use tunnel mode:
   ```bash
   bun run dev:native --tunnel
   ```

### Issue: App Stuck on Downloading JavaScript bundle

Solutions:

1. Clear cache:
   ```bash
   bun run dev:native --clear
   ```

2. Check Metro bundler:
   - Ensure it is running
   - Check for errors in terminal

3. Restart everything:
   ```bash
   # Stop all
   pkill -f bun
   
   # Start fresh
   bun run dev
   ```

### Issue: Network request failed on API calls

Solutions:

1. Verify IP address:
   - Check EXPO_PUBLIC_API_URL in .env
   - Ensure it matches computer's IP

2. Test server:
   ```bash
   curl http://YOUR_IP:3000/
   ```

3. Check server is running:
   ```bash
   lsof -i :3000
   ```

### Issue: Camera/QR Scanner Not Working

Solutions:

1. Grant permissions:
   - iOS: Settings then Expo Go then Camera then Allow
   - Android: Long press app then App Info then Permissions

2. Restart Expo Go:
   - Kill app completely
   - Reopen and try again

## Build for Production (Preview)

### Create Development Build

```bash
cd apps/native

# iOS
eas build --platform ios --profile development

# Android
eas build --platform android --profile development
```

### Install Build

1. Download build from Expo dashboard
2. Install on device
3. Run without Expo Go

## Next Steps

- Test App: Browse products, add to cart, checkout
- Development: Read Development Workflow
- Troubleshooting: Check Common Issues
- API Reference: Test endpoints at http://localhost:3000/api-reference
