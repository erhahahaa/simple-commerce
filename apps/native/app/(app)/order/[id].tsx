import { Ionicons } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { router, useLocalSearchParams } from "expo-router";
import { Button, Spinner, useToast } from "heroui-native";
import { Image, Linking, ScrollView, TouchableOpacity } from "react-native";
import { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientBackground } from "@/components/gradient-background";
import { AnimatedView, StyledText, StyledView } from "@/components/uniwind";
import { useAppTheme } from "@/contexts/app-theme-context";
import { useCancelOrder, useOrderById } from "@/hooks/checkout";

type OrderStatus =
	| "pending"
	| "processing"
	| "shipped"
	| "delivered"
	| "cancelled";
type PaymentStatus = "pending" | "paid" | "failed" | "expired" | "refunded";
type ShippingStatus =
	| "pending"
	| "processing"
	| "shipped"
	| "in_transit"
	| "delivered"
	| "returned";

function formatPrice(price: number) {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(price);
}

function formatDate(date: Date) {
	return new Intl.DateTimeFormat("id-ID", {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));
}

function formatShortDate(date: Date) {
	return new Intl.DateTimeFormat("id-ID", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(date));
}

function getStatusColor(status: OrderStatus) {
	switch (status) {
		case "pending":
			return { bg: "rgba(234, 179, 8, 0.1)", text: "#eab308" };
		case "processing":
			return { bg: "rgba(59, 130, 246, 0.1)", text: "#3b82f6" };
		case "shipped":
			return { bg: "rgba(168, 85, 247, 0.1)", text: "#a855f7" };
		case "delivered":
			return { bg: "rgba(34, 197, 94, 0.1)", text: "#22c55e" };
		case "cancelled":
			return { bg: "rgba(239, 68, 68, 0.1)", text: "#ef4444" };
		default:
			return { bg: "rgba(107, 114, 128, 0.1)", text: "#6b7280" };
	}
}

function getPaymentStatusColor(status: PaymentStatus) {
	switch (status) {
		case "paid":
			return { bg: "rgba(34, 197, 94, 0.1)", text: "#22c55e" };
		case "pending":
			return { bg: "rgba(234, 179, 8, 0.1)", text: "#eab308" };
		case "failed":
		case "expired":
			return { bg: "rgba(239, 68, 68, 0.1)", text: "#ef4444" };
		case "refunded":
			return { bg: "rgba(107, 114, 128, 0.1)", text: "#6b7280" };
		default:
			return { bg: "rgba(107, 114, 128, 0.1)", text: "#6b7280" };
	}
}

function getShippingStatusColor(status: ShippingStatus) {
	switch (status) {
		case "pending":
			return { bg: "rgba(234, 179, 8, 0.1)", text: "#eab308" };
		case "processing":
			return { bg: "rgba(59, 130, 246, 0.1)", text: "#3b82f6" };
		case "shipped":
		case "in_transit":
			return { bg: "rgba(168, 85, 247, 0.1)", text: "#a855f7" };
		case "delivered":
			return { bg: "rgba(34, 197, 94, 0.1)", text: "#22c55e" };
		case "returned":
			return { bg: "rgba(239, 68, 68, 0.1)", text: "#ef4444" };
		default:
			return { bg: "rgba(107, 114, 128, 0.1)", text: "#6b7280" };
	}
}

function getStatusIcon(status: OrderStatus): keyof typeof Ionicons.glyphMap {
	switch (status) {
		case "pending":
			return "time-outline";
		case "processing":
			return "sync-outline";
		case "shipped":
			return "airplane-outline";
		case "delivered":
			return "checkmark-circle-outline";
		case "cancelled":
			return "close-circle-outline";
		default:
			return "help-circle-outline";
	}
}

// Shipping status timeline steps
const SHIPPING_STEPS: { status: ShippingStatus; label: string }[] = [
	{ status: "pending", label: "Order Placed" },
	{ status: "processing", label: "Processing" },
	{ status: "shipped", label: "Shipped" },
	{ status: "in_transit", label: "In Transit" },
	{ status: "delivered", label: "Delivered" },
];

function getShippingStepIndex(status: ShippingStatus): number {
	const index = SHIPPING_STEPS.findIndex((step) => step.status === status);
	return index === -1 ? 0 : index;
}

export default function OrderDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const insets = useSafeAreaInsets();
	const { isLight } = useAppTheme();
	const { toast } = useToast();

	const { data: order, isLoading, refetch } = useOrderById(id ?? "");
	const cancelMutation = useCancelOrder();

	const handleBack = () => {
		if (router.canGoBack()) {
			router.back();
		} else {
			router.replace("/(app)/(tabs)/orders" as Href);
		}
	};

	const handleCancelOrder = async () => {
		if (!order) return;

		try {
			await cancelMutation.mutateAsync({ orderId: order.id });
			toast.show({
				label: "Order Cancelled",
				description: "Your order has been cancelled successfully",
				variant: "success",
			});
			refetch();
		} catch (error) {
			toast.show({
				label: "Error",
				description:
					error instanceof Error ? error.message : "Failed to cancel order",
				variant: "danger",
			});
		}
	};

	const handlePayNow = () => {
		if (!order?.snapUrl) return;
		router.push({
			pathname: "/checkout/payment" as Href,
			params: {
				snapUrl: order.snapUrl,
				orderId: order.id,
			},
		} as never);
	};

	const handleTrackShipment = () => {
		if (!order?.shipping?.trackingNumber) return;
		// Open courier tracking URL based on courier
		const courier = order.shipping.courier.toLowerCase();
		const trackingNumber = order.shipping.trackingNumber;
		let trackingUrl = "";

		switch (courier) {
			case "jne":
				trackingUrl = `https://www.jne.co.id/id/tracking/trace/${trackingNumber}`;
				break;
			case "tiki":
				trackingUrl = `https://www.tiki.id/id/tracking?awb=${trackingNumber}`;
				break;
			case "pos":
				trackingUrl = `https://www.posindonesia.co.id/id/tracking/${trackingNumber}`;
				break;
			default:
				trackingUrl = `https://www.google.com/search?q=${courier}+tracking+${trackingNumber}`;
		}

		Linking.openURL(trackingUrl);
	};

	const cardBg = isLight ? "rgba(255,255,255,0.9)" : "rgba(30,30,45,0.9)";
	const borderColor = isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)";
	const accentColor = isLight ? "#667eea" : "#a855f7";

	if (isLoading) {
		return (
			<GradientBackground variant="app">
				<StyledView
					className="flex-1 items-center justify-center"
					style={{ paddingTop: insets.top }}
				>
					<Spinner size="lg" />
				</StyledView>
			</GradientBackground>
		);
	}

	if (!order) {
		return (
			<GradientBackground variant="app">
				<StyledView
					className="flex-1 items-center justify-center px-8"
					style={{ paddingTop: insets.top }}
				>
					<Ionicons
						name="receipt-outline"
						size={80}
						color={isLight ? "#9ca3af" : "#6b7280"}
					/>
					<StyledText className="mt-4 text-center font-semibold text-foreground text-lg">
						Order not found
					</StyledText>
					<StyledText className="mt-2 text-center text-muted">
						This order may have been deleted or you don't have access to it.
					</StyledText>
					<Button className="mt-6" onPress={handleBack}>
						<Button.Label>Go Back</Button.Label>
					</Button>
				</StyledView>
			</GradientBackground>
		);
	}

	const statusColor = getStatusColor(order.status as OrderStatus);
	const paymentColor = getPaymentStatusColor(
		order.paymentStatus as PaymentStatus,
	);
	const canCancel =
		order.status === "pending" && order.paymentStatus === "pending";
	const canPay = order.paymentStatus === "pending" && order.snapUrl;
	const canTrack =
		order.shipping?.trackingNumber &&
		(order.status === "shipped" || order.shipping.status === "in_transit");

	const currentShippingStep = order.shipping
		? getShippingStepIndex(order.shipping.status as ShippingStatus)
		: 0;

	return (
		<GradientBackground variant="app">
			<StyledView className="flex-1" style={{ paddingTop: insets.top }}>
				{/* Header */}
				<AnimatedView
					entering={FadeInDown.delay(100).springify()}
					className="flex-row items-center px-5 pb-4"
				>
					<TouchableOpacity onPress={handleBack} className="mr-3">
						<Ionicons
							name="arrow-back"
							size={24}
							color={isLight ? "#374151" : "#d1d5db"}
						/>
					</TouchableOpacity>
					<StyledView className="flex-1">
						<StyledText className="font-bold text-foreground text-lg">
							Order Details
						</StyledText>
						<StyledText className="text-muted text-xs">
							{order.midtransOrderId ?? order.id.slice(0, 16)}
						</StyledText>
					</StyledView>
					<StyledView className="flex-row gap-2">
						<StyledView
							className="rounded-full px-2 py-1"
							style={{ backgroundColor: paymentColor.bg }}
						>
							<StyledText
								className="font-medium text-xs capitalize"
								style={{ color: paymentColor.text }}
							>
								{order.paymentStatus}
							</StyledText>
						</StyledView>
						<StyledView
							className="rounded-full px-2 py-1"
							style={{ backgroundColor: statusColor.bg }}
						>
							<StyledText
								className="font-medium text-xs capitalize"
								style={{ color: statusColor.text }}
							>
								{order.status}
							</StyledText>
						</StyledView>
					</StyledView>
				</AnimatedView>

				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{
						paddingHorizontal: 20,
						paddingBottom: insets.bottom + 100,
					}}
				>
					{/* Order Status Card */}
					<AnimatedView
						entering={FadeInUp.delay(150).springify()}
						className="mb-4 rounded-2xl p-4"
						style={{ backgroundColor: cardBg }}
					>
						<StyledView className="flex-row items-center">
							<StyledView
								className="mr-4 h-14 w-14 items-center justify-center rounded-full"
								style={{ backgroundColor: statusColor.bg }}
							>
								<Ionicons
									name={getStatusIcon(order.status as OrderStatus)}
									size={28}
									color={statusColor.text}
								/>
							</StyledView>
							<StyledView className="flex-1">
								<StyledText className="font-semibold text-foreground text-lg capitalize">
									{order.status === "pending"
										? "Awaiting Payment"
										: order.status}
								</StyledText>
								<StyledText className="text-muted text-sm">
									{formatDate(order.createdAt)}
								</StyledText>
							</StyledView>
						</StyledView>
					</AnimatedView>

					{/* Shipping Timeline (if not cancelled) */}
					{order.status !== "cancelled" && order.shipping && (
						<AnimatedView
							entering={FadeInUp.delay(200).springify()}
							className="mb-4 rounded-2xl p-4"
							style={{ backgroundColor: cardBg }}
						>
							<StyledText className="mb-4 font-semibold text-foreground">
								Shipping Status
							</StyledText>
							<StyledView className="flex-row items-center justify-between">
								{SHIPPING_STEPS.map((step, index) => {
									const isCompleted = index <= currentShippingStep;
									const isCurrent = index === currentShippingStep;
									const isLast = index === SHIPPING_STEPS.length - 1;

									return (
										<StyledView
											key={step.status}
											className="flex-1 items-center"
										>
											<StyledView className="flex-row items-center">
												<StyledView
													className="h-6 w-6 items-center justify-center rounded-full"
													style={{
														backgroundColor: isCompleted
															? accentColor
															: borderColor,
													}}
												>
													{isCompleted ? (
														<Ionicons
															name="checkmark"
															size={14}
															color="white"
														/>
													) : (
														<StyledView
															className="h-2 w-2 rounded-full"
															style={{
																backgroundColor: isLight
																	? "#d1d5db"
																	: "#4b5563",
															}}
														/>
													)}
												</StyledView>
												{!isLast && (
													<StyledView
														className="h-0.5 flex-1"
														style={{
															backgroundColor: isCompleted
																? accentColor
																: borderColor,
															minWidth: 20,
														}}
													/>
												)}
											</StyledView>
											<StyledText
												className="mt-1 text-center text-xs"
												style={{
													color: isCurrent
														? accentColor
														: isLight
															? "#6b7280"
															: "#9ca3af",
													fontWeight: isCurrent ? "600" : "400",
												}}
												numberOfLines={1}
											>
												{step.label}
											</StyledText>
										</StyledView>
									);
								})}
							</StyledView>

							{/* Tracking Info */}
							{order.shipping.trackingNumber && (
								<StyledView
									className="mt-4 flex-row items-center justify-between rounded-xl p-3"
									style={{ backgroundColor: borderColor }}
								>
									<StyledView>
										<StyledText className="text-muted text-xs">
											Tracking Number
										</StyledText>
										<StyledText className="font-medium text-foreground">
											{order.shipping.trackingNumber}
										</StyledText>
									</StyledView>
									{canTrack && (
										<TouchableOpacity onPress={handleTrackShipment}>
											<StyledView
												className="flex-row items-center rounded-full px-3 py-1.5"
												style={{ backgroundColor: accentColor }}
											>
												<Ionicons
													name="locate-outline"
													size={14}
													color="white"
												/>
												<StyledText className="ml-1 font-medium text-white text-xs">
													Track
												</StyledText>
											</StyledView>
										</TouchableOpacity>
									)}
								</StyledView>
							)}

							{/* Courier Info */}
							<StyledView className="mt-3 flex-row items-center justify-between">
								<StyledView className="flex-row items-center">
									<Ionicons
										name="car-outline"
										size={18}
										color={isLight ? "#6b7280" : "#9ca3af"}
									/>
									<StyledText className="ml-2 text-muted">
										{order.shipping.courier.toUpperCase()}{" "}
										{order.shipping.service}
									</StyledText>
								</StyledView>
								{order.shipping.estimatedDays && (
									<StyledText className="text-muted text-sm">
										Est. {order.shipping.estimatedDays} days
									</StyledText>
								)}
							</StyledView>
						</AnimatedView>
					)}

					{/* Order Items */}
					<AnimatedView
						entering={FadeInUp.delay(250).springify()}
						className="mb-4 rounded-2xl p-4"
						style={{ backgroundColor: cardBg }}
					>
						<StyledText className="mb-3 font-semibold text-foreground">
							Order Items ({order.items.length})
						</StyledText>
						{order.items.map((item, index) => (
							<StyledView
								key={item.id}
								className="flex-row items-center py-3"
								style={{
									borderTopWidth: index > 0 ? 1 : 0,
									borderTopColor: borderColor,
								}}
							>
								{item.productImage ? (
									<Image
										source={{ uri: item.productImage }}
										className="h-16 w-16 rounded-lg"
										resizeMode="cover"
									/>
								) : (
									<StyledView
										className="h-16 w-16 items-center justify-center rounded-lg"
										style={{ backgroundColor: borderColor }}
									>
										<Ionicons
											name="image-outline"
											size={24}
											color={isLight ? "#9ca3af" : "#6b7280"}
										/>
									</StyledView>
								)}
								<StyledView className="ml-3 flex-1">
									<StyledText
										className="font-medium text-foreground"
										numberOfLines={2}
									>
										{item.productName}
									</StyledText>
									<StyledText className="text-muted text-sm">
										{item.quantity} x {formatPrice(item.price)}
									</StyledText>
								</StyledView>
								<StyledText className="font-semibold text-foreground">
									{formatPrice(item.price * item.quantity)}
								</StyledText>
							</StyledView>
						))}
					</AnimatedView>

					{/* Order Summary */}
					<AnimatedView
						entering={FadeInUp.delay(300).springify()}
						className="mb-4 rounded-2xl p-4"
						style={{ backgroundColor: cardBg }}
					>
						<StyledText className="mb-3 font-semibold text-foreground">
							Order Summary
						</StyledText>
						<StyledView className="flex-row justify-between py-2">
							<StyledText className="text-muted">Subtotal</StyledText>
							<StyledText className="text-foreground">
								{formatPrice(order.subtotal)}
							</StyledText>
						</StyledView>
						<StyledView className="flex-row justify-between py-2">
							<StyledText className="text-muted">Shipping</StyledText>
							<StyledText className="text-foreground">
								{formatPrice(order.shippingCost)}
							</StyledText>
						</StyledView>
						<StyledView
							className="mt-2 flex-row justify-between border-t pt-3"
							style={{ borderTopColor: borderColor }}
						>
							<StyledText className="font-semibold text-foreground">
								Total
							</StyledText>
							<StyledText
								className="font-bold text-lg"
								style={{ color: accentColor }}
							>
								{formatPrice(order.totalAmount)}
							</StyledText>
						</StyledView>
					</AnimatedView>

					{/* Payment Information */}
					<AnimatedView
						entering={FadeInUp.delay(350).springify()}
						className="mb-4 rounded-2xl p-4"
						style={{ backgroundColor: cardBg }}
					>
						<StyledText className="mb-3 font-semibold text-foreground">
							Payment Information
						</StyledText>
						<StyledView className="flex-row justify-between py-2">
							<StyledText className="text-muted">Status</StyledText>
							<StyledView
								className="rounded-full px-2 py-0.5"
								style={{ backgroundColor: paymentColor.bg }}
							>
								<StyledText
									className="font-medium text-xs capitalize"
									style={{ color: paymentColor.text }}
								>
									{order.paymentStatus}
								</StyledText>
							</StyledView>
						</StyledView>
						{order.paymentMethod && (
							<StyledView className="flex-row justify-between py-2">
								<StyledText className="text-muted">Method</StyledText>
								<StyledText className="font-medium text-foreground capitalize">
									{order.paymentMethod.replace(/_/g, " ")}
								</StyledText>
							</StyledView>
						)}
						{order.paidAt && (
							<StyledView className="flex-row justify-between py-2">
								<StyledText className="text-muted">Paid At</StyledText>
								<StyledText className="text-foreground">
									{formatShortDate(order.paidAt)}
								</StyledText>
							</StyledView>
						)}
						{order.midtransOrderId && (
							<StyledView className="flex-row justify-between py-2">
								<StyledText className="text-muted">Order ID</StyledText>
								<StyledText className="font-mono text-foreground text-sm">
									{order.midtransOrderId}
								</StyledText>
							</StyledView>
						)}
					</AnimatedView>

					{/* Order Timeline */}
					<AnimatedView
						entering={FadeInUp.delay(400).springify()}
						className="mb-4 rounded-2xl p-4"
						style={{ backgroundColor: cardBg }}
					>
						<StyledText className="mb-3 font-semibold text-foreground">
							Order Timeline
						</StyledText>
						<StyledView className="flex-row items-start">
							<StyledView className="mr-3 items-center">
								<StyledView
									className="h-3 w-3 rounded-full"
									style={{ backgroundColor: accentColor }}
								/>
								<StyledView
									className="w-0.5 flex-1"
									style={{ backgroundColor: borderColor, minHeight: 30 }}
								/>
							</StyledView>
							<StyledView className="flex-1 pb-4">
								<StyledText className="font-medium text-foreground">
									Order Created
								</StyledText>
								<StyledText className="text-muted text-sm">
									{formatDate(order.createdAt)}
								</StyledText>
							</StyledView>
						</StyledView>

						{order.paidAt && (
							<StyledView className="flex-row items-start">
								<StyledView className="mr-3 items-center">
									<StyledView
										className="h-3 w-3 rounded-full"
										style={{ backgroundColor: "#22c55e" }}
									/>
									<StyledView
										className="w-0.5 flex-1"
										style={{ backgroundColor: borderColor, minHeight: 30 }}
									/>
								</StyledView>
								<StyledView className="flex-1 pb-4">
									<StyledText className="font-medium text-foreground">
										Payment Confirmed
									</StyledText>
									<StyledText className="text-muted text-sm">
										{formatDate(order.paidAt)}
									</StyledText>
								</StyledView>
							</StyledView>
						)}

						{order.shipping?.shippedAt && (
							<StyledView className="flex-row items-start">
								<StyledView className="mr-3 items-center">
									<StyledView
										className="h-3 w-3 rounded-full"
										style={{ backgroundColor: "#a855f7" }}
									/>
									<StyledView
										className="w-0.5 flex-1"
										style={{ backgroundColor: borderColor, minHeight: 30 }}
									/>
								</StyledView>
								<StyledView className="flex-1 pb-4">
									<StyledText className="font-medium text-foreground">
										Order Shipped
									</StyledText>
									<StyledText className="text-muted text-sm">
										{formatDate(order.shipping.shippedAt)}
									</StyledText>
								</StyledView>
							</StyledView>
						)}

						{order.shipping?.deliveredAt && (
							<StyledView className="flex-row items-start">
								<StyledView className="mr-3 items-center">
									<StyledView
										className="h-3 w-3 rounded-full"
										style={{ backgroundColor: "#22c55e" }}
									/>
								</StyledView>
								<StyledView className="flex-1">
									<StyledText className="font-medium text-foreground">
										Order Delivered
									</StyledText>
									<StyledText className="text-muted text-sm">
										{formatDate(order.shipping.deliveredAt)}
									</StyledText>
								</StyledView>
							</StyledView>
						)}

						{order.status === "cancelled" && (
							<StyledView className="flex-row items-start">
								<StyledView className="mr-3 items-center">
									<StyledView
										className="h-3 w-3 rounded-full"
										style={{ backgroundColor: "#ef4444" }}
									/>
								</StyledView>
								<StyledView className="flex-1">
									<StyledText className="font-medium text-foreground">
										Order Cancelled
									</StyledText>
									<StyledText className="text-muted text-sm">
										{formatDate(order.updatedAt)}
									</StyledText>
								</StyledView>
							</StyledView>
						)}
					</AnimatedView>
				</ScrollView>

				{/* Bottom Action Buttons */}
				{(canPay || canCancel) && (
					<AnimatedView
						entering={FadeInUp.delay(450).springify()}
						className="absolute right-0 bottom-0 left-0 flex-row gap-3 px-5 pt-4"
						style={{
							paddingBottom: insets.bottom + 16,
							backgroundColor: isLight
								? "rgba(255,255,255,0.95)"
								: "rgba(17,17,27,0.95)",
							borderTopWidth: 1,
							borderTopColor: borderColor,
						}}
					>
						{canCancel && (
							<Button
								variant="outline"
								className="flex-1"
								onPress={handleCancelOrder}
								isDisabled={cancelMutation.isPending}
							>
								{cancelMutation.isPending ? (
									<Spinner size="sm" />
								) : (
									<Button.Label>Cancel Order</Button.Label>
								)}
							</Button>
						)}
						{canPay && (
							<Button className="flex-1" onPress={handlePayNow}>
								<Button.Label>Pay Now</Button.Label>
							</Button>
						)}
					</AnimatedView>
				)}
			</StyledView>
		</GradientBackground>
	);
}
