# Profile Screens

User profile and settings.

## Files

- `apps/native/app/(app)/(tabs)/profile.tsx` - Main profile
- `apps/native/app/(app)/profile/addresses.tsx` - Addresses

## Features

### Profile Tab

- User info display
- Order history quick link
- Saved addresses
- Logout button

### Addresses Screen

- List saved addresses
- Add new address
- Edit address
- Set default
- Delete address

## Data Fetching

```typescript
// Get user info
const { data: session } = useSession();

// Get addresses
const { data: addresses } = useQuery({
  queryKey: ["addresses"],
  queryFn: () => api.address.list.query(),
});
```

## Components

- Profile header
- Menu items
- Address cards
- Empty states
