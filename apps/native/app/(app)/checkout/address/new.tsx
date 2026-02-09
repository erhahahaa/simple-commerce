import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Button, Input, Spinner, useToast } from "heroui-native";
import { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
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
import { useCities, useCreateAddress, useProvinces } from "@/hooks/checkout";

type Province = {
	province_id: string;
	province: string;
};

type City = {
	city_id: string;
	city_name: string;
	type: string;
	postal_code: string;
	province_id: string;
	province: string;
};

interface SelectModalProps {
	title: string;
	options: { id: string; label: string }[];
	selectedId: string | null;
	onSelect: (id: string, label: string) => void;
	onClose: () => void;
	isLoading?: boolean;
	isLight: boolean;
}

function SelectModal({
	title,
	options,
	selectedId,
	onSelect,
	onClose,
	isLoading,
	isLight,
}: SelectModalProps) {
	return (
		<StyledView
			className="absolute inset-0 z-50"
			style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
		>
			<StyledPressable className="flex-1" onPress={onClose} />
			<StyledView
				className="max-h-[70%] rounded-t-3xl px-5 pt-6 pb-8"
				style={{
					backgroundColor: isLight ? "#ffffff" : "#1e1e2d",
				}}
			>
				<StyledView className="mb-4 flex-row items-center justify-between">
					<StyledText className="font-bold text-foreground text-lg">
						{title}
					</StyledText>
					<TouchableOpacity onPress={onClose}>
						<Ionicons
							name="close"
							size={24}
							color={isLight ? "#374151" : "#d1d5db"}
						/>
					</TouchableOpacity>
				</StyledView>

				{isLoading ? (
					<StyledView className="items-center py-8">
						<Spinner size="lg" />
					</StyledView>
				) : (
					<ScrollView showsVerticalScrollIndicator={false}>
						{options.map((option) => (
							<TouchableOpacity
								key={option.id}
								onPress={() => {
									onSelect(option.id, option.label);
									onClose();
								}}
							>
								<StyledView
									className="flex-row items-center justify-between rounded-xl px-4 py-3"
									style={{
										backgroundColor:
											selectedId === option.id
												? isLight
													? "rgba(102,126,234,0.1)"
													: "rgba(168,85,247,0.1)"
												: "transparent",
									}}
								>
									<StyledText
										className="font-medium"
										style={{
											color:
												selectedId === option.id
													? isLight
														? "#667eea"
														: "#a855f7"
													: isLight
														? "#374151"
														: "#d1d5db",
										}}
									>
										{option.label}
									</StyledText>
									{selectedId === option.id && (
										<Ionicons
											name="checkmark"
											size={20}
											color={isLight ? "#667eea" : "#a855f7"}
										/>
									)}
								</StyledView>
							</TouchableOpacity>
						))}
					</ScrollView>
				)}
			</StyledView>
		</StyledView>
	);
}

export default function NewAddressScreen() {
	const insets = useSafeAreaInsets();
	const { isLight } = useAppTheme();
	const { toast } = useToast();

	// Form state
	const [label, setLabel] = useState("");
	const [recipientName, setRecipientName] = useState("");
	const [phone, setPhone] = useState("");
	const [provinceId, setProvinceId] = useState<string | null>(null);
	const [provinceName, setProvinceName] = useState("");
	const [cityId, setCityId] = useState<string | null>(null);
	const [cityName, setCityName] = useState("");
	const [district, setDistrict] = useState("");
	const [postalCode, setPostalCode] = useState("");
	const [address, setAddress] = useState("");
	const [isDefault, setIsDefault] = useState(false);

	// Modal state
	const [showProvinceModal, setShowProvinceModal] = useState(false);
	const [showCityModal, setShowCityModal] = useState(false);

	// Queries
	const { data: provincesData, isLoading: provincesLoading } = useProvinces();
	const { data: citiesData, isLoading: citiesLoading } = useCities(
		provinceId ?? undefined,
	);

	const provinces = (provincesData as Province[] | undefined) ?? [];
	const cities = (citiesData as City[] | undefined) ?? [];

	// Mutation
	const createMutation = useCreateAddress();

	const canSubmit =
		label.trim() &&
		recipientName.trim() &&
		phone.trim() &&
		provinceId &&
		provinceName &&
		cityId &&
		cityName &&
		postalCode.trim() &&
		address.trim() &&
		!createMutation.isPending;

	const handleSubmit = () => {
		if (!provinceId || !cityId) return;

		createMutation.mutate(
			{
				label: label.trim(),
				recipientName: recipientName.trim(),
				phone: phone.trim(),
				provinceId,
				provinceName,
				cityId,
				cityName,
				district: district.trim() || undefined,
				postalCode: postalCode.trim(),
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

	const handleProvinceSelect = (id: string, name: string) => {
		setProvinceId(id);
		setProvinceName(name);
		// Reset city when province changes
		setCityId(null);
		setCityName("");
		setPostalCode("");
	};

	const handleCitySelect = (id: string, name: string) => {
		setCityId(id);
		const city = cities.find((c) => c.city_id === id);
		if (city) {
			setCityName(`${city.type} ${city.city_name}`);
			setPostalCode(city.postal_code);
		} else {
			setCityName(name);
		}
	};

	return (
		<GradientBackground variant="app">
			<StyledView className="flex-1" style={{ paddingTop: insets.top }}>
				{/* Header */}
				<AnimatedView
					entering={FadeInDown.delay(100).springify()}
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

				<ScrollView
					className="flex-1 px-5"
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: 120 }}
				>
					<AnimatedView entering={FadeInUp.delay(200).springify()}>
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

						{/* Province */}
						<StyledView className="mb-4">
							<StyledText className="mb-2 font-medium text-foreground">
								Province *
							</StyledText>
							<TouchableOpacity onPress={() => setShowProvinceModal(true)}>
								<StyledView
									className="flex-row items-center justify-between rounded-xl px-4 py-3"
									style={{
										backgroundColor: isLight
											? "rgba(255,255,255,0.9)"
											: "rgba(30,30,45,0.9)",
										borderWidth: 1,
										borderColor: isLight
											? "rgba(0,0,0,0.1)"
											: "rgba(255,255,255,0.1)",
									}}
								>
									<StyledText
										style={{
											color: provinceName
												? isLight
													? "#374151"
													: "#d1d5db"
												: isLight
													? "#9ca3af"
													: "#6b7280",
										}}
									>
										{provinceName || "Select province"}
									</StyledText>
									<Ionicons
										name="chevron-down"
										size={20}
										color={isLight ? "#9ca3af" : "#6b7280"}
									/>
								</StyledView>
							</TouchableOpacity>
						</StyledView>

						{/* City */}
						<StyledView className="mb-4">
							<StyledText className="mb-2 font-medium text-foreground">
								City *
							</StyledText>
							<TouchableOpacity
								onPress={() => provinceId && setShowCityModal(true)}
								disabled={!provinceId}
							>
								<StyledView
									className="flex-row items-center justify-between rounded-xl px-4 py-3"
									style={{
										backgroundColor: isLight
											? "rgba(255,255,255,0.9)"
											: "rgba(30,30,45,0.9)",
										borderWidth: 1,
										borderColor: isLight
											? "rgba(0,0,0,0.1)"
											: "rgba(255,255,255,0.1)",
										opacity: provinceId ? 1 : 0.5,
									}}
								>
									<StyledText
										style={{
											color: cityName
												? isLight
													? "#374151"
													: "#d1d5db"
												: isLight
													? "#9ca3af"
													: "#6b7280",
										}}
									>
										{cityName || "Select city"}
									</StyledText>
									<Ionicons
										name="chevron-down"
										size={20}
										color={isLight ? "#9ca3af" : "#6b7280"}
									/>
								</StyledView>
							</TouchableOpacity>
						</StyledView>

						{/* District */}
						<StyledView className="mb-4">
							<StyledText className="mb-2 font-medium text-foreground">
								District (Optional)
							</StyledText>
							<Input
								placeholder="e.g., Kecamatan Menteng"
								value={district}
								onChangeText={setDistrict}
							/>
						</StyledView>

						{/* Postal Code */}
						<StyledView className="mb-4">
							<StyledText className="mb-2 font-medium text-foreground">
								Postal Code *
							</StyledText>
							<Input
								placeholder="e.g., 12345"
								value={postalCode}
								onChangeText={setPostalCode}
								keyboardType="number-pad"
							/>
						</StyledView>

						{/* Full Address */}
						<StyledView className="mb-4">
							<StyledText className="mb-2 font-medium text-foreground">
								Full Address *
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
					entering={FadeInUp.delay(300).springify()}
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

			{/* Province Modal */}
			{showProvinceModal && (
				<SelectModal
					title="Select Province"
					options={provinces.map((p) => ({
						id: p.province_id,
						label: p.province,
					}))}
					selectedId={provinceId}
					onSelect={handleProvinceSelect}
					onClose={() => setShowProvinceModal(false)}
					isLoading={provincesLoading}
					isLight={isLight}
				/>
			)}

			{/* City Modal */}
			{showCityModal && (
				<SelectModal
					title="Select City"
					options={cities.map((c) => ({
						id: c.city_id,
						label: `${c.type} ${c.city_name}`,
					}))}
					selectedId={cityId}
					onSelect={handleCitySelect}
					onClose={() => setShowCityModal(false)}
					isLoading={citiesLoading}
					isLight={isLight}
				/>
			)}
		</GradientBackground>
	);
}
