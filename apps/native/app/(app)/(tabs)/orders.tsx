import { Ionicons } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { router } from "expo-router";
import { Button, Spinner } from "heroui-native";
import { useState } from "react";
import {
	FlatList,
	Image,
	RefreshControl,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientBackground } from "@/components/gradient-background";
import { AnimatedView, StyledText, StyledView } from "@/components/uniwind";
import { useAppTheme } from "@/contexts/app-theme-context";
import { useOrders } from "@/hooks/checkout";

type OrderStatus =
	| "pending"
	| "processing"
	| "shipped"
	| "delivered"
	| "cancelled";
type PaymentStatus = "pending" | "paid" | "failed" | "expired" | "refunded";

type OrderItem = {
	id: string;
	productName: string;
	productImage: string | null;
	quantity: number;
	price: number;
};

type Order = {
	id: string;
	status: OrderStatus;
	paymentStatus: PaymentStatus;
	subtotal: number;
	shippingCost: number;
	totalAmount: number;
	midtransOrderId: string | null;
	snapUrl: string | null;
	createdAt: Date;
	items: OrderItem[];
	shipping?: {
		courier: string;
		service: string;
		trackingNumber: string | null;
		status: string;
	} | null;
};

const STATUS_TABS: { key: OrderStatus | "all"; label: string }[] = [
	{ key: "all", label: "All" },
	{ key: "pending", label: "Pending" },
	{ key: "processing", label: "Processing" },
	{ key: "shipped", label: "Shipped" },
	{ key: "delivered", label: "Delivered" },
	{ key: "cancelled", label: "Cancelled" },
];

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
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));
}

function getStatusColor(status: OrderStatus, isLight: boolean) {
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

interface OrderCardProps {
	order: Order;
	isLight: boolean;
	onPress: () => void;
}

function OrderCard({ order, isLight, onPress }: OrderCardProps) {
	const statusColor = getStatusColor(order.status, isLight);
	const paymentColor = getPaymentStatusColor(order.paymentStatus);
	const firstItem = order.items[0];
	const remainingItems = order.items.length - 1;

	return (
		<TouchableOpacity onPress={onPress} activeOpacity={0.7}>
			<AnimatedView
				entering={FadeInUp.springify()}
				className="mb-4 rounded-2xl p-4"
				style={{
					backgroundColor: isLight
						? "rgba(255,255,255,0.9)"
						: "rgba(30,30,45,0.9)",
				}}
			>
				{/* Header */}
				<StyledView className="mb-3 flex-row items-center justify-between">
					<StyledView>
						<StyledText className="font-medium text-muted text-xs">
							{formatDate(order.createdAt)}
						</StyledText>
						<StyledText className="font-semibold text-foreground text-sm">
							{order.midtransOrderId ?? order.id.slice(0, 16)}
						</StyledText>
					</StyledView>
					<StyledView className="flex-row gap-2">
						{/* Payment Status Badge */}
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
						{/* Order Status Badge */}
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
				</StyledView>

				{/* Product Preview */}
				{firstItem && (
					<StyledView className="flex-row items-center">
						{firstItem.productImage ? (
							<Image
								source={{ uri: firstItem.productImage }}
								className="h-16 w-16 rounded-lg"
								resizeMode="cover"
							/>
						) : (
							<StyledView
								className="h-16 w-16 items-center justify-center rounded-lg"
								style={{
									backgroundColor: isLight
										? "rgba(0,0,0,0.05)"
										: "rgba(255,255,255,0.05)",
								}}
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
								numberOfLines={1}
							>
								{firstItem.productName}
							</StyledText>
							<StyledText className="text-muted text-sm">
								{firstItem.quantity} x {formatPrice(firstItem.price)}
							</StyledText>
							{remainingItems > 0 && (
								<StyledText className="mt-1 text-muted text-xs">
									+{remainingItems} more item{remainingItems > 1 ? "s" : ""}
								</StyledText>
							)}
						</StyledView>
					</StyledView>
				)}

				{/* Footer */}
				<StyledView
					className="mt-3 flex-row items-center justify-between border-t pt-3"
					style={{
						borderTopColor: isLight
							? "rgba(0,0,0,0.05)"
							: "rgba(255,255,255,0.05)",
					}}
				>
					<StyledView>
						<StyledText className="text-muted text-xs">Total</StyledText>
						<StyledText
							className="font-bold"
							style={{ color: isLight ? "#667eea" : "#a855f7" }}
						>
							{formatPrice(order.totalAmount)}
						</StyledText>
					</StyledView>

					{/* Shipping info */}
					{order.shipping && (
						<StyledView className="items-end">
							<StyledText className="text-muted text-xs">
								{order.shipping.courier.toUpperCase()} {order.shipping.service}
							</StyledText>
							{order.shipping.trackingNumber && (
								<StyledText className="font-medium text-foreground text-xs">
									{order.shipping.trackingNumber}
								</StyledText>
							)}
						</StyledView>
					)}

					<Ionicons
						name="chevron-forward"
						size={20}
						color={isLight ? "#9ca3af" : "#6b7280"}
					/>
				</StyledView>

				{/* Pay Now Button for pending payment */}
				{order.paymentStatus === "pending" && order.snapUrl && (
					<Button
						className="mt-3 w-full"
						size="sm"
						onPress={(e) => {
							e.stopPropagation?.();
							router.push({
								pathname: "/checkout/payment" as Href,
								params: {
									snapUrl: order.snapUrl,
									orderId: order.id,
								},
							} as never);
						}}
					>
						<Button.Label>Complete Payment</Button.Label>
					</Button>
				)}
			</AnimatedView>
		</TouchableOpacity>
	);
}

export default function OrdersScreen() {
	const insets = useSafeAreaInsets();
	const { isLight } = useAppTheme();
	const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">(
		"all",
	);

	const {
		data: ordersData,
		isLoading,
		refetch,
		isRefetching,
	} = useOrders({
		status: selectedStatus === "all" ? undefined : selectedStatus,
		limit: 50,
	});

	const orders = (ordersData?.orders as Order[] | undefined) ?? [];
	const isEmpty = orders.length === 0;

	const handleOrderPress = (orderId: string) => {
		router.push({
			pathname: "/order/[id]" as Href,
			params: { id: orderId },
		} as never);
	};

	return (
		<GradientBackground variant="app">
			<StyledView className="flex-1" style={{ paddingTop: insets.top }}>
				{/* Header */}
				<AnimatedView
					entering={FadeInDown.delay(100).springify()}
					className="px-5 pb-4"
				>
					<StyledText className="font-bold text-2xl text-foreground">
						My Orders
					</StyledText>
				</AnimatedView>

				{/* Status Tabs */}
				<AnimatedView
					entering={FadeInDown.delay(200).springify()}
					className="mb-4"
				>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{ paddingHorizontal: 20 }}
					>
						{STATUS_TABS.map((tab) => (
							<TouchableOpacity
								key={tab.key}
								onPress={() => setSelectedStatus(tab.key)}
							>
								<StyledView
									className="mr-2 rounded-full px-4 py-2"
									style={{
										backgroundColor:
											selectedStatus === tab.key
												? isLight
													? "#667eea"
													: "#a855f7"
												: isLight
													? "rgba(255,255,255,0.9)"
													: "rgba(30,30,45,0.9)",
									}}
								>
									<StyledText
										className="font-medium text-sm"
										style={{
											color:
												selectedStatus === tab.key
													? "white"
													: isLight
														? "#374151"
														: "#d1d5db",
										}}
									>
										{tab.label}
									</StyledText>
								</StyledView>
							</TouchableOpacity>
						))}
					</ScrollView>
				</AnimatedView>

				{isLoading ? (
					<StyledView className="flex-1 items-center justify-center">
						<Spinner size="lg" />
					</StyledView>
				) : isEmpty ? (
					<StyledView className="flex-1 items-center justify-center px-8">
						<AnimatedView entering={FadeInUp.delay(200).springify()}>
							<Ionicons
								name="receipt-outline"
								size={80}
								color={isLight ? "#9ca3af" : "#6b7280"}
							/>
						</AnimatedView>
						<StyledText className="mt-4 text-center font-semibold text-foreground text-lg">
							{selectedStatus === "all"
								? "No orders yet"
								: `No ${selectedStatus} orders`}
						</StyledText>
						<StyledText className="mt-2 text-center text-muted">
							{selectedStatus === "all"
								? "Your order history will appear here"
								: "Try selecting a different status filter"}
						</StyledText>
						{selectedStatus === "all" && (
							<Button
								className="mt-6"
								onPress={() => router.push("/(app)/(tabs)/products" as Href)}
							>
								<Button.Label>Start Shopping</Button.Label>
							</Button>
						)}
					</StyledView>
				) : (
					<FlatList
						data={orders}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<OrderCard
								order={item}
								isLight={isLight}
								onPress={() => handleOrderPress(item.id)}
							/>
						)}
						contentContainerStyle={{
							paddingHorizontal: 20,
							paddingBottom: insets.bottom + 80,
						}}
						showsVerticalScrollIndicator={false}
						refreshControl={
							<RefreshControl
								refreshing={isRefetching}
								onRefresh={refetch}
								tintColor={isLight ? "#667eea" : "#a855f7"}
							/>
						}
					/>
				)}
			</StyledView>
		</GradientBackground>
	);
}
