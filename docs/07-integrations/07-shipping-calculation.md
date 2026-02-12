# Shipping Calculation

How shipping costs are calculated.

## Process

1. Get origin city ID (store location)
2. Get destination city ID (from address)
3. Calculate weight (from cart items)
4. Call Raja Ongkir API
5. Return shipping options

## API Endpoint

```typescript
api.shipping.calculate.mutate({
  origin: "152",      // Jakarta Selatan
  destination: "456", // Destination city
  weight: 1000,       // Weight in grams
  courier: "jne"
});
```

## Response

```typescript
[
  {
    service: "REG",
    description: "Layanan Reguler",
    cost: 15000,
    etd: "2-3"
  }
]
```

## Store Configuration

Set store origin city:
```env
STORE_CITY_ID=152  // Jakarta Selatan
```
