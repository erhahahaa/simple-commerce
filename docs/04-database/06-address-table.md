# Address Table

User shipping addresses.

## Schema

```typescript
{
  id: string (uuid, primary key)
  userId: string (foreign key → user.id)
  label: string
  recipientName: string
  phone: string
  province: string
  city: string
  district: string
  postalCode: string
  address: string
  isDefault: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Fields

| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| userId | uuid | User reference |
| label | string | Address label (Home, Office) |
| recipientName | string | Recipient name |
| phone | string | Contact phone |
| province | string | Province name |
| city | string | City name |
| district | string | District/kecamatan |
| postalCode | string | Postal code |
| address | string | Full address details |
| isDefault | boolean | Default shipping address |
| createdAt | timestamp | Creation time |
| updatedAt | timestamp | Last update time |

## Relations

- Many-to-One: user
- One-to-Many: orders

## Indexes

- userId - For user address queries
- isDefault - For default address lookup
