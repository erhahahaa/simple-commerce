import { Ionicons } from "@expo/vector-icons";
import type { DomesticDestination } from "@simple-commerce/schema";
import { router, useLocalSearchParams } from "expo-router";
import { Button, Input, Spinner, useToast } from "heroui-native";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
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
import { useAddressById, useUpdateAddress } from "@/hooks/checkout";

export default function EditAddressScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const insets = useSafeAreaInsets();
	const { isLight } = useAppTheme();
	const { toast } = useToast();

	// Fetch existing address
	const { data: existingAddress, isLoading: isLoadingAddress } = useAddressById(
		id ?? "",
	);

	// Form state
	const [label, setLabel] = useState("");
	const [recipientName, setRecipientName] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [isDefault, setIsDefault] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);

	// Location state (from destination search)
	const [selectedDestination, setSelectedDestination] =
		useState<DomesticDestination | null>(null);

	// Modal state
	const [showDestinationSearch, setShowDestinationSearch] = useState(false);

	// Mutation
	const updateMutation = useUpdateAddress();

	// Initialize form with existing data
	useEffect(() => {
		if (existingAddress && !isInitialized) {
			setLabel(existingAddress.label);
			setRecipientName(existingAddress.recipientName);
			setPhone(existingAddress.phone);
			setAddress(existingAddress.address);
			setIsDefault(existingAddress.isDefault);

			// If address has V2 destinationId, construct a destination object
			if (existingAddress.destinationId) {
				setSelectedDestination({
					id: existingAddress.destinationId,
					label: `${existingAddress.subdistrictName ?? ""}, ${existingAddress.districtName ?? ""}, ${existingAddress.cityName ?? ""}, ${existingAddress.provinceName ?? ""}`,
					province_name: existingAddress.provinceName ?? "",
					city_name: existingAddress.cityName ?? "",
					district_name: existingAddress.districtName ?? "",
					subdistrict_name: existingAddress.subdistrictName ?? "",
					zip_code: existingAddress.postalCode ?? "",
				});
			}

			setIsInitialized(true);
		}
	}, [existingAddress, isInitialized]);

	const canSubmit =
		label.trim() &&
		recipientName.trim() &&
		phone.trim() &&
		selectedDestination &&
		address.trim() &&
		!updateMutation.isPending;

	const handleSubmit = () => {
		if (!selectedDestination || !id) return;

		updateMutation.mutate(
			{
				id,
				data: {
					label: label.trim(),
					recipientName: recipientName.trim(),
					phone: phone.trim(),
					// V2 location fields
					provinceId: "", // Legacy field - not used in V2
					provinceName: selectedDestination.province_name,
					cityId: "", // Legacy field - not used in V2
					cityName: selectedDestination.city_name,
					districtId: "",
					districtName: selectedDestination.district_name,
					subdistrictId: "",
					subdistrictName: selectedDestination.subdistrict_name,
					destinationId: selectedDestination.id,
					postalCode: selectedDestination.zip_code,
					address: address.trim(),
					isDefault,
				},
			},
			{
				onSuccess: () => {
					toast.show({
						variant: "success",
						label: "Address updated",
						description: "Your address has been updated successfully",
					});
					router.back();
				},
				onError: (error) => {
					toast.show({
						variant: "danger",
						label: "Failed to update address",
						description: error.message,
					});
				},
			},
		);
	};

	const handleDestinationSelect = (destination: DomesticDestination) => {
		setSelectedDestination(destination);
	};

	// Format selected destination for display
	const getDestinationDisplay = () => {
		if (!selectedDestination) return null;
		return {
			main: `${selectedDestination.subdistrict_name}, ${selectedDestination.district_name}`,
			sub: `${selectedDestination.city_name}, ${selectedDestination.province_name} - ${selectedDestination.zip_code}`,
		};
	};

	const destinationDisplay = getDestinationDisplay();

	// Check if this is a legacy address that needs updating
	const needsLocationUpdate = existingAddress && !existingAddress.destinationId;

	if (isLoadingAddress) {
		return (
			<GradientBackground variant="app">
				<StyledView className="flex-1 items-center justify-center">
					<Spinner size="lg" />
				</StyledView>
			</GradientBackground>
		);
	}

	if (!existingAddress) {
		return (
			<GradientBackground variant="app">
				<StyledView
					className="flex-1 items-center justify-center px-8"
					style={{ paddingTop: insets.top + 10 }}
				>
					<Ionicons
						name="alert-circle-outline"
						size={60}
						color={isLight ? "#9ca3af" : "#6b7280"}
					/>
					<StyledText className="mt-4 text-center font-semibold text-foreground text-lg">
						Address not found
					</StyledText>
					<Button className="mt-6" onPress={() => router.back()}>
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
						Edit Address
					</StyledText>
				</AnimatedView>

				<ScrollView
					className="flex-1 px-5"
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: 120 }}
				>
					<AnimatedView entering={FadeInUp.duration(200)}>
						{/* Update Required Banner */}
						{needsLocationUpdate && (
							<StyledView
								className="mb-4 rounded-xl p-4"
								style={{
									backgroundColor: isLight
										? "rgba(245,158,11,0.1)"
										: "rgba(245,158,11,0.2)",
									borderWidth: 1,
									borderColor: "rgba(245,158,11,0.3)",
								}}
							>
								<StyledView className="flex-row items-center">
									<Ionicons
										name="information-circle-outline"
										size={20}
										color="#f59e0b"
										style={{ marginRight: 8 }}
									/>
									<StyledText
										className="flex-1 font-medium"
										style={{ color: "#f59e0b" }}
									>
										Location Update Required
									</StyledText>
								</StyledView>
								<StyledText className="mt-2 text-muted text-sm">
									Please search and select your location to enable accurate
									shipping cost calculation.
								</StyledText>
							</StyledView>
						)}

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
							<StyledView className="mb-2 flex-row items-center">
								<StyledText className="font-medium text-foreground">
									Location *
								</StyledText>
								{needsLocationUpdate && !selectedDestination && (
									<StyledView
										className="ml-2 rounded-full px-2 py-0.5"
										style={{
											backgroundColor: isLight
												? "rgba(239,68,68,0.1)"
												: "rgba(239,68,68,0.2)",
										}}
									>
										<StyledText
											className="font-medium text-xs"
											style={{ color: "#ef4444" }}
										>
											Required
										</StyledText>
									</StyledView>
								)}
							</StyledView>
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
											: needsLocationUpdate
												? "#ef4444"
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
													color={
														needsLocationUpdate
															? "#ef4444"
															: isLight
																? "#9ca3af"
																: "#6b7280"
													}
													style={{ marginRight: 8 }}
												/>
												<StyledText
													style={{
														color: needsLocationUpdate
															? "#ef4444"
															: isLight
																? "#9ca3af"
																: "#6b7280",
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
						{updateMutation.isPending ? (
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

			{/* Destination Search Modal */}
			{showDestinationSearch && (
				<DestinationSearch
					onSelect={handleDestinationSelect}
					onClose={() => setShowDestinationSearch(false)}
					isLight={isLight}
					initialSearch={
						existingAddress?.cityName ?? selectedDestination?.city_name ?? ""
					}
				/>
			)}
		</GradientBackground>
	);
}
