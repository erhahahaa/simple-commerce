# Raja Ongkir Setup

Setting up Raja Ongkir account.

## Account Registration

1. Go to rajaongkir.com
2. Click "Daftar" (Register)
3. Fill registration form
4. Verify email

## API Key

1. Login to dashboard
2. Copy API Key

## Starter Plan

Free tier includes:
- 3 couriers (JNE, TIKI, POS)
- Limited API calls per day
- Basic features

## Environment Variables

```env
RAJA_ONGKIR_API_KEY=your_api_key
RAJA_ONGKIR_BASE_URL=https://api.rajaongkir.com/starter
```

## Testing

Test API connection:
```bash
curl -X GET \
  https://api.rajaongkir.com/starter/province \
  -H "key: YOUR_API_KEY"
```
