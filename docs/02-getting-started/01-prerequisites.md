# Prerequisites

Required software and accounts before setting up Simple Commerce.

## Required Software

### 1. Bun Runtime

Simple Commerce uses Bun as its JavaScript runtime and package manager.

**Version Required:** 1.3.5 or higher

**Installation:**

**macOS/Linux:**
```bash
curl -fsSL https://bun.sh/install | bash
```

**Windows:**
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

**Verify Installation:**
```bash
bun --version
# Should show: 1.3.5 or higher
```

**Learn More:** [Bun Documentation](https://bun.sh/docs)

### 2. Docker

Docker is required for running PostgreSQL database locally.

**Version Required:** Docker 20.10+ or Docker Desktop 4.0+

**Installation:**

**macOS:**
- Download [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
- Or use Homebrew: `brew install --cask docker`

**Windows:**
- Download [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
- Requires Windows 10/11 Pro or Enterprise (WSL2 enabled)

**Linux:**
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Or use package manager
sudo apt-get install docker.io docker-compose
```

**Verify Installation:**
```bash
docker --version
docker-compose --version
```

**Learn More:** [Docker Documentation](https://docs.docker.com/)

### 3. Git

Git is required for version control.

**Version Required:** 2.30 or higher

**Installation:**

**macOS:**
```bash
# Via Homebrew
brew install git

# Or install Xcode Command Line Tools
xcode-select --install
```

**Windows:**
- Download from [git-scm.com](https://git-scm.com/download/win)
- Or use Git for Windows

**Linux:**
```bash
sudo apt-get install git
```

**Verify Installation:**
```bash
git --version
```

### 4. Code Editor

**Recommended:** Visual Studio Code

**Required Extensions:**
- **Biome** - Linting and formatting
- **TypeScript and JavaScript** - Language support
- **Tailwind CSS IntelliSense** - CSS support
- **ESLint** - JavaScript/TypeScript linting

**Installation:**
- Download from [code.visualstudio.com](https://code.visualstudio.com/)

**Recommended Settings:**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "biomejs.biome",
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.codeActionsOnSave": {
    "source.organizeImports.biome": "explicit"
  }
}
```

## Mobile Development Requirements

### For Physical Device Testing

**Required:**
- iOS device (iPhone/iPad) with iOS 13+ OR
- Android device with Android 8.0+ (API level 26+)

**Required App:**
- **Expo Go** - Download from App Store or Google Play Store

### For iOS Simulator (macOS only)

**Required:**
- macOS 11.0 (Big Sur) or later
- Xcode 13.0 or later
- iOS Simulator

**Installation:**
```bash
# Install Xcode from App Store
# Or use xcode-select
xcode-select --install
```

### For Android Emulator

**Required:**
- Android Studio
- Android SDK
- Android Virtual Device (AVD)

**Installation:**
1. Download [Android Studio](https://developer.android.com/studio)
2. Install SDK and emulator during setup
3. Create an AVD (Android Virtual Device)

## Optional Software

### Recommended Tools

| Tool | Purpose | Installation |
|------|---------|--------------|
| **Postman** | API testing | [Download](https://www.postman.com/downloads/) |
| **TablePlus** | Database GUI | [Download](https://tableplus.com/) |
| **DBeaver** | Database GUI (free) | [Download](https://dbeaver.io/) |
| **React Native Debugger** | Mobile debugging | [Download](https://github.com/jhen0409/react-native-debugger) |
| **Flipper** | Mobile debugging | Included with React Native |

## Required Accounts

### 1. Midtrans (Required for Payments)

**Purpose:** Process payments

**Setup:**
1. Register at [midtrans.com](https://midtrans.com)
2. Access Sandbox environment
3. Get Server Key and Client Key

**Free Tier:** Yes (Sandbox)

### 2. Raja Ongkir (Required for Shipping)

**Purpose:** Calculate shipping costs

**Setup:**
1. Register at [rajaongkir.com](https://rajaongkir.com)
2. Get API Key (Starter plan is free)
3. Note API endpoint URL

**Free Tier:** Yes (Starter - 3 couriers)

### 3. Google Cloud (Optional - for OAuth)

**Purpose:** Google OAuth authentication

**Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Get Client ID and Client Secret

**Free Tier:** Yes (up to certain limits)

### 4. Resend (Optional - for Emails)

**Purpose:** Send transactional emails

**Setup:**
1. Register at [resend.com](https://resend.com)
2. Get API Key
3. Verify sender domain (production)

**Free Tier:** Yes (100 emails/day)

## System Requirements

### Minimum Requirements

| Component | Requirement |
|-----------|-------------|
| **OS** | macOS 11+, Windows 10+, or Linux |
| **RAM** | 8 GB |
| **Storage** | 10 GB free space |
| **CPU** | Dual-core processor |
| **Network** | Stable internet connection |

### Recommended Requirements

| Component | Recommendation |
|-----------|----------------|
| **OS** | macOS 13+, Windows 11, or Ubuntu 22.04 |
| **RAM** | 16 GB |
| **Storage** | 20 GB SSD |
| **CPU** | Quad-core processor |
| **Network** | Broadband connection |

## Network Requirements

### Ports Used

| Port | Service | Description |
|------|---------|-------------|
| 3000 | Backend API | Hono server |
| 5432 | PostgreSQL | Database |
| 8081 | Metro Bundler | React Native bundler |
| 19000 | Expo | Expo development server |
| 19001 | Expo | Expo LAN URL |
| 19002 | Expo | Expo DevTools |

### Firewall Configuration

Ensure these ports are available:
```bash
# Check if port is in use
lsof -i :3000

# Kill process using port (if needed)
kill -9 <PID>
```

## Verification Checklist

Before proceeding to installation, verify:

- [ ] Bun installed (version 1.3.5+)
- [ ] Docker installed and running
- [ ] Git installed
- [ ] Code editor installed with extensions
- [ ] Expo Go installed on mobile device (if using physical device)
- [ ] Midtrans account created
- [ ] Raja Ongkir account created
- [ ] At least 10 GB free disk space
- [ ] Internet connection available

## Troubleshooting

### Bun Installation Issues

**Problem:** Permission denied
```bash
# Solution: Add to PATH
export PATH="$HOME/.bun/bin:$PATH"
```

**Problem:** Command not found after installation
```bash
# Solution: Reload shell configuration
source ~/.bashrc
# or
source ~/.zshrc
```

### Docker Issues

**Problem:** Docker daemon not running
```bash
# macOS/Windows
# Start Docker Desktop application

# Linux
sudo systemctl start docker
```

**Problem:** Permission denied (Linux)
```bash
# Solution: Add user to docker group
sudo usermod -aG docker $USER
# Log out and back in
```

### Port Conflicts

**Problem:** Port already in use
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

## Next Steps

Once all prerequisites are met:

1. Proceed to [Installation](./02-installation.md)
2. Set up [Environment Variables](./03-environment-setup.md)
3. Configure the [Database](./04-database-setup.md)

## Getting Help

If you encounter issues:

1. Check [Troubleshooting](../09-development/05-troubleshooting.md)
2. Review tool-specific documentation
3. Search existing issues
4. Ask in team chat
