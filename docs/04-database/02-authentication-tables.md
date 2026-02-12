# Authentication Tables

Tables managed by Better Auth.

## User Table

Stores user account information.

**Schema:**
```typescript
{
  id: string (uuid, primary key)
  name: string
  email: string (unique)
  emailVerified: boolean
  image: string (optional)
  phone: string (optional)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Relations:**
- One-to-Many: sessions
- One-to-Many: accounts
- One-to-One: cart
- One-to-Many: addresses
- One-to-Many: orders

## Session Table

Stores active user sessions.

**Schema:**
```typescript
{
  id: string (primary key)
  userId: string (foreign key → user.id)
  token: string
  expiresAt: timestamp
  ipAddress: string (optional)
  userAgent: string (optional)
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Account Table

Stores OAuth provider connections.

**Schema:**
```typescript
{
  id: string (primary key)
  userId: string (foreign key → user.id)
  accountId: string
  providerId: string
  accessToken: string (optional)
  refreshToken: string (optional)
  idToken: string (optional)
  accessTokenExpiresAt: timestamp (optional)
  refreshTokenExpiresAt: timestamp (optional)
  scope: string (optional)
  password: string (optional)
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Verification Table

Stores email verification tokens.

**Schema:**
```typescript
{
  id: string (primary key)
  identifier: string
  value: string
  expiresAt: timestamp
  createdAt: timestamp
  updatedAt: timestamp
}
```
