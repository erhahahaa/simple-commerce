# Shipping Router

API endpoints for shipping calculations.

## Procedures

### getProvinces

Get list of provinces.

**Access:** Protected

**Input:** None

**Output:** Array of provinces with id and name.

### getCities

Get cities by province.

**Access:** Protected

**Input:** `{ provinceId: string }`

### calculate

Calculate shipping costs.

**Access:** Protected

**Input:**
```typescript
{
  origin: string        // Origin city ID
  destination: string   // Destination city ID
  weight: number        // Weight in grams
  courier: "jne" | "tiki" | "pos"
}
```

**Output:**
```typescript
{
  courier: string
  service: string
  description: string
  cost: number
  etd: string  // Estimated time of delivery
}[]
```
