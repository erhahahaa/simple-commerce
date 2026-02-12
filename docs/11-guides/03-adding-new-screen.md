# Adding a New Screen

Guide for adding new mobile screens.

## Step 1: Create Screen File

File: `apps/native/app/(app)/new-screen.tsx`

```typescript
import { View, Text } from "react-native";

export default function NewScreen() {
  return (
    <View className="flex-1 p-4">
      <Text className="text-xl font-bold">New Screen</Text>
    </View>
  );
}
```

## Step 2: Add to Navigation

### Tab Navigation

Edit: `apps/native/app/(app)/(tabs)/_layout.tsx`

```typescript
<Tabs.Screen
  name="new-screen"
  options={{
    title: "New",
    tabBarIcon: ({ color }) => <Icon name="new" color={color} />,
  }}
/>
```

### Stack Navigation

Edit parent `_layout.tsx`:

```typescript
<Stack.Screen
  name="new-screen"
  options={{ title: "New Screen" }}
/>
```

## Step 3: Fetch Data

```typescript
import { useQuery } from "@tanstack/react-query";

export default function NewScreen() {
  const { data } = useQuery({
    queryKey: ["data"],
    queryFn: () => api.endpoint.query(),
  });
  
  return (
    <View>
      {data?.map(item => (
        <Text key={item.id}>{item.name}</Text>
      ))}
    </View>
  );
}
```

## Step 4: Add Navigation Link

From another screen:

```typescript
import { router } from "expo-router";

// Navigate
router.push("/new-screen");
```

## Step 5: Test

1. Run app: `bun run dev:native`
2. Navigate to new screen
3. Test all functionality
4. Check responsive design
