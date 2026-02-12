# Address Router

API endpoints for user addresses.

## Procedures

### list

Get user's addresses.

**Access:** Protected

**Input:** None

### getById

Get address by ID.

**Access:** Protected

**Input:** `{ id: string }`

### create

Create new address.

**Access:** Protected

**Input:**
```typescript
{
  label: string
  recipientName: string
  phone: string
  province: string
  city: string
  district: string
  postalCode: string
  address: string
  isDefault?: boolean
}
```

### update

Update address.

**Access:** Protected

**Input:** Address fields with id

### delete

Delete address.

**Access:** Protected

**Input:** `{ id: string }`

### setDefault

Set address as default.

**Access:** Protected

**Input:** `{ id: string }`
