# Deployment Overview

Deploying Simple Commerce to production.

## Deployment Components

1. **Backend API** - Hono server
2. **Mobile App** - React Native builds
3. **Database** - PostgreSQL

## Deployment Options

### Backend

- VPS (DigitalOcean, Linode, AWS EC2)
- Container platforms (Docker, Kubernetes)
- Serverless (if adapted)

### Mobile

- Expo EAS Build
- Manual build with Xcode/Android Studio

### Database

- Managed PostgreSQL (AWS RDS, DigitalOcean Managed DB)
- Self-hosted with Docker

## Environment

Production requires:

```env
# Production URLs
BETTER_AUTH_URL="https://api.yourdomain.com"
CORS_ORIGIN="https://yourdomain.com"

# Production API keys
MIDTRANS_IS_PRODUCTION="true"
MIDTRANS_SERVER_KEY="Mid-server-xxx"  # Production key
MIDTRANS_CLIENT_KEY="Mid-client-xxx"  # Production key

# Verified email domain
RESEND_API_KEY="re_xxx"  # Production key
```

## Checklist

- [ ] Environment variables configured
- [ ] Database migrated
- [ ] SSL certificates
- [ ] Domain configured
- [ ] Webhook URLs updated
- [ ] Error monitoring
- [ ] Backup strategy
