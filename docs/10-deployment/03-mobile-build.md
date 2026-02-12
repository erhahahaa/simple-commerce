# Mobile Build

Building the mobile app for production.

## Prerequisites

- Expo account
- EAS CLI installed
- App stores accounts (for store submission)

## EAS Build Setup

### Install EAS CLI

```bash
npm install -g eas-cli
```

### Login

```bash
eas login
```

### Configure Project

```bash
cd apps/native
eas init
```

## Build Commands

### iOS Build

```bash
# Development build
eas build --platform ios --profile development

# Production build
eas build --platform ios --profile production
```

### Android Build

```bash
# Development build
eas build --platform android --profile development

# Production build
eas build --platform android --profile production
```

## Local Build

### iOS (macOS only)

```bash
cd apps/native
expo run:ios --configuration Release
```

### Android

```bash
cd apps/native
expo run:android --variant release
```

## Configuration

### eas.json

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "production": {
      "distribution": "store"
    }
  }
}
```

## Environment Variables

Update production API URL:

```env
EXPO_PUBLIC_API_URL="https://api.yourdomain.com"
```

## App Store Submission

### iOS

1. Build with EAS
2. Download IPA
3. Upload to App Store Connect
4. Submit for review

### Android

1. Build with EAS
2. Download APK/AAB
3. Upload to Google Play Console
4. Submit for review
