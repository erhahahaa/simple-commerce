import { Ionicons } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { router, useLocalSearchParams } from "expo-router";
import { Button, Spinner } from "heroui-native";
import { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientBackground } from "@/components/gradient-background";
import { AnimatedView, StyledText, StyledView } from "@/components/uniwind";
import { formatCurrency } from "@/config";
import { useAppTheme } from "@/contexts/app-theme-context";
import { useOrderById } from "@/hooks/checkout";

export default function PaymentSuccessScreen() {
	const { orderId, status } = useLocalSearchParams<{
		orderId: string;
		status?: string;
	}>();
	const insets = useSafeAreaInsets();
	const { isLight } = useAppTheme();

	const { data: order, isLoading } = useOrderById(orderId ?? "");

	const isPending = status === "pending";

	if (isLoading) {
		return (
			<GradientBackground variant="app">
				<StyledView className="flex-1 items-center justify-center">
					<Spinner size="lg" />
				</StyledView>
			</GradientBackground>
		);
	}

	return (
		<GradientBackground variant="app">
			<StyledView
				className="flex-1 px-8"
				style={{
					paddingTop: insets.top + 40,
					paddingBottom: insets.bottom + 20,
				}}
			>
				{/* Success Icon */}
				<AnimatedView
					entering={FadeInDown.duration(200)}
					className="items-center"
				>
					<StyledView
						className="h-24 w-24 items-center justify-center rounded-full"
						style={{
							backgroundColor: isPending
								? isLight
									? "rgba(234, 179, 8, 0.1)"
									: "rgba(234, 179, 8, 0.2)"
								: isLight
									? "rgba(34, 197, 94, 0.1)"
									: "rgba(34, 197, 94, 0.2)",
						}}
					>
						<Ionicons
							name={isPending ? "time-outline" : "checkmark-circle"}
							size={56}
							color={isPending ? "#eab308" : "#22c55e"}
						/>
					</StyledView>
				</AnimatedView>

				{/* Title */}
				<AnimatedView
					entering={FadeInUp.duration(200)}
					className="mt-6 items-center"
				>
					<StyledText className="text-center font-bold text-2xl text-foreground">
						{isPending ? "Payment Pending" : "Payment Successful!"}
					</StyledText>
					<StyledText className="mt-2 text-center text-muted">
						{isPending
							? "Please complete your payment to process the order"
							: "Thank you for your order. We'll start processing it right away."}
					</StyledText>
				</AnimatedView>

				{/* Order Details */}
				{order && (
					<AnimatedView entering={FadeInUp.duration(200)} className="mt-8">
						<StyledView
							className="rounded-xl p-4"
							style={{
								backgroundColor: isLight
									? "rgba(255,255,255,0.9)"
									: "rgba(30,30,45,0.9)",
							}}
						>
							<StyledText className="mb-3 font-semibold text-foreground">
								Order Details
							</StyledText>

							<StyledView className="flex-row justify-between">
								<StyledText className="text-muted">Order ID</StyledText>
								<StyledText className="font-medium text-foreground">
									{order.midtransOrderId ?? order.id.slice(0, 12)}
								</StyledText>
							</StyledView>

							<StyledView className="mt-2 flex-row justify-between">
								<StyledText className="text-muted">Items</StyledText>
								<StyledText className="font-medium text-foreground">
									{order.items?.length ?? 0} items
								</StyledText>
							</StyledView>

							<StyledView className="mt-2 flex-row justify-between">
								<StyledText className="text-muted">Subtotal</StyledText>
								<StyledText className="font-medium text-foreground">
									{formatCurrency(order.subtotal)}
								</StyledText>
							</StyledView>

							<StyledView className="mt-2 flex-row justify-between">
								<StyledText className="text-muted">Shipping</StyledText>
								<StyledText className="font-medium text-foreground">
									{formatCurrency(order.shippingCost)}
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
								<StyledText className="font-bold text-foreground">
									Total Paid
								</StyledText>
								<StyledText
									className="font-bold"
									style={{ color: isLight ? "#667eea" : "#a855f7" }}
								>
									{formatCurrency(order.totalAmount)}
								</StyledText>
							</StyledView>

							{order.shipping && (
								<StyledView className="mt-4">
									<StyledView className="flex-row justify-between">
										<StyledText className="text-muted">Courier</StyledText>
										<StyledText className="font-medium text-foreground">
											{order.shipping.courier.toUpperCase()}{" "}
											{order.shipping.service}
										</StyledText>
									</StyledView>
									{order.shipping.estimatedDays && (
										<StyledView className="mt-1 flex-row justify-between">
											<StyledText className="text-muted">
												Est. Delivery
											</StyledText>
											<StyledText className="font-medium text-foreground">
												{order.shipping.estimatedDays} days
											</StyledText>
										</StyledView>
									)}
								</StyledView>
							)}
						</StyledView>
					</AnimatedView>
				)}

				{/* Actions */}
				<StyledView className="mt-auto">
					<AnimatedView entering={FadeInUp.duration(200)}>
						<Button
							className="w-full"
							size="lg"
							onPress={() => router.replace("/(app)/(tabs)/orders" as Href)}
						>
							<Ionicons
								name="receipt-outline"
								size={18}
								color="white"
								style={{ marginRight: 8 }}
							/>
							<Button.Label>View My Orders</Button.Label>
						</Button>

						<Button
							className="mt-3 w-full"
							size="lg"
							onPress={() => router.replace("/(app)/(tabs)" as Href)}
						>
							<Button.Label>Continue Shopping</Button.Label>
						</Button>
					</AnimatedView>
				</StyledView>
			</StyledView>
		</GradientBackground>
	);
}
