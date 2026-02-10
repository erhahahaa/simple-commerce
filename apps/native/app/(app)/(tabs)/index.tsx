import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useToast } from "heroui-native";
import { useCallback, useState } from "react";
import { RefreshControl, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { FadeInDown, FadeInRight, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientBackground } from "@/components/gradient-background";
import { Skeleton } from "@/components/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import {
	AnimatedPressable,
	AnimatedView,
	StyledPressable,
	StyledText,
	StyledView,
} from "@/components/uniwind";
import { formatCurrency } from "@/config";
import { useAppTheme } from "@/contexts/app-theme-context";
import { useGetSession } from "@/hooks/auth";
import { useCartCount } from "@/hooks/cart";
import { useUserStats } from "@/hooks/user";

type QuickActionProps = {
	icon: keyof typeof Ionicons.glyphMap;
	label: string;
	color: string;
	onPress?: () => void;
};

function QuickAction({ icon, label, color, onPress }: QuickActionProps) {
	const { isLight } = useAppTheme();

	return (
		<AnimatedPressable
			entering={FadeInUp.duration(200)}
			className="flex-1 items-center rounded-2xl p-4"
			style={{
				backgroundColor: isLight
					? "rgba(255,255,255,0.9)"
					: "rgba(30,30,45,0.9)",
			}}
			onPress={onPress}
		>
			<StyledView
				className="mb-2 h-12 w-12 items-center justify-center rounded-full"
				style={{ backgroundColor: color }}
			>
				<Ionicons name={icon} size={24} color="white" />
			</StyledView>
			<StyledText className="text-center font-medium text-foreground text-xs">
				{label}
			</StyledText>
		</AnimatedPressable>
	);
}

type StatCardProps = {
	icon: keyof typeof Ionicons.glyphMap;
	value: string;
	label: string;
	trend?: string;
	trendUp?: boolean;
};

function StatCard({ icon, value, label, trend, trendUp }: StatCardProps) {
	const { isLight } = useAppTheme();

	return (
		<AnimatedView
			entering={FadeInRight.duration(200)}
			className="flex-1 rounded-2xl p-4"
			style={{
				backgroundColor: isLight
					? "rgba(255,255,255,0.9)"
					: "rgba(30,30,45,0.9)",
			}}
		>
			<StyledView className="mb-2 flex-row items-center justify-between">
				<Ionicons
					name={icon}
					size={20}
					color={isLight ? "#667eea" : "#a855f7"}
				/>
				{trend && (
					<StyledView
						className={`flex-row items-center rounded-full px-2 py-0.5 ${
							trendUp ? "bg-green-100" : "bg-red-100"
						}`}
					>
						<Ionicons
							name={trendUp ? "arrow-up" : "arrow-down"}
							size={10}
							color={trendUp ? "#22c55e" : "#ef4444"}
						/>
						<StyledText
							className={`ml-0.5 text-xs ${
								trendUp ? "text-green-600" : "text-red-600"
							}`}
						>
							{trend}
						</StyledText>
					</StyledView>
				)}
			</StyledView>
			<StyledText className="font-bold text-2xl text-foreground">
				{value}
			</StyledText>
			<StyledText className="mt-1 text-muted text-xs">{label}</StyledText>
		</AnimatedView>
	);
}

function StatCardSkeleton() {
	const { isLight } = useAppTheme();

	return (
		<AnimatedView
			entering={FadeInRight.duration(200)}
			className="flex-1 rounded-2xl p-4"
			style={{
				backgroundColor: isLight
					? "rgba(255,255,255,0.9)"
					: "rgba(30,30,45,0.9)",
			}}
		>
			<Skeleton width={20} height={20} borderRadius={10} />
			<Skeleton width="60%" height={28} className="mt-2" />
			<Skeleton width="40%" height={12} className="mt-2" />
		</AnimatedView>
	);
}

type FeatureCardProps = {
	icon: keyof typeof Ionicons.glyphMap;
	title: string;
	description: string;
	gradient: readonly [string, string];
	onPress?: () => void;
};

function FeatureCard({
	icon,
	title,
	description,
	gradient,
	onPress,
}: FeatureCardProps) {
	return (
		<AnimatedPressable
			entering={FadeInUp.duration(200)}
			className="overflow-hidden rounded-2xl"
			onPress={onPress}
		>
			<LinearGradient
				colors={gradient}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={styles.featureCard}
			>
				<StyledView className="flex-row items-center">
					<StyledView className="h-12 w-12 items-center justify-center rounded-xl bg-white/20">
						<Ionicons name={icon} size={24} color="white" />
					</StyledView>
					<StyledView className="ml-4 flex-1">
						<StyledText className="font-bold text-lg text-white">
							{title}
						</StyledText>
						<StyledText className="mt-0.5 text-sm text-white/80">
							{description}
						</StyledText>
					</StyledView>
					<Ionicons
						name="chevron-forward"
						size={20}
						color="rgba(255,255,255,0.6)"
					/>
				</StyledView>
			</LinearGradient>
		</AnimatedPressable>
	);
}

export default function HomeScreen() {
	const insets = useSafeAreaInsets();
	const { toast } = useToast();
	const { data: session } = useGetSession();
	const { isLight } = useAppTheme();
	const {
		data: userStats,
		isLoading: statsLoading,
		refetch: refetchStats,
	} = useUserStats();
	const {
		data: cartCount,
		// isLoading: cartLoading,
		refetch: refetchCart,
	} = useCartCount();
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await Promise.all([refetchStats(), refetchCart()]);
		setRefreshing(false);
	}, [refetchStats, refetchCart]);

	const user = session?.success ? session.data.user : null;
	const firstName = user?.name?.split(" ")[0] || "there";

	return (
		<GradientBackground variant="app">
			<KeyboardAwareScrollView
				contentContainerStyle={{
					paddingTop: insets.top + 10,
					paddingBottom: insets.bottom + 20,
					paddingHorizontal: 20,
				}}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
				bottomOffset={20}
			>
				{/* Header */}
				<AnimatedView
					entering={FadeInDown.duration(200)}
					className="mb-6 flex-row items-center justify-between"
				>
					<StyledView>
						<StyledText className="text-muted text-sm">Welcome back</StyledText>
						<StyledText className="font-bold text-2xl text-foreground">
							{firstName}!
						</StyledText>
					</StyledView>
					<StyledView className="flex-row items-center gap-2">
						<ThemeToggle />
						{/* NOTE: planned but not in requirements */}
						{/* <StyledPressable
							className="h-12 w-12 items-center justify-center rounded-full"
							style={{
								backgroundColor: isLight
									? "rgba(255,255,255,0.9)"
									: "rgba(30,30,45,0.9)",
							}}
							onPress={() => {
								toast.show({
									variant: "default",
									label: "Coming Soon",
									description: "Notifications will be available soon",
								});
							}}
						>
							<Ionicons
								name="notifications-outline"
								size={22}
								color={isLight ? "#1a1a2e" : "#ffffff"}
							/>
							<StyledView className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500" />
						</StyledPressable> */}
						<StyledPressable
							className="h-12 w-12 items-center justify-center overflow-hidden rounded-full"
							style={{
								backgroundColor: isLight
									? "rgba(255,255,255,0.9)"
									: "rgba(30,30,45,0.9)",
							}}
							onPress={() => router.push("/(app)/(tabs)/profile")}
						>
							<LinearGradient
								colors={["#667eea", "#764ba2"]}
								style={StyleSheet.absoluteFill}
							/>
							<StyledText className="font-bold text-lg text-white">
								{user?.name?.charAt(0).toUpperCase() || "U"}
							</StyledText>
						</StyledPressable>
					</StyledView>
				</AnimatedView>

				{/* Stats Row */}
				<StyledView className="mb-6 flex-row gap-3">
					{statsLoading ? (
						<>
							<StatCardSkeleton />
							<StatCardSkeleton />
						</>
					) : (
						<>
							<StatCard
								icon="wallet-outline"
								value={formatCurrency(userStats?.totalSpent ?? 0)}
								label="Total Spent"
							/>
							<StatCard
								icon="bag-outline"
								value={String(userStats?.totalOrders ?? 0)}
								label="Orders"
							/>
						</>
					)}
				</StyledView>

				{/* Quick Actions */}
				<AnimatedView entering={FadeInDown.duration(200)} className="mb-6">
					<StyledText className="mb-3 font-bold text-foreground text-lg">
						Quick Actions
					</StyledText>
					<StyledView className="flex-row gap-3">
						<QuickAction
							icon="search-outline"
							label="Search"
							color="#667eea"
							onPress={() => router.push("/(app)/(tabs)/products")}
						/>
						<QuickAction
							icon="cart-outline"
							label={`Cart${(cartCount?.count ?? 0) > 0 ? ` (${cartCount?.count})` : ""}`}
							color="#f59e0b"
							onPress={() => router.push("/(app)/(tabs)/cart")}
						/>
						<QuickAction
							icon="heart-outline"
							label={`Wishlist${(userStats?.wishlistCount ?? 0) > 0 ? ` (${userStats?.wishlistCount})` : ""}`}
							color="#ef4444"
							onPress={() => router.push("/(app)/wishlist")}
						/>
						<QuickAction
							icon="receipt-outline"
							label={`Orders${(userStats?.pendingOrders ?? 0) > 0 ? ` (${userStats?.pendingOrders})` : ""}`}
							color="#22c55e"
							onPress={() => router.push("/(app)/(tabs)/orders")}
						/>
					</StyledView>
				</AnimatedView>

				{/* Feature Cards */}
				<AnimatedView entering={FadeInDown.duration(200)} className="mb-4">
					<StyledText className="mb-3 font-bold text-foreground text-lg">
						Explore
					</StyledText>
				</AnimatedView>

				<StyledView className="mb-6 gap-3">
					<FeatureCard
						icon="flash"
						title="Flash Sale"
						description="Up to 50% off on selected items"
						gradient={["#f59e0b", "#ef4444"]}
						onPress={() => router.push("/(app)/(tabs)/products")}
					/>
					<FeatureCard
						icon="gift"
						title="Rewards"
						description="Earn points with every purchase"
						gradient={["#22c55e", "#10b981"]}
						onPress={() => router.push("/(app)/(tabs)/orders")}
					/>
					<FeatureCard
						icon="star"
						title="New Arrivals"
						description="Check out the latest products"
						gradient={["#667eea", "#764ba2"]}
						onPress={() => router.push("/(app)/(tabs)/products")}
					/>
				</StyledView>
			</KeyboardAwareScrollView>
		</GradientBackground>
	);
}

const styles = StyleSheet.create({
	featureCard: {
		padding: 16,
	},
});
