# Navigation Structure

Mobile app navigation using Expo Router.

## Navigation Types

### Tab Navigation

Bottom tab bar for main sections.

**Tabs:**
- Home (index)
- Products
- Cart (with badge)
- Orders
- Profile

### Stack Navigation

Screen stacks for detail views.

**Stacks:**
- Product detail
- Checkout flow
- Order detail
- Address management

### Modal Navigation

Authentication screens.

**Screens:**
- Sign In
- Sign Up

## Route Structure

```
app/
├── _layout.tsx           # Root layout
├── (auth)/               # Auth group (modal)
├── (app)/                # Main app
│   ├── (tabs)/           # Tab navigation
│   ├── product/          # Product detail stack
│   ├── checkout/         # Checkout stack
│   └── order/            # Order detail stack
```

## Deep Linking

URL scheme: `simplecommerce://`

**Routes:**
- `simplecommerce://app/reset-password`
- `simplecommerce://app/verify-email`
