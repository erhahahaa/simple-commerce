import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Button, Spinner, useToast } from "heroui-native";
import { ScrollView, StyleSheet } from "react-native";
import { FadeInDown, FadeInRight, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientBackground } from "@/components/gradient-background";
import { ThemeToggle } from "@/components/theme-toggle";
import {
	AnimatedPressable,
	AnimatedView,
	StyledPressable,
	StyledText,
	StyledView,
} from "@/components/uniwind";
import { useAppTheme } from "@/contexts/app-theme-context";
import { useGetSession, useSignOut } from "@/hooks/auth";

type QuickActionProps = {
	icon: keyof typeof Ionicons.glyphMap;
	label: string;
	color: string;
	delay: number;
	onPress?: () => void;
};

function QuickAction({ icon, label, color, delay, onPress }: QuickActionProps) {
	const { isLight } = useAppTheme();

	return (
		<AnimatedPressable
			entering={FadeInUp.delay(delay).springify()}
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
	delay: number;
};

function StatCard({
	icon,
	value,
	label,
	trend,
	trendUp,
	delay,
}: StatCardProps) {
	const { isLight } = useAppTheme();

	return (
		<AnimatedView
			entering={FadeInRight.delay(delay).springify()}
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

type FeatureCardProps = {
	icon: keyof typeof Ionicons.glyphMap;
	title: string;
	description: string;
	gradient: readonly [string, string];
	delay: number;
	onPress?: () => void;
};

function FeatureCard({
	icon,
	title,
	description,
	gradient,
	delay,
	onPress,
}: FeatureCardProps) {
	return (
		<AnimatedPressable
			entering={FadeInUp.delay(delay).springify()}
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
	const signOut = useSignOut();
	const { isLight } = useAppTheme();

	const handleSignOut = async () => {
		if (signOut.isPending) return;
		const result = await signOut.mutateAsync();

		if (!result.success) {
			toast.show({
				variant: "danger",
				label: "Sign out failed",
				description: result.error,
			});
			return;
		}
		router.replace("/(auth)/sign-in");
	};

	const user = session?.success ? session.data.user : null;
	const firstName = user?.name?.split(" ")[0] || "there";

	return (
		<GradientBackground variant="app">
			<ScrollView
				contentContainerStyle={{
					paddingTop: insets.top + 10,
					paddingBottom: insets.bottom + 20,
					paddingHorizontal: 20,
				}}
				showsVerticalScrollIndicator={false}
			>
				{/* Header */}
				<AnimatedView
					entering={FadeInDown.delay(100).springify()}
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
						<StyledPressable
							className="h-12 w-12 items-center justify-center rounded-full"
							style={{
								backgroundColor: isLight
									? "rgba(255,255,255,0.9)"
									: "rgba(30,30,45,0.9)",
							}}
						>
							<Ionicons
								name="notifications-outline"
								size={22}
								color={isLight ? "#1a1a2e" : "#ffffff"}
							/>
							<StyledView className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500" />
						</StyledPressable>
						<StyledPressable
							className="h-12 w-12 items-center justify-center overflow-hidden rounded-full"
							style={{
								backgroundColor: isLight
									? "rgba(255,255,255,0.9)"
									: "rgba(30,30,45,0.9)",
							}}
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
					<StatCard
						icon="wallet-outline"
						value="$2,450"
						label="Total Spent"
						trend="12%"
						trendUp
						delay={200}
					/>
					<StatCard
						icon="bag-outline"
						value="23"
						label="Orders"
						trend="5%"
						trendUp
						delay={300}
					/>
				</StyledView>

				{/* Quick Actions */}
				<AnimatedView
					entering={FadeInDown.delay(350).springify()}
					className="mb-6"
				>
					<StyledText className="mb-3 font-bold text-foreground text-lg">
						Quick Actions
					</StyledText>
					<StyledView className="flex-row gap-3">
						<QuickAction
							icon="search-outline"
							label="Search"
							color="#667eea"
							delay={400}
						/>
						<QuickAction
							icon="cart-outline"
							label="Cart"
							color="#f59e0b"
							delay={450}
						/>
						<QuickAction
							icon="heart-outline"
							label="Wishlist"
							color="#ef4444"
							delay={500}
						/>
						<QuickAction
							icon="receipt-outline"
							label="Orders"
							color="#22c55e"
							delay={550}
						/>
					</StyledView>
				</AnimatedView>

				{/* Feature Cards */}
				<AnimatedView
					entering={FadeInDown.delay(500).springify()}
					className="mb-4"
				>
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
						delay={600}
					/>
					<FeatureCard
						icon="gift"
						title="Rewards"
						description="You have 500 points to redeem"
						gradient={["#22c55e", "#10b981"]}
						delay={700}
					/>
					<FeatureCard
						icon="star"
						title="New Arrivals"
						description="Check out the latest products"
						gradient={["#667eea", "#764ba2"]}
						delay={800}
					/>
				</StyledView>

				{/* Account Section */}
				<AnimatedView
					entering={FadeInUp.delay(900).springify()}
					className="mb-4 rounded-2xl p-4"
					style={{
						backgroundColor: isLight
							? "rgba(255,255,255,0.9)"
							: "rgba(30,30,45,0.9)",
					}}
				>
					<StyledText className="mb-3 font-semibold text-muted text-sm">
						Account Details
					</StyledText>
					<StyledView className="gap-3">
						<StyledView className="flex-row items-center">
							<Ionicons
								name="person-outline"
								size={18}
								color={isLight ? "#6b7280" : "#9ca3af"}
							/>
							<StyledText className="ml-3 flex-1 text-foreground">
								{user?.name}
							</StyledText>
						</StyledView>
						<StyledView className="flex-row items-center">
							<Ionicons
								name="mail-outline"
								size={18}
								color={isLight ? "#6b7280" : "#9ca3af"}
							/>
							<StyledText className="ml-3 flex-1 text-foreground">
								{user?.email}
							</StyledText>
						</StyledView>
						<StyledView className="flex-row items-center">
							<Ionicons
								name={
									user?.emailVerified ? "shield-checkmark" : "shield-outline"
								}
								size={18}
								color={user?.emailVerified ? "#22c55e" : "#f59e0b"}
							/>
							<StyledText className="ml-3 flex-1 text-foreground">
								{user?.emailVerified ? "Email verified" : "Email not verified"}
							</StyledText>
						</StyledView>
					</StyledView>
				</AnimatedView>

				{/* Sign Out */}
				<AnimatedView entering={FadeInUp.delay(1000).springify()}>
					<Button
						variant="outline"
						onPress={handleSignOut}
						isDisabled={signOut.isPending}
					>
						{signOut.isPending ? (
							<Spinner size="sm" />
						) : (
							<>
								<Ionicons
									name="log-out-outline"
									size={18}
									color={isLight ? "#1a1a2e" : "#ffffff"}
									style={{ marginRight: 8 }}
								/>
								<Button.Label>Sign Out</Button.Label>
							</>
						)}
					</Button>
				</AnimatedView>
			</ScrollView>
		</GradientBackground>
	);
}

const styles = StyleSheet.create({
	featureCard: {
		padding: 16,
	},
});
