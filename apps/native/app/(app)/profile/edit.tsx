import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Button, Input, Spinner, useToast } from "heroui-native";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientBackground } from "@/components/gradient-background";
import {
	AnimatedView,
	StyledPressable,
	StyledText,
	StyledView,
} from "@/components/uniwind";
import { useAppTheme } from "@/contexts/app-theme-context";
import { useProfile, useUpdateProfile } from "@/hooks/user";

export default function EditProfileScreen() {
	const insets = useSafeAreaInsets();
	const { isLight } = useAppTheme();
	const { toast } = useToast();

	const {
		data: profile,
		isLoading: profileLoading,
		isError,
		refetch,
	} = useProfile();
	const updateProfile = useUpdateProfile();

	// Form state
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [hasChanges, setHasChanges] = useState(false);

	// Initialize form with profile data
	useEffect(() => {
		if (profile) {
			setName(profile.name || "");
			setPhone(profile.phone || "");
		}
	}, [profile]);

	// Track changes
	useEffect(() => {
		if (profile) {
			const nameChanged = name !== (profile.name || "");
			const phoneChanged = phone !== (profile.phone || "");
			setHasChanges(nameChanged || phoneChanged);
		}
	}, [name, phone, profile]);

	const validatePhone = (value: string): boolean => {
		if (!value) return true; // Phone is optional
		return /^(\+62|62|0)[0-9]{9,13}$/.test(value);
	};

	const canSubmit =
		name.trim() &&
		validatePhone(phone) &&
		hasChanges &&
		!updateProfile.isPending;

	const handleSubmit = () => {
		if (!canSubmit) return;

		updateProfile.mutate(
			{
				name: name.trim(),
				phone: phone.trim() || null,
			},
			{
				onSuccess: () => {
					toast.show({
						variant: "success",
						label: "Profile updated",
						description: "Your profile has been saved",
					});
					router.back();
				},
				onError: (error) => {
					toast.show({
						variant: "danger",
						label: "Failed to update profile",
						description: error.message,
					});
				},
			},
		);
	};

	if (profileLoading) {
		return (
			<GradientBackground variant="app">
				<StyledView className="flex-1 items-center justify-center">
					<Spinner size="lg" />
				</StyledView>
			</GradientBackground>
		);
	}

	if (isError) {
		return (
			<GradientBackground variant="app">
				<StyledView
					className="flex-1 items-center justify-center px-8"
					style={{ paddingTop: insets.top + 10 }}
				>
					<Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
					<StyledText className="mt-4 font-semibold text-foreground text-lg">
						Failed to load profile
					</StyledText>
					<StyledText className="mt-2 text-center text-muted">
						Please check your connection and try again
					</StyledText>
					<Button className="mt-6" onPress={() => refetch()}>
						<Ionicons
							name="refresh"
							size={18}
							color="white"
							style={{ marginRight: 8 }}
						/>
						<Button.Label>Try Again</Button.Label>
					</Button>
					<Button
						className="mt-3"
						variant="outline"
						onPress={() => router.back()}
					>
						<Button.Label>Go Back</Button.Label>
					</Button>
				</StyledView>
			</GradientBackground>
		);
	}

	return (
		<GradientBackground variant="app">
			<StyledView
				className="flex-1"
				style={{
					paddingTop: insets.top + 10,
				}}
			>
				{/* Header */}
				<AnimatedView
					entering={FadeInDown.duration(200)}
					className="flex-row items-center px-5 pb-4"
				>
					<StyledPressable
						className="mr-4 h-10 w-10 items-center justify-center rounded-full"
						style={{
							backgroundColor: isLight
								? "rgba(0,0,0,0.05)"
								: "rgba(255,255,255,0.05)",
						}}
						onPress={() => router.back()}
					>
						<Ionicons
							name="arrow-back"
							size={20}
							color={isLight ? "#1a1a2e" : "#ffffff"}
						/>
					</StyledPressable>
					<StyledText className="font-bold text-foreground text-xl">
						Edit Profile
					</StyledText>
				</AnimatedView>

				<ScrollView
					className="flex-1 px-5"
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: 120 }}
				>
					<AnimatedView entering={FadeInUp.duration(200)}>
						{/* Profile Avatar */}
						<StyledView className="mb-6 items-center">
							<StyledView
								className="h-24 w-24 items-center justify-center overflow-hidden rounded-full"
								style={{
									backgroundColor: isLight ? "#667eea" : "#a855f7",
								}}
							>
								<StyledText className="font-bold text-4xl text-white">
									{name?.charAt(0).toUpperCase() || "U"}
								</StyledText>
							</StyledView>
							<StyledText className="mt-2 text-muted text-sm">
								{profile?.email}
							</StyledText>
						</StyledView>

						{/* Name */}
						<StyledView className="mb-4">
							<StyledText className="mb-2 font-medium text-foreground">
								Full Name *
							</StyledText>
							<Input
								placeholder="Your full name"
								value={name}
								onChangeText={setName}
								autoCapitalize="words"
							/>
							{!name.trim() && (
								<StyledText className="mt-1 text-red-500 text-xs">
									Name is required
								</StyledText>
							)}
						</StyledView>

						{/* Phone */}
						<StyledView className="mb-4">
							<StyledText className="mb-2 font-medium text-foreground">
								Phone Number
							</StyledText>
							<Input
								placeholder="e.g., 08123456789 or +6281234567890"
								value={phone}
								onChangeText={setPhone}
								keyboardType="phone-pad"
							/>
							{phone && !validatePhone(phone) && (
								<StyledText className="mt-1 text-red-500 text-xs">
									Invalid phone format. Use format: 08xx or +62xx
								</StyledText>
							)}
							<StyledText className="mt-1 text-muted text-xs">
								Phone number is used for shipping notifications
							</StyledText>
						</StyledView>

						{/* Email (read-only) */}
						<StyledView className="mb-4">
							<StyledText className="mb-2 font-medium text-foreground">
								Email Address
							</StyledText>
							<StyledView
								className="rounded-xl px-4 py-3"
								style={{
									backgroundColor: isLight
										? "rgba(0,0,0,0.05)"
										: "rgba(255,255,255,0.05)",
								}}
							>
								<StyledText className="text-muted">{profile?.email}</StyledText>
							</StyledView>
							<StyledText className="mt-1 text-muted text-xs">
								Email cannot be changed
							</StyledText>
						</StyledView>

						{/* Email Verification Status */}
						<StyledView
							className="flex-row items-center rounded-xl p-4"
							style={{
								backgroundColor: profile?.emailVerified
									? "rgba(34,197,94,0.1)"
									: "rgba(245,158,11,0.1)",
							}}
						>
							<Ionicons
								name={
									profile?.emailVerified ? "shield-checkmark" : "shield-outline"
								}
								size={24}
								color={profile?.emailVerified ? "#22c55e" : "#f59e0b"}
							/>
							<StyledView className="ml-3 flex-1">
								<StyledText
									className="font-medium"
									style={{
										color: profile?.emailVerified ? "#22c55e" : "#f59e0b",
									}}
								>
									{profile?.emailVerified
										? "Email Verified"
										: "Email Not Verified"}
								</StyledText>
								<StyledText className="mt-0.5 text-muted text-xs">
									{profile?.emailVerified
										? "Your email has been verified"
										: "Please verify your email for security"}
								</StyledText>
							</StyledView>
						</StyledView>
					</AnimatedView>
				</ScrollView>

				{/* Bottom Action */}
				<AnimatedView
					entering={FadeInUp.duration(200)}
					className="absolute right-0 bottom-0 left-0 px-5 pt-4"
					style={{
						paddingBottom: insets.bottom + 12,
						backgroundColor: isLight
							? "rgba(255,255,255,0.95)"
							: "rgba(30,30,45,0.95)",
						borderTopWidth: 1,
						borderTopColor: isLight
							? "rgba(0,0,0,0.1)"
							: "rgba(255,255,255,0.1)",
					}}
				>
					<Button
						className="w-full"
						size="lg"
						isDisabled={!canSubmit}
						onPress={handleSubmit}
					>
						{updateProfile.isPending ? (
							<Spinner size="sm" color="white" />
						) : (
							<>
								<Ionicons
									name="checkmark"
									size={18}
									color="white"
									style={{ marginRight: 8 }}
								/>
								<Button.Label>Save Changes</Button.Label>
							</>
						)}
					</Button>
				</AnimatedView>
			</StyledView>
		</GradientBackground>
	);
}
