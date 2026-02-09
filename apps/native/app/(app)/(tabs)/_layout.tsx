import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useAppTheme } from "@/contexts/app-theme-context";

export default function TabsLayout() {
	const { isLight } = useAppTheme();

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: isLight ? "#667eea" : "#a855f7",
				tabBarInactiveTintColor: isLight ? "#9ca3af" : "#6b7280",
				tabBarStyle: {
					backgroundColor: isLight
						? "rgba(255,255,255,0.95)"
						: "rgba(30,30,45,0.95)",
					borderTopColor: isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
					position: "absolute",
					elevation: 0,
				},
				tabBarLabelStyle: {
					fontSize: 11,
					fontWeight: "600",
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="home-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="products"
				options={{
					title: "Products",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="grid-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="cart"
				options={{
					title: "Cart",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="cart-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="orders"
				options={{
					title: "Orders",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="receipt-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="person-outline" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
