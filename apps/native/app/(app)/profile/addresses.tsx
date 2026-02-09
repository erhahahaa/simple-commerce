import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Button, Spinner, useToast } from "heroui-native";
import { Alert, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
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
import {
	useAddresses,
	useDeleteAddress,
	useSetDefaultAddress,
} from "@/hooks/checkout";

type Address = {
	id: string;
	label: string;
	recipientName: string;
	phone: string;
	provinceName: string;
	cityName: string;
	district: string | null;
	postalCode: string;
	address: string;
	isDefault: boolean;
};

function AddressCard({
	address,
	onSetDefault,
	onDelete,
	isSettingDefault,
	isDeleting,
	isLight,
}: {
	address: Address;
	onSetDefault: () => void;
	onDelete: () => void;
	isSettingDefault: boolean;
	isDeleting: boolean;
	isLight: boolean;
}) {
	const handleDelete = () => {
		Alert.alert(
			"Delete Address",
			`Are you sure you want to delete "${address.label}"?`,
			[
				{ text: "Cancel", style: "cancel" },
				{ text: "Delete", style: "destructive", onPress: onDelete },
			],
		);
	};

	return (
		<StyledView
			className="mb-3 rounded-2xl p-4"
			style={{
				backgroundColor: isLight
					? "rgba(255,255,255,0.95)"
					: "rgba(30,30,45,0.95)",
				borderWidth: address.isDefault ? 2 : 0,
				borderColor: isLight ? "#667eea" : "#a855f7",
			}}
		>
			{/* Header */}
			<StyledView className="mb-3 flex-row items-center justify-between">
				<StyledView className="flex-row items-center">
					<StyledView
						className="mr-3 h-10 w-10 items-center justify-center rounded-full"
						style={{
							backgroundColor: isLight
								? "rgba(102,126,234,0.1)"
								: "rgba(168,85,247,0.1)",
						}}
					>
						<Ionicons
							name="location"
							size={20}
							color={isLight ? "#667eea" : "#a855f7"}
						/>
					</StyledView>
					<StyledView>
						<StyledText className="font-semibold text-foreground">
							{address.label}
						</StyledText>
						{address.isDefault && (
							<StyledView className="mt-0.5 flex-row items-center">
								<Ionicons
									name="checkmark-circle"
									size={12}
									color={isLight ? "#667eea" : "#a855f7"}
								/>
								<StyledText
									className="ml-1 text-xs"
									style={{ color: isLight ? "#667eea" : "#a855f7" }}
								>
									Default
								</StyledText>
							</StyledView>
						)}
					</StyledView>
				</StyledView>

				{/* Actions */}
				<StyledView className="flex-row">
					{!address.isDefault && (
						<TouchableOpacity
							onPress={onSetDefault}
							disabled={isSettingDefault}
							style={{ marginRight: 8 }}
						>
							{isSettingDefault ? (
								<Spinner size="sm" />
							) : (
								<Ionicons
									name="star-outline"
									size={22}
									color={isLight ? "#9ca3af" : "#6b7280"}
								/>
							)}
						</TouchableOpacity>
					)}
					<TouchableOpacity onPress={handleDelete} disabled={isDeleting}>
						{isDeleting ? (
							<Spinner size="sm" />
						) : (
							<Ionicons name="trash-outline" size={22} color="#ef4444" />
						)}
					</TouchableOpacity>
				</StyledView>
			</StyledView>

			{/* Recipient Info */}
			<StyledView className="mb-2">
				<StyledText className="font-medium text-foreground">
					{address.recipientName}
				</StyledText>
				<StyledText className="text-muted text-sm">{address.phone}</StyledText>
			</StyledView>

			{/* Address Details */}
			<StyledText className="text-muted text-sm">{address.address}</StyledText>
			<StyledText className="mt-1 text-muted text-sm">
				{address.district ? `${address.district}, ` : ""}
				{address.cityName}, {address.provinceName} {address.postalCode}
			</StyledText>
		</StyledView>
	);
}

export default function AddressesScreen() {
	const insets = useSafeAreaInsets();
	const { isLight } = useAppTheme();
	const { toast } = useToast();

	const {
		data: addresses,
		isLoading,
		// refetch
	} = useAddresses();
	const setDefaultMutation = useSetDefaultAddress();
	const deleteMutation = useDeleteAddress();

	const handleSetDefault = (id: string) => {
		setDefaultMutation.mutate(
			{ id },
			{
				onSuccess: () => {
					toast.show({
						variant: "success",
						label: "Default address updated",
					});
				},
				onError: (error) => {
					toast.show({
						variant: "danger",
						label: "Failed to update default",
						description: error.message,
					});
				},
			},
		);
	};

	const handleDelete = (id: string) => {
		deleteMutation.mutate(
			{ id },
			{
				onSuccess: () => {
					toast.show({
						variant: "success",
						label: "Address deleted",
					});
				},
				onError: (error) => {
					toast.show({
						variant: "danger",
						label: "Failed to delete address",
						description: error.message,
					});
				},
			},
		);
	};

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
					className="flex-row items-center justify-between px-5 pb-4"
				>
					<StyledView className="flex-row items-center">
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
							My Addresses
						</StyledText>
					</StyledView>

					<StyledPressable
						className="h-10 w-10 items-center justify-center rounded-full"
						style={{
							backgroundColor: isLight ? "#667eea" : "#a855f7",
						}}
						onPress={() => router.push("/(app)/checkout/address/new")}
					>
						<Ionicons name="add" size={24} color="white" />
					</StyledPressable>
				</AnimatedView>

				{isLoading ? (
					<StyledView className="flex-1 items-center justify-center">
						<Spinner size="lg" />
					</StyledView>
				) : addresses && addresses.length > 0 ? (
					<KeyboardAwareScrollView
						className="flex-1 px-5"
						showsVerticalScrollIndicator={false}
						bottomOffset={20}
						contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
					>
						<AnimatedView entering={FadeInUp.duration(200)}>
							{addresses.map((address, _index) => (
								<AddressCard
									key={address.id}
									address={address as Address}
									onSetDefault={() => handleSetDefault(address.id)}
									onDelete={() => handleDelete(address.id)}
									isSettingDefault={
										setDefaultMutation.isPending &&
										setDefaultMutation.variables?.id === address.id
									}
									isDeleting={
										deleteMutation.isPending &&
										deleteMutation.variables?.id === address.id
									}
									isLight={isLight}
								/>
							))}
						</AnimatedView>
					</KeyboardAwareScrollView>
				) : (
					<StyledView className="flex-1 items-center justify-center px-5">
						<AnimatedView
							entering={FadeInUp.duration(200)}
							className="items-center"
						>
							<StyledView
								className="mb-4 h-20 w-20 items-center justify-center rounded-full"
								style={{
									backgroundColor: isLight
										? "rgba(102,126,234,0.1)"
										: "rgba(168,85,247,0.1)",
								}}
							>
								<Ionicons
									name="location-outline"
									size={40}
									color={isLight ? "#667eea" : "#a855f7"}
								/>
							</StyledView>
							<StyledText className="mb-2 font-semibold text-foreground text-lg">
								No addresses yet
							</StyledText>
							<StyledText className="mb-6 text-center text-muted">
								Add your first address to enable faster checkout
							</StyledText>
							<Button
								size="lg"
								onPress={() => router.push("/(app)/checkout/address/new")}
							>
								<Ionicons
									name="add"
									size={18}
									color="white"
									style={{ marginRight: 8 }}
								/>
								<Button.Label>Add Address</Button.Label>
							</Button>
						</AnimatedView>
					</StyledView>
				)}
			</StyledView>
		</GradientBackground>
	);
}
