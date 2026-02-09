import { Ionicons } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { router } from "expo-router";
import { Button, Spinner, useToast } from "heroui-native";
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
import { useCart } from "@/hooks/cart";
import { useAddresses, useCheckout, useShippingCost } from "@/hooks/checkout";

// Store origin city ID (should be from env/config in production)
const STORE_ORIGIN_CITY_ID = "501"; // Example: Yogyakarta

// Default product weight in grams (should come from products in production)
const DEFAULT_PRODUCT_WEIGHT = 500;

function formatPrice(price: number) {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(price);
}

type AddressType = {
	id: string;
	label: string;
	recipientName: string;
	phone: string;
	cityId: string;
	cityName: string;
	provinceName: string;
	postalCode: string;
	address: string;
	isDefault: boolean;
};

type ShippingOption = {
	courier: string;
	courierName: string;
	service: string;
	description: string;
	cost: number;
	etd: string;
};

interface AddressCardProps {
	address: AddressType;
	isSelected: boolean;
	onSelect: () => void;
	isLight: boolean;
}

function AddressCard({
	address,
	isSelected,
	onSelect,
	isLight,
}: AddressCardProps) {
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
					<StyledView className="flex-row items-center">
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
					</StyledView>
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
				<StyledText className="mt-2 font-medium text-foreground">
					{address.recipientName}
				</StyledText>
				<StyledText className="text-muted text-sm">{address.phone}</StyledText>
				<StyledText className="mt-1 text-muted text-sm">
					{address.address}
				</StyledText>
				<StyledText className="text-muted text-sm">
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
						{formatPrice(option.cost)}
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
	const [selectedCourier, setSelectedCourier] = useState<
		"jne" | "pos" | "tiki"
	>("jne");

	// Get cart data
	const { data: cartData, isLoading: cartLoading } = useCart();
	const cartItems = cartData?.cart?.items ?? [];
	const subtotal = cartData?.subtotal ?? 0;
	const itemCount = cartData?.itemCount ?? 0;

	// Get addresses
	const { data: addressesData, isLoading: addressesLoading } = useAddresses();
	const addresses = (addressesData as AddressType[] | undefined) ?? [];

	// Set default address on load
	const defaultAddress = addresses.find((a) => a.isDefault);
	if (defaultAddress && !selectedAddressId && addresses.length > 0) {
		setSelectedAddressId(defaultAddress.id);
	}

	const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

	// Calculate total weight (in production, sum product weights)
	const totalWeight = itemCount * DEFAULT_PRODUCT_WEIGHT;

	// Get shipping costs
	const { data: shippingData, isLoading: shippingLoading } = useShippingCost({
		origin: STORE_ORIGIN_CITY_ID,
		destination: selectedAddress?.cityId ?? "",
		weight: totalWeight,
		courier: selectedCourier,
		enabled: !!selectedAddress?.cityId,
	});

	// Parse shipping options
	const shippingOptions: ShippingOption[] = [];
	if (shippingData && Array.isArray(shippingData)) {
		for (const courier of shippingData) {
			const courierData = courier as {
				code: string;
				name: string;
				costs: Array<{
					service: string;
					description: string;
					cost: Array<{ value: number; etd: string }>;
				}>;
			};
			for (const service of courierData.costs) {
				if (service.cost[0]) {
					shippingOptions.push({
						courier: courierData.code,
						courierName: courierData.name,
						service: service.service,
						description: service.description,
						cost: service.cost[0].value,
						etd: service.cost[0].etd,
					});
				}
			}
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
		!checkoutMutation.isPending;

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
					style={{ paddingTop: insets.top }}
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
					<StyledText className="font-bold text-2xl text-foreground">
						Checkout
					</StyledText>
				</AnimatedView>

				<ScrollView
					className="flex-1 px-5"
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: 200 }}
				>
					{/* Shipping Address Section */}
					<AnimatedView entering={FadeInUp.delay(200).springify()}>
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
									isLight={isLight}
								/>
							))
						)}
					</AnimatedView>

					{/* Shipping Method Section */}
					{selectedAddress && (
						<AnimatedView
							entering={FadeInUp.delay(300).springify()}
							className="mt-6"
						>
							<StyledText className="mb-2 font-semibold text-foreground text-lg">
								Shipping Method
							</StyledText>

							{/* Courier Selection */}
							<StyledView className="mb-3 flex-row gap-2">
								{(["jne", "pos", "tiki"] as const).map((courier) => (
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
												{courier.toUpperCase()}
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
					<AnimatedView
						entering={FadeInUp.delay(400).springify()}
						className="mt-6"
					>
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
									{formatPrice(subtotal)}
								</StyledText>
							</StyledView>
							<StyledView className="mt-2 flex-row justify-between">
								<StyledText className="text-muted">Shipping</StyledText>
								<StyledText className="font-medium text-foreground">
									{selectedShipping
										? formatPrice(shippingCost)
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
									{formatPrice(totalAmount)}
								</StyledText>
							</StyledView>
						</StyledView>
					</AnimatedView>
				</ScrollView>

				{/* Bottom Action */}
				<AnimatedView
					entering={FadeInUp.delay(500).springify()}
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
								<Button.Label>Pay {formatPrice(totalAmount)}</Button.Label>
							</>
						)}
					</Button>
				</AnimatedView>
			</StyledView>
		</GradientBackground>
	);
}
