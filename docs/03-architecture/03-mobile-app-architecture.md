# Mobile App Architecture

Architecture of the React Native mobile application.

## Architecture Overview

```
┌────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                      │
├────────────────────────────────────────────────────────────┤
│  Screens (Expo Router)                                      │
│  ├── (tabs)/          # Tab navigation                      │
│  ├── product/         # Product detail                      │
│  ├── checkout/        # Checkout flow                       │
│  └── (auth)/          # Authentication                      │
├────────────────────────────────────────────────────────────┤
│  Components                                                 │
│  ├── UI Components     # HeroUI, custom                     │
│  └── Screen Components # Screen-specific                    │
├────────────────────────────────────────────────────────────┤
│                     STATE LAYER                             │
├────────────────────────────────────────────────────────────┤
│  TanStack Query                                             │
│  ├── Server State      # API data, caching                  │
│  └── Mutations         # Create, update, delete             │
├────────────────────────────────────────────────────────────┤
│  Contexts                                                   │
│  └── SessionContext    # Auth state                         │
├────────────────────────────────────────────────────────────┤
│                     DATA LAYER                              │
├────────────────────────────────────────────────────────────┤
│  ORPC Client                                                │
│  └── Type-safe API client                                   │
├────────────────────────────────────────────────────────────┤
│  Better Auth Client                                         │
│  └── Authentication                                         │
└────────────────────────────────────────────────────────────┘
```

## Navigation Structure

### Expo Router File-Based Routing

```
app/
├── _layout.tsx           # Root layout
├── (auth)/               # Auth group
│   ├── _layout.tsx
│   ├── sign-in.tsx
│   └── sign-up.tsx
├── (app)/                # Main app group
│   ├── _layout.tsx
│   ├── (tabs)/           # Tabs group
│   │   ├── _layout.tsx
│   │   ├── index.tsx     # Home
│   │   ├── products.tsx  # Products
│   │   ├── cart.tsx      # Cart
│   │   ├── orders.tsx    # Orders
│   │   └── profile.tsx   # Profile
│   ├── product/
│   │   └── [slug].tsx    # Product detail
│   ├── checkout/         # Checkout flow
│   └── order/
│       └── [id].tsx      # Order detail
```

### Navigation Patterns

**Tab Navigation:**
- Home, Products, Cart, Orders, Profile
- Persistent across screens
- Badge support for cart count

**Stack Navigation:**
- Product detail from products
- Checkout flow
- Order detail
- Authentication screens

## State Management

### TanStack Query

**Purpose:** Server state management

**Key Features:**
- Automatic caching
- Background refetching
- Optimistic updates
- Error handling

**Configuration:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});
```

### Usage Patterns

**Query (Fetch Data):**
```typescript
const { data, isLoading } = useQuery({
  queryKey: ["products"],
  queryFn: () => api.product.list.query(),
});
```

**Mutation (Modify Data):**
```typescript
const mutation = useMutation({
  mutationFn: api.cart.addItem.mutate,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  },
});
```

## API Client

### ORPC Integration

**Setup:**
```typescript
// utils/orpc.ts
import { createORPCClient } from "@orpc/client";

export const api = createORPCClient({
  baseUrl: process.env.EXPO_PUBLIC_API_URL,
});
```

**Type Safety:**
- Auto-generated types from backend
- Full IntelliSense support
- Compile-time type checking

## Authentication Flow

### Better Auth Integration

**Client Setup:**
```typescript
// lib/auth-client.ts
import { createAuthClient } from "@better-auth/expo";

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});
```

**Session Management:**
```typescript
// contexts/session-context.tsx
const SessionContext = createContext<SessionContextType>(null);

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  
  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = authClient.onSessionChange(setSession);
    return unsubscribe;
  }, []);
  
  return (
    <SessionContext.Provider value={{ session }}>
      {children}
    </SessionContext.Provider>
  );
}
```

## Component Architecture

### Component Types

**UI Components (Reusable):**
- HeroUI components
- Custom components in `components/`
- Presentational only

**Screen Components:**
- Specific to a screen
- May contain business logic
- Use hooks for data

**Layout Components:**
- Define screen structure
- Tab bars, headers, etc.

### Styling Approach

**Tailwind CSS (Uniwind):**
```typescript
// Using Tailwind classes
<View className="flex-1 bg-white p-4">
  <Text className="text-lg font-bold">Title</Text>
</View>
```

**HeroUI Components:**
```typescript
import { Button, Card } from "heroui-native";

<Card>
  <Button>Press me</Button>
</Card>
```

## Performance Optimizations

### 1. Image Optimization

```typescript
import { Image } from "expo-image";

<Image
  source={{ uri: product.image }}
  contentFit="cover"
  transition={200}
/>
```

### 2. List Optimization

```typescript
<FlatList
  data={products}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  maxToRenderPerBatch={10}
  windowSize={5}
/>
```

### 3. Memoization

```typescript
const MemoizedComponent = React.memo(Component);

const expensiveCalculation = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

## Error Handling

### Global Error Boundary

```typescript
// app/_layout.tsx
<ErrorBoundary fallback={<ErrorScreen />}>
  <RootLayout />
</ErrorBoundary>
```

### API Error Handling

```typescript
const { data, error, isError } = useQuery({
  queryKey: ["products"],
  queryFn: () => api.product.list.query(),
});

if (isError) {
  return <ErrorMessage message={error.message} />;
}
```

## Related Documents

- [Navigation Structure](../06-mobile-screens/01-navigation-structure.md)
- [System Overview](./01-system-overview.md)
- [Monorepo Structure](./02-monorepo-structure.md)
