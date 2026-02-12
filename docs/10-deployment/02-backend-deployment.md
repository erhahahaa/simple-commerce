# Backend Deployment

Deploying the Hono backend server.

## Build for Production

```bash
cd apps/server
bun run build
```

## Docker Deployment

### Dockerfile Example

```dockerfile
FROM oven/bun:1.3.5

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --production

COPY . .
RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  api:
    build: ./apps/server
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## VPS Deployment

1. Set up server (Ubuntu 22.04 recommended)
2. Install Bun
3. Clone repository
4. Install dependencies
5. Set environment variables
6. Start with PM2 or systemd

### PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'simple-commerce-api',
    script: './apps/server/dist/index.mjs',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

## Environment Variables

Create `.env` on server:

```env
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="https://api.yourdomain.com"
CORS_ORIGIN="https://yourdomain.com"
MIDTRANS_IS_PRODUCTION="true"
```
