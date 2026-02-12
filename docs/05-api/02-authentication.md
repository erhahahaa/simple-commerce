# Authentication

Better Auth integration for user authentication.

## Overview

Authentication is handled by Better Auth, not ORPC routers.

## Endpoints

Better Auth provides these endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/sign-in/email | Email/password login |
| POST | /api/auth/sign-up/email | Email registration |
| POST | /api/auth/sign-out | Logout |
| POST | /api/auth/callback/google | Google OAuth callback |
| POST | /api/auth/verify-email | Email verification |
| POST | /api/auth/reset-password | Password reset |

## Session Management

Sessions are stored in the database and managed via cookies.

## Protected Procedures

To protect an ORPC procedure:

```typescript
export const protectedProcedure = os
  .use(async ({ next }) => {
    const context = await createContext();
    if (!context.session) {
      throw new Error("Unauthorized");
    }
    return next({ context });
  });
```
