# Troubleshooting

Common issues and solutions.

## Installation Issues

### Bun not found

**Solution:**
```bash
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc  # or ~/.zshrc
```

### Dependencies fail to install

**Solution:**
```bash
rm -rf node_modules bun.lock
bun install
```

## Database Issues

### Port 5432 in use

**Solution:**
```bash
lsof -i :5432
kill -9 <PID>
```

### Cannot connect to database

**Check:**
1. Docker is running
2. Container is up: `docker ps`
3. Environment variables correct

## Mobile App Issues

### Cannot connect to server

**Check:**
1. Use IP address, not localhost
2. Same WiFi network
3. Firewall settings
4. Server is running

### Metro bundler errors

**Solution:**
```bash
cd apps/native
bun run dev --clear
```

## API Issues

### ORPC type errors

**Solution:**
```bash
bun run check-types
# Fix type errors
```

### Environment variables not loading

**Check:**
1. `.env` file exists
2. Variables spelled correctly
3. Server restarted after changes

## Performance Issues

### Slow queries

**Check:**
1. Database indexes
2. Query optimization
3. Connection pooling

### Large bundle size

**Solution:**
```bash
cd apps/native
bun run bundle:analyze
```

## Getting Help

1. Check this troubleshooting guide
2. Review documentation
3. Search existing issues
4. Ask in team chat
