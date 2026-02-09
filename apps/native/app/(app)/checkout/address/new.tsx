import { Ionicons } from "@expo/vector-icons";
import type { DomesticDestination } from "@simple-commerce/schema";
import { router } from "expo-router";
import { Button, Input, Spinner, useToast } from "heroui-native";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DestinationSearch } from "@/components/destination-search";
import { GradientBackground } from "@/components/gradient-background";
import {
	AnimatedView,
	StyledPressable,
	StyledText,
	StyledView,
} from "@/components/uniwind";
import { useAppTheme } from "@/contexts/app-theme-context";
import { useCreateAddress } from "@/hooks/checkout";
import { useProfile } from "@/hooks/user";

export default function NewAddressScreen() {
	const insets = useSafeAreaInsets();
	const { isLight } = useAppTheme();
	const { toast } = useToast();

	// Form state
	const [label, setLabel] = useState("");
	const [recipientName, setRecipientName] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [isDefault, setIsDefault] = useState(false);

	// Location state (from destination search)
	const [selectedDestination, setSelectedDestination] =
		useState<DomesticDestination | null>(null);

	// Modal state
	const [showDestinationSearch, setShowDestinationSearch] = useState(false);

	// User profile for auto-population
	const { data: profile } = useProfile();

	// Mutation
	const createMutation = useCreateAddress();

	const canSubmit =
		label.trim() &&
		recipientName.trim() &&
		phone.trim() &&
		selectedDestination &&
		address.trim() &&
		!createMutation.isPending;

	const handleSubmit = () => {
		if (!selectedDestination) return;

		createMutation.mutate(
			{
				label: label.trim(),
				recipientName: recipientName.trim(),
				phone: phone.trim(),
				// V2 location fields
				provinceId: "", // Legacy field - not used in V2
				provinceName: selectedDestination.province_name,
				cityId: "", // Legacy field - not used in V2
				cityName: selectedDestination.city_name,
				districtId: "", // We don't have separate IDs from the search endpoint
				districtName: selectedDestination.district_name,
				subdistrictId: "",
				subdistrictName: selectedDestination.subdistrict_name,
				destinationId: selectedDestination.id, // This is the key field for V2
				postalCode: selectedDestination.zip_code,
				address: address.trim(),
				isDefault,
			},
			{
				onSuccess: () => {
					toast.show({
						variant: "success",
						label: "Address added",
						description: "Your new address has been saved",
					});
					router.back();
				},
				onError: (error) => {
					toast.show({
						variant: "danger",
						label: "Failed to add address",
						description: error.message,
					});
				},
			},
		);
	};

	const handleDestinationSelect = (destination: DomesticDestination) => {
		setSelectedDestination(destination);
	};

	const handleUseMyInfo = () => {
		if (profile?.name) {
			setRecipientName(profile.name);
		}
		if (profile?.phone) {
			setPhone(profile.phone);
		}
	};

	const canUseMyInfo = !!(profile?.name || profile?.phone);

	// Format selected destination for display
	const getDestinationDisplay = () => {
		if (!selectedDestination) return null;
		return {
			main: `${selectedDestination.subdistrict_name}, ${selectedDestination.district_name}`,
			sub: `${selectedDestination.city_name}, ${selectedDestination.province_name} - ${selectedDestination.zip_code}`,
		};
	};

	const destinationDisplay = getDestinationDisplay();

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
						Add New Address
					</StyledText>
				</AnimatedView>

				<KeyboardAwareScrollView
					className="flex-1 px-5"
					showsVerticalScrollIndicator={false}
					bottomOffset={20}
					contentContainerStyle={{ paddingBottom: 120 }}
				>
					<AnimatedView entering={FadeInUp.duration(200)}>
						{/* Label */}
						<StyledView className="mb-4">
							<StyledText className="mb-2 font-medium text-foreground">
								Label *
							</StyledText>
							<Input
								placeholder="e.g., Home, Office"
								value={label}
								onChangeText={setLabel}
							/>
						</StyledView>

						{/* Use My Info Button */}
						{canUseMyInfo && (
							<TouchableOpacity onPress={handleUseMyInfo}>
								<StyledView
									className="mb-4 flex-row items-center justify-center rounded-xl py-3"
									style={{
										backgroundColor: isLight
											? "rgba(102,126,234,0.1)"
											: "rgba(168,85,247,0.1)",
									}}
								>
									<Ionicons
										name="person-outline"
										size={18}
										color={isLight ? "#667eea" : "#a855f7"}
										style={{ marginRight: 8 }}
									/>
									<StyledText
										className="font-medium"
										style={{ color: isLight ? "#667eea" : "#a855f7" }}
									>
										Use my info
									</StyledText>
								</StyledView>
							</TouchableOpacity>
						)}

						{/* Recipient Name */}
						<StyledView className="mb-4">
							<StyledText className="mb-2 font-medium text-foreground">
								Recipient Name *
							</StyledText>
							<Input
								placeholder="Full name"
								value={recipientName}
								onChangeText={setRecipientName}
							/>
						</StyledView>

						{/* Phone */}
						<StyledView className="mb-4">
							<StyledText className="mb-2 font-medium text-foreground">
								Phone Number *
							</StyledText>
							<Input
								placeholder="e.g., 08123456789"
								value={phone}
								onChangeText={setPhone}
								keyboardType="phone-pad"
							/>
						</StyledView>

						{/* Location Search */}
						<StyledView className="mb-4">
							<StyledText className="mb-2 font-medium text-foreground">
								Location *
							</StyledText>
							<TouchableOpacity onPress={() => setShowDestinationSearch(true)}>
								<StyledView
									className="rounded-xl px-4 py-3"
									style={{
										backgroundColor: isLight
											? "rgba(255,255,255,0.9)"
											: "rgba(30,30,45,0.9)",
										borderWidth: 1,
										borderColor: selectedDestination
											? isLight
												? "#667eea"
												: "#a855f7"
											: isLight
												? "rgba(0,0,0,0.1)"
												: "rgba(255,255,255,0.1)",
									}}
								>
									{destinationDisplay ? (
										<StyledView className="flex-row items-start">
											<Ionicons
												name="location"
												size={18}
												color={isLight ? "#667eea" : "#a855f7"}
												style={{ marginRight: 10, marginTop: 2 }}
											/>
											<StyledView className="flex-1">
												<StyledText className="font-medium text-foreground">
													{destinationDisplay.main}
												</StyledText>
												<StyledText className="text-muted text-sm">
													{destinationDisplay.sub}
												</StyledText>
											</StyledView>
											<Ionicons
												name="chevron-forward"
												size={20}
												color={isLight ? "#9ca3af" : "#6b7280"}
											/>
										</StyledView>
									) : (
										<StyledView className="flex-row items-center justify-between">
											<StyledView className="flex-row items-center">
												<Ionicons
													name="search-outline"
													size={18}
													color={isLight ? "#9ca3af" : "#6b7280"}
													style={{ marginRight: 8 }}
												/>
												<StyledText
													style={{
														color: isLight ? "#9ca3af" : "#6b7280",
													}}
												>
													Search city, district, or subdistrict
												</StyledText>
											</StyledView>
											<Ionicons
												name="chevron-forward"
												size={20}
												color={isLight ? "#9ca3af" : "#6b7280"}
											/>
										</StyledView>
									)}
								</StyledView>
							</TouchableOpacity>
							<StyledText className="mt-2 text-muted text-xs">
								Precise location helps calculate accurate shipping costs
							</StyledText>
						</StyledView>

						{/* Full Address */}
						<StyledView className="mb-4">
							<StyledText className="mb-2 font-medium text-foreground">
								Street Address *
							</StyledText>
							<Input
								placeholder="Street name, building, unit number, etc."
								value={address}
								onChangeText={setAddress}
								multiline
								numberOfLines={3}
								style={{ minHeight: 80, textAlignVertical: "top" }}
							/>
						</StyledView>

						{/* Set as Default */}
						<TouchableOpacity onPress={() => setIsDefault(!isDefault)}>
							<StyledView className="flex-row items-center">
								<StyledView
									className="mr-3 h-6 w-6 items-center justify-center rounded"
									style={{
										backgroundColor: isDefault
											? isLight
												? "#667eea"
												: "#a855f7"
											: "transparent",
										borderWidth: isDefault ? 0 : 2,
										borderColor: isLight ? "#d1d5db" : "#4b5563",
									}}
								>
									{isDefault && (
										<Ionicons name="checkmark" size={16} color="white" />
									)}
								</StyledView>
								<StyledText className="font-medium text-foreground">
									Set as default address
								</StyledText>
							</StyledView>
						</TouchableOpacity>
					</AnimatedView>
				</KeyboardAwareScrollView>

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
						{createMutation.isPending ? (
							<Spinner size="sm" color="white" />
						) : (
							<>
								<Ionicons
									name="checkmark"
									size={18}
									color="white"
									style={{ marginRight: 8 }}
								/>
								<Button.Label>Save Address</Button.Label>
							</>
						)}
					</Button>
				</AnimatedView>
			</StyledView>

			{/* Destination Search Modal */}
			{showDestinationSearch && (
				<DestinationSearch
					onSelect={handleDestinationSelect}
					onClose={() => setShowDestinationSearch(false)}
					isLight={isLight}
					initialSearch={selectedDestination?.city_name ?? ""}
				/>
			)}
		</GradientBackground>
	);
}
