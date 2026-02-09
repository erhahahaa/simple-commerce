import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/contexts/app-theme-context";
import { useCartCount } from "@/hooks/cart";

function CartIcon({ color, size }: { color: string; size: number }) {
	const { data: cartCount } = useCartCount();
	const count = cartCount?.count ?? 0;

	return (
		<View>
			<Ionicons name="cart-outline" size={size} color={color} />
			{count > 0 && (
				<View style={styles.badge}>
					<Text style={styles.badgeText}>{count > 99 ? "99+" : count}</Text>
				</View>
			)}
		</View>
	);
}

export default function TabsLayout() {
	const { isLight } = useAppTheme();

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				lazy: true,
				tabBarActiveTintColor: isLight ? "#667eea" : "#a855f7",
				tabBarInactiveTintColor: isLight ? "#9ca3af" : "#6b7280",
				tabBarStyle: {
					backgroundColor: isLight
						? "rgba(255,255,255,0.95)"
						: "rgba(30,30,45,0.95)",
					borderTopColor: isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
					position: "absolute",
					elevation: 0,
					paddingTop: 8,
					paddingBottom: 8,
					height: 70,
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
						<CartIcon color={color} size={size} />
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

const styles = StyleSheet.create({
	badge: {
		position: "absolute",
		top: -4,
		right: -8,
		backgroundColor: "#ef4444",
		borderRadius: 10,
		minWidth: 18,
		height: 18,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 4,
	},
	badgeText: {
		color: "white",
		fontSize: 10,
		fontWeight: "bold",
	},
});
