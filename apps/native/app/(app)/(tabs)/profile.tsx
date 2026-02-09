import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { Spinner, useToast } from "heroui-native";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientBackground } from "@/components/gradient-background";
import { Skeleton, SkeletonAvatar } from "@/components/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import {
	AnimatedView,
	StyledPressable,
	StyledText,
	StyledView,
} from "@/components/uniwind";
import { config } from "@/config";
import { useAppTheme } from "@/contexts/app-theme-context";
import { useGetSession, useSignOut } from "@/hooks/auth";
import { useProfile } from "@/hooks/user";

type ProfileItemProps = {
	icon: keyof typeof Ionicons.glyphMap;
	label: string;
	value?: string;
	onPress?: () => void;
	danger?: boolean;
	isLoading?: boolean;
};

function ProfileItem({
	icon,
	label,
	value,
	onPress,
	danger,
	isLoading,
}: ProfileItemProps) {
	const { isLight } = useAppTheme();

	return (
		<StyledPressable
			className="flex-row items-center px-4 py-4"
			onPress={onPress}
			disabled={isLoading}
		>
			<StyledView
				className="mr-4 h-10 w-10 items-center justify-center rounded-full"
				style={{
					backgroundColor: danger
						? "rgba(239,68,68,0.1)"
						: isLight
							? "rgba(102,126,234,0.1)"
							: "rgba(168,85,247,0.1)",
				}}
			>
				{isLoading ? (
					<Spinner size="sm" />
				) : (
					<Ionicons
						name={icon}
						size={20}
						color={danger ? "#ef4444" : isLight ? "#667eea" : "#a855f7"}
					/>
				)}
			</StyledView>
			<StyledView className="flex-1">
				<StyledText
					className="font-medium"
					style={{
						color: danger ? "#ef4444" : isLight ? "#111827" : "#f3f4f6",
					}}
				>
					{label}
				</StyledText>
				{value && (
					<StyledText className="mt-0.5 text-muted text-sm">{value}</StyledText>
				)}
			</StyledView>
			{onPress && !danger && (
				<Ionicons
					name="chevron-forward"
					size={20}
					color={isLight ? "#9ca3af" : "#6b7280"}
				/>
			)}
		</StyledPressable>
	);
}

export default function ProfileScreen() {
	const insets = useSafeAreaInsets();
	const { isLight } = useAppTheme();
	const { toast } = useToast();
	const { data: session, isLoading: sessionLoading } = useGetSession();
	const { data: profile, isLoading: profileLoading } = useProfile();
	const signOut = useSignOut();

	const isLoading = sessionLoading || profileLoading;
	const user = session?.success ? session.data.user : null;

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

	const handleOpenLink = (url: string, title: string) => {
		Alert.alert(title, "This would open external link in production.", [
			{ text: "Cancel", style: "cancel" },
			{ text: "Open", onPress: () => Linking.openURL(url) },
		]);
	};

	// NOTE: hide for now (not planned)
	// const handlePaymentMethods = () => {
	// 	toast.show({
	// 		variant: "default",
	// 		label: "Coming Soon",
	// 		description: "Payment methods management will be available soon",
	// 	});
	// };

	return (
		<GradientBackground variant="app">
			<ScrollView
				contentContainerStyle={{
					paddingTop: insets.top + 10,
					paddingBottom: insets.bottom + 100,
				}}
				showsVerticalScrollIndicator={false}
			>
				{/* Header */}
				<AnimatedView entering={FadeInDown.duration(200)} className="px-5 pb-6">
					<StyledView className="mb-6 flex-row items-center justify-between">
						<StyledText className="font-bold text-2xl text-foreground">
							Profile
						</StyledText>
						<ThemeToggle />
					</StyledView>

					{/* User Info Card */}
					<StyledView
						className="rounded-2xl p-5"
						style={{
							backgroundColor: isLight
								? "rgba(255,255,255,0.95)"
								: "rgba(30,30,45,0.95)",
						}}
					>
						{isLoading ? (
							<StyledView className="flex-row items-center">
								<SkeletonAvatar size={64} />
								<StyledView className="ml-4 flex-1">
									<Skeleton width="60%" height={20} />
									<Skeleton width="80%" height={14} className="mt-2" />
									<Skeleton width="40%" height={12} className="mt-2" />
								</StyledView>
							</StyledView>
						) : (
							<StyledView className="flex-row items-center">
								<StyledView className="h-16 w-16 items-center justify-center overflow-hidden rounded-full">
									<LinearGradient
										colors={["#667eea", "#764ba2"]}
										style={StyleSheet.absoluteFill}
									/>
									<StyledText className="font-bold text-2xl text-white">
										{user?.name?.charAt(0).toUpperCase() || "U"}
									</StyledText>
								</StyledView>
								<StyledView className="ml-4 flex-1">
									<StyledText className="font-bold text-foreground text-lg">
										{user?.name || "User"}
									</StyledText>
									<StyledText className="mt-1 text-muted text-sm">
										{user?.email}
									</StyledText>
									{profile?.phone && (
										<StyledText className="mt-0.5 text-muted text-sm">
											{profile.phone}
										</StyledText>
									)}
									<StyledView className="mt-2 flex-row items-center">
										<Ionicons
											name={
												user?.emailVerified
													? "shield-checkmark"
													: "shield-outline"
											}
											size={14}
											color={user?.emailVerified ? "#22c55e" : "#f59e0b"}
										/>
										<StyledText
											className="ml-1 text-xs"
											style={{
												color: user?.emailVerified ? "#22c55e" : "#f59e0b",
											}}
										>
											{user?.emailVerified ? "Verified" : "Not verified"}
										</StyledText>
									</StyledView>
								</StyledView>
							</StyledView>
						)}
					</StyledView>
				</AnimatedView>

				{/* Settings Section */}
				<AnimatedView
					entering={FadeInUp.duration(200)}
					className="mx-5 overflow-hidden rounded-2xl"
					style={{
						backgroundColor: isLight
							? "rgba(255,255,255,0.95)"
							: "rgba(30,30,45,0.95)",
					}}
				>
					<StyledText className="px-4 pt-4 pb-2 font-semibold text-muted text-xs uppercase">
						Account
					</StyledText>
					<ProfileItem
						icon="person-outline"
						label="Edit Profile"
						onPress={() => router.push("/(app)/profile/edit")}
					/>
					<ProfileItem
						icon="location-outline"
						label="Addresses"
						onPress={() => router.push("/(app)/profile/addresses")}
					/>
					{/* NOTE: hide for now (not planned) */}
					{/* <ProfileItem
						icon="card-outline"
						label="Payment Methods"
						onPress={handlePaymentMethods}
					/> */}
					<ProfileItem
						icon="heart-outline"
						label="Wishlist"
						onPress={() => router.push("/(app)/wishlist")}
					/>
				</AnimatedView>

				<AnimatedView
					entering={FadeInUp.duration(200)}
					className="mx-5 mt-4 overflow-hidden rounded-2xl"
					style={{
						backgroundColor: isLight
							? "rgba(255,255,255,0.95)"
							: "rgba(30,30,45,0.95)",
					}}
				>
					<StyledText className="px-4 pt-4 pb-2 font-semibold text-muted text-xs uppercase">
						Support
					</StyledText>
					<ProfileItem
						icon="help-circle-outline"
						label="Help Center"
						onPress={() =>
							handleOpenLink(config.urls.helpCenter, "Help Center")
						}
					/>
					<ProfileItem
						icon="chatbubble-outline"
						label="Contact Us"
						onPress={() =>
							handleOpenLink(config.urls.supportEmail, "Contact Us")
						}
					/>
					<ProfileItem
						icon="document-text-outline"
						label="Terms & Privacy"
						onPress={() =>
							handleOpenLink(config.urls.termsOfService, "Terms & Privacy")
						}
					/>
				</AnimatedView>

				<AnimatedView
					entering={FadeInUp.duration(200)}
					className="mx-5 mt-4 overflow-hidden rounded-2xl"
					style={{
						backgroundColor: isLight
							? "rgba(255,255,255,0.95)"
							: "rgba(30,30,45,0.95)",
					}}
				>
					<ProfileItem
						icon="log-out-outline"
						label="Sign Out"
						onPress={handleSignOut}
						danger
						isLoading={signOut.isPending}
					/>
				</AnimatedView>
			</ScrollView>
		</GradientBackground>
	);
}
