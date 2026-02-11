import { Ionicons } from "@expo/vector-icons";
import type { Address, Courier } from "@simple-commerce/schema";
import type { Href } from "expo-router";
import { router } from "expo-router";
import { Button, Spinner, useToast } from "heroui-native";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
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
import { config, formatCurrency } from "@/config";
import { useAppTheme } from "@/contexts/app-theme-context";
import { useCart } from "@/hooks/cart";
import { useAddresses, useCheckout, useShippingCost } from "@/hooks/checkout";

type ShippingOption = {
	courier: string;
	courierName: string;
	service: string;
	description: string;
	cost: number;
	etd: string;
};

// Courier display names
const COURIER_NAMES: Record<Courier, string> = {
	jne: "JNE",
	sicepat: "SiCepat",
	jnt: "J&T",
};

interface AddressCardProps {
	address: Address;
	isSelected: boolean;
	onSelect: () => void;
	onEdit: () => void;
	isLight: boolean;
}

function AddressCard({
	address,
	isSelected,
	onSelect,
	onEdit,
	isLight,
}: AddressCardProps) {
	// Use explicit null check to handle destinationId: 0 correctly
	const needsUpdate = address.destinationId === null;

	return (
		<TouchableOpacity onPress={onSelect} activeOpacity={0.7}>
			<StyledView
				className="mb-3 rounded-xl p-4"
				style={{
					backgroundColor: isLight
						? "rgba(255,255,255,0.9)"
						: "rgba(30,30,45,0.9)",
					borderWidth: isSelected ? 2 : 1,
					borderColor: isSelected
						? isLight
							? "#667eea"
							: "#a855f7"
						: isLight
							? "rgba(0,0,0,0.1)"
							: "rgba(255,255,255,0.1)",
				}}
			>
				<StyledView className="flex-row items-center justify-between">
					<StyledView className="flex-1 flex-row items-center">
						<StyledText className="font-semibold text-foreground">
							{address.label}
						</StyledText>
						{address.isDefault && (
							<StyledView
								className="ml-2 rounded-full px-2 py-0.5"
								style={{
									backgroundColor: isLight
										? "rgba(102,126,234,0.1)"
										: "rgba(168,85,247,0.1)",
								}}
							>
								<StyledText
									className="font-medium text-xs"
									style={{ color: isLight ? "#667eea" : "#a855f7" }}
								>
									Default
								</StyledText>
							</StyledView>
						)}
						{needsUpdate && (
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
									Update Required
								</StyledText>
							</StyledView>
						)}
					</StyledView>
					<StyledView className="flex-row items-center gap-2">
						<TouchableOpacity
							onPress={(e) => {
								e.stopPropagation();
								onEdit();
							}}
							hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
						>
							<Ionicons
								name="pencil-outline"
								size={18}
								color={isLight ? "#667eea" : "#a855f7"}
							/>
						</TouchableOpacity>
						<StyledView
							className="h-5 w-5 items-center justify-center rounded-full"
							style={{
								borderWidth: 2,
								borderColor: isSelected
									? isLight
										? "#667eea"
										: "#a855f7"
									: isLight
										? "#d1d5db"
										: "#4b5563",
								backgroundColor: isSelected
									? isLight
										? "#667eea"
										: "#a855f7"
									: "transparent",
							}}
						>
							{isSelected && (
								<Ionicons name="checkmark" size={12} color="white" />
							)}
						</StyledView>
					</StyledView>
				</StyledView>
				<StyledText className="mt-2 font-medium text-foreground">
					{address.recipientName}
				</StyledText>
				<StyledText className="text-muted text-sm">{address.phone}</StyledText>
				<StyledText className="mt-1 text-muted text-sm">
					{address.address}
				</StyledText>
				<StyledText className="text-muted text-sm">
					{address.subdistrictName && `${address.subdistrictName}, `}
					{address.districtName && `${address.districtName}, `}
					{address.cityName}, {address.provinceName} {address.postalCode}
				</StyledText>
			</StyledView>
		</TouchableOpacity>
	);
}

interface ShippingCardProps {
	option: ShippingOption;
	isSelected: boolean;
	onSelect: () => void;
	isLight: boolean;
}

function ShippingCard({
	option,
	isSelected,
	onSelect,
	isLight,
}: ShippingCardProps) {
	return (
		<TouchableOpacity onPress={onSelect} activeOpacity={0.7}>
			<StyledView
				className="mb-3 flex-row items-center justify-between rounded-xl p-4"
				style={{
					backgroundColor: isLight
						? "rgba(255,255,255,0.9)"
						: "rgba(30,30,45,0.9)",
					borderWidth: isSelected ? 2 : 1,
					borderColor: isSelected
						? isLight
							? "#667eea"
							: "#a855f7"
						: isLight
							? "rgba(0,0,0,0.1)"
							: "rgba(255,255,255,0.1)",
				}}
			>
				<StyledView className="flex-1">
					<StyledView className="flex-row items-center">
						<StyledText className="font-semibold text-foreground">
							{option.courierName.toUpperCase()} {option.service}
						</StyledText>
					</StyledView>
					<StyledText className="mt-1 text-muted text-sm">
						{option.description}
					</StyledText>
					<StyledText className="text-muted text-xs">
						Est. {option.etd} days
					</StyledText>
				</StyledView>
				<StyledView className="items-end">
					<StyledText
						className="font-bold"
						style={{ color: isLight ? "#667eea" : "#a855f7" }}
					>
						{formatCurrency(option.cost)}
					</StyledText>
					<StyledView
						className="mt-2 h-5 w-5 items-center justify-center rounded-full"
						style={{
							borderWidth: 2,
							borderColor: isSelected
								? isLight
									? "#667eea"
									: "#a855f7"
								: isLight
									? "#d1d5db"
									: "#4b5563",
							backgroundColor: isSelected
								? isLight
									? "#667eea"
									: "#a855f7"
								: "transparent",
						}}
					>
						{isSelected && (
							<Ionicons name="checkmark" size={12} color="white" />
						)}
					</StyledView>
				</StyledView>
			</StyledView>
		</TouchableOpacity>
	);
}

export default function CheckoutScreen() {
	const insets = useSafeAreaInsets();
	const { isLight } = useAppTheme();
	const { toast } = useToast();

	const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
		null,
	);
	const [selectedShipping, setSelectedShipping] =
		useState<ShippingOption | null>(null);
	const [selectedCourier, setSelectedCourier] = useState<Courier>("jne");

	// Get cart data
	const { data: cartData, isLoading: cartLoading } = useCart();
	const cartItems = cartData?.cart?.items ?? [];
	const subtotal = cartData?.subtotal ?? 0;
	const itemCount = cartData?.itemCount ?? 0;

	// Get addresses
	const { data: addressesData, isLoading: addressesLoading } = useAddresses();
	const addresses = addressesData ?? [];

	// Set default address on load - use useEffect to avoid state updates during render
	useEffect(() => {
		if (addresses.length > 0 && !selectedAddressId) {
			const defaultAddr = addresses.find((a) => a.isDefault);
			if (defaultAddr) {
				setSelectedAddressId(defaultAddr.id);
			}
		}
	}, [addresses, selectedAddressId]);

	const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

	// Check if selected address needs to be updated (use explicit null check for destinationId: 0)
	const addressNeedsUpdate =
		selectedAddress && selectedAddress.destinationId === null;

	// Calculate total weight (in production, sum product weights)
	const totalWeight = itemCount * config.checkout.defaultProductWeight;

	// Get shipping costs using V2 API (destination IDs)
	const { data: shippingData, isLoading: shippingLoading } = useShippingCost({
		origin: config.checkout.storeOriginDestinationId,
		destination: selectedAddress?.destinationId ?? 0,
		weight: totalWeight,
		courier: selectedCourier,
		enabled:
			!!selectedAddress?.destinationId &&
			config.checkout.storeOriginDestinationId > 0,
	});

	// Parse shipping options (V2 format is flat, not nested)
	const shippingOptions: ShippingOption[] = [];
	if (shippingData && Array.isArray(shippingData)) {
		for (const item of shippingData) {
			shippingOptions.push({
				courier: item.code,
				courierName: item.name,
				service: item.service,
				description: item.description,
				cost: item.cost,
				etd: item.etd,
			});
		}
	}

	// Checkout mutation
	const checkoutMutation = useCheckout();

	const shippingCost = selectedShipping?.cost ?? 0;
	const totalAmount = subtotal + shippingCost;

	const canCheckout =
		selectedAddressId &&
		selectedShipping &&
		cartItems.length > 0 &&
		!checkoutMutation.isPending &&
		!addressNeedsUpdate;

	const handleCheckout = () => {
		if (!selectedAddressId || !selectedShipping) return;

		// Parse ETD to get estimated days
		const etdMatch = selectedShipping.etd.match(/(\d+)/);
		const estimatedDays = etdMatch
			? Number.parseInt(etdMatch[1], 10)
			: undefined;

		checkoutMutation.mutate(
			{
				addressId: selectedAddressId,
				courier: selectedShipping.courier,
				service: selectedShipping.service,
				shippingCost: selectedShipping.cost,
				estimatedDays,
			},
			{
				onSuccess: (data) => {
					// Navigate to payment WebView with snap URL
					router.push({
						pathname: "/checkout/payment" as Href,
						params: {
							snapUrl: data.snapUrl,
							orderId: data.order.id,
						},
					} as never);
				},
				onError: (error) => {
					toast.show({
						variant: "danger",
						label: "Checkout failed",
						description: error.message,
					});
				},
			},
		);
	};

	const isLoading = cartLoading || addressesLoading;

	if (isLoading) {
		return (
			<GradientBackground variant="app">
				<StyledView className="flex-1 items-center justify-center">
					<Spinner size="lg" />
				</StyledView>
			</GradientBackground>
		);
	}

	if (cartItems.length === 0) {
		return (
			<GradientBackground variant="app">
				<StyledView
					className="flex-1 items-center justify-center px-8"
					style={{
						paddingTop: insets.top + 10,
					}}
				>
					<Ionicons
						name="cart-outline"
						size={80}
						color={isLight ? "#9ca3af" : "#6b7280"}
					/>
					<StyledText className="mt-4 text-center font-semibold text-foreground text-lg">
						Your cart is empty
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
			<StyledView className="flex-1" style={{ paddingTop: insets.top + 10 }}>
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
					<StyledText className="font-bold text-2xl text-foreground">
						Checkout
					</StyledText>
				</AnimatedView>

				<KeyboardAwareScrollView
					className="flex-1 px-5"
					showsVerticalScrollIndicator={false}
					bottomOffset={20}
					contentContainerStyle={{ paddingBottom: 200 }}
				>
					{/* Shipping Address Section */}
					<AnimatedView entering={FadeInUp.duration(200)}>
						<StyledView className="mb-2 flex-row items-center justify-between">
							<StyledText className="font-semibold text-foreground text-lg">
								Shipping Address
							</StyledText>
							<TouchableOpacity
								onPress={() => router.push("/checkout/address/new" as Href)}
							>
								<StyledText
									className="font-medium"
									style={{ color: isLight ? "#667eea" : "#a855f7" }}
								>
									+ Add New
								</StyledText>
							</TouchableOpacity>
						</StyledView>

						{addresses.length === 0 ? (
							<StyledView
								className="items-center rounded-xl p-6"
								style={{
									backgroundColor: isLight
										? "rgba(255,255,255,0.9)"
										: "rgba(30,30,45,0.9)",
								}}
							>
								<Ionicons
									name="location-outline"
									size={40}
									color={isLight ? "#9ca3af" : "#6b7280"}
								/>
								<StyledText className="mt-2 text-center text-muted">
									No addresses found
								</StyledText>
								<Button
									className="mt-4"
									size="sm"
									onPress={() => router.push("/checkout/address/new" as Href)}
								>
									<Button.Label>Add Address</Button.Label>
								</Button>
							</StyledView>
						) : (
							addresses.map((address) => (
								<AddressCard
									key={address.id}
									address={address}
									isSelected={selectedAddressId === address.id}
									onSelect={() => {
										setSelectedAddressId(address.id);
										setSelectedShipping(null); // Reset shipping when address changes
									}}
									onEdit={() =>
										router.push(`/checkout/address/${address.id}/edit` as Href)
									}
									isLight={isLight}
								/>
							))
						)}
					</AnimatedView>

					{/* Address Update Warning */}
					{addressNeedsUpdate && (
						<AnimatedView entering={FadeInUp.duration(200)} className="mt-4">
							<StyledView
								className="rounded-xl p-4"
								style={{
									backgroundColor: isLight
										? "rgba(239,68,68,0.1)"
										: "rgba(239,68,68,0.2)",
									borderWidth: 1,
									borderColor: "rgba(239,68,68,0.3)",
								}}
							>
								<StyledView className="flex-row items-center">
									<Ionicons
										name="warning-outline"
										size={20}
										color="#ef4444"
										style={{ marginRight: 8 }}
									/>
									<StyledText
										className="flex-1 font-medium"
										style={{ color: "#ef4444" }}
									>
										Address Update Required
									</StyledText>
								</StyledView>
								<StyledText className="mt-2 text-muted text-sm">
									This address needs to be updated with more precise location
									data to calculate shipping costs accurately.
								</StyledText>
								<Button
									className="mt-3"
									size="sm"
									variant="outline"
									onPress={() =>
										router.push(
											`/checkout/address/${selectedAddressId}/edit` as Href,
										)
									}
								>
									<Button.Label>Update Address</Button.Label>
								</Button>
							</StyledView>
						</AnimatedView>
					)}

					{/* Store Origin Warning */}
					{config.checkout.storeOriginDestinationId === 0 && (
						<AnimatedView entering={FadeInUp.duration(200)} className="mt-4">
							<StyledView
								className="rounded-xl p-4"
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
										name="alert-circle-outline"
										size={20}
										color="#f59e0b"
										style={{ marginRight: 8 }}
									/>
									<StyledText
										className="flex-1 font-medium"
										style={{ color: "#f59e0b" }}
									>
										Store Origin Not Configured
									</StyledText>
								</StyledView>
								<StyledText className="mt-2 text-muted text-sm">
									The store origin destination ID needs to be configured to
									calculate shipping costs.
								</StyledText>
							</StyledView>
						</AnimatedView>
					)}

					{/* Shipping Method Section */}
					{selectedAddress && !addressNeedsUpdate && (
						<AnimatedView entering={FadeInUp.duration(200)} className="mt-6">
							<StyledText className="mb-2 font-semibold text-foreground text-lg">
								Shipping Method
							</StyledText>

							{/* Courier Selection */}
							<StyledView className="mb-3 flex-row gap-2">
								{config.checkout.supportedCouriers.map((courier) => (
									<TouchableOpacity
										key={courier}
										onPress={() => {
											setSelectedCourier(courier);
											setSelectedShipping(null);
										}}
									>
										<StyledView
											className="rounded-lg px-4 py-2"
											style={{
												backgroundColor:
													selectedCourier === courier
														? isLight
															? "#667eea"
															: "#a855f7"
														: isLight
															? "rgba(255,255,255,0.9)"
															: "rgba(30,30,45,0.9)",
											}}
										>
											<StyledText
												className="font-semibold"
												style={{
													color:
														selectedCourier === courier
															? "white"
															: isLight
																? "#374151"
																: "#d1d5db",
												}}
											>
												{COURIER_NAMES[courier]}
											</StyledText>
										</StyledView>
									</TouchableOpacity>
								))}
							</StyledView>

							{shippingLoading ? (
								<StyledView className="items-center py-8">
									<Spinner size="sm" />
									<StyledText className="mt-2 text-muted">
										Loading shipping options...
									</StyledText>
								</StyledView>
							) : shippingOptions.length === 0 ? (
								<StyledView
									className="items-center rounded-xl p-6"
									style={{
										backgroundColor: isLight
											? "rgba(255,255,255,0.9)"
											: "rgba(30,30,45,0.9)",
									}}
								>
									<StyledText className="text-center text-muted">
										No shipping options available
									</StyledText>
								</StyledView>
							) : (
								shippingOptions.map((option) => (
									<ShippingCard
										key={`${option.courier}-${option.service}`}
										option={option}
										isSelected={
											selectedShipping?.courier === option.courier &&
											selectedShipping?.service === option.service
										}
										onSelect={() => setSelectedShipping(option)}
										isLight={isLight}
									/>
								))
							)}
						</AnimatedView>
					)}

					{/* Order Summary */}
					<AnimatedView entering={FadeInUp.duration(200)} className="mt-6">
						<StyledText className="mb-2 font-semibold text-foreground text-lg">
							Order Summary
						</StyledText>
						<StyledView
							className="rounded-xl p-4"
							style={{
								backgroundColor: isLight
									? "rgba(255,255,255,0.9)"
									: "rgba(30,30,45,0.9)",
							}}
						>
							<StyledView className="flex-row justify-between">
								<StyledText className="text-muted">
									Subtotal ({itemCount} items)
								</StyledText>
								<StyledText className="font-medium text-foreground">
									{formatCurrency(subtotal)}
								</StyledText>
							</StyledView>
							<StyledView className="mt-2 flex-row justify-between">
								<StyledText className="text-muted">Shipping</StyledText>
								<StyledText className="font-medium text-foreground">
									{selectedShipping
										? formatCurrency(shippingCost)
										: "Select shipping"}
								</StyledText>
							</StyledView>
							<StyledView
								className="my-3"
								style={{
									height: 1,
									backgroundColor: isLight
										? "rgba(0,0,0,0.1)"
										: "rgba(255,255,255,0.1)",
								}}
							/>
							<StyledView className="flex-row justify-between">
								<StyledText className="font-bold text-foreground text-lg">
									Total
								</StyledText>
								<StyledText
									className="font-bold text-lg"
									style={{ color: isLight ? "#667eea" : "#a855f7" }}
								>
									{formatCurrency(totalAmount)}
								</StyledText>
							</StyledView>
						</StyledView>
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
						isDisabled={!canCheckout}
						onPress={handleCheckout}
					>
						{checkoutMutation.isPending ? (
							<Spinner size="sm" color="white" />
						) : (
							<>
								<Ionicons
									name="card-outline"
									size={18}
									color="white"
									style={{ marginRight: 8 }}
								/>
								<Button.Label>Pay {formatCurrency(totalAmount)}</Button.Label>
							</>
						)}
					</Button>
				</AnimatedView>
			</StyledView>
		</GradientBackground>
	);
}
