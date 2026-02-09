import { Ionicons } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { router, useLocalSearchParams } from "expo-router";
import { Button } from "heroui-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientBackground } from "@/components/gradient-background";
import { AnimatedView, StyledText, StyledView } from "@/components/uniwind";
import { useAppTheme } from "@/contexts/app-theme-context";

export default function PaymentFailedScreen() {
	const { orderId: _orderId } = useLocalSearchParams<{ orderId: string }>();
	const insets = useSafeAreaInsets();
	const { isLight } = useAppTheme();

	return (
		<GradientBackground variant="app">
			<KeyboardAwareScrollView
				contentContainerStyle={{
					flexGrow: 1,
					paddingTop: insets.top + 40,
					paddingBottom: insets.bottom + 20,
					paddingHorizontal: 32,
				}}
				bottomOffset={20}
			>
				{/* Failed Icon */}
				<AnimatedView
					entering={FadeInDown.duration(200)}
					className="items-center"
				>
					<StyledView
						className="h-24 w-24 items-center justify-center rounded-full"
						style={{
							backgroundColor: isLight
								? "rgba(239, 68, 68, 0.1)"
								: "rgba(239, 68, 68, 0.2)",
						}}
					>
						<Ionicons name="close-circle" size={56} color="#ef4444" />
					</StyledView>
				</AnimatedView>

				{/* Title */}
				<AnimatedView
					entering={FadeInUp.duration(200)}
					className="mt-6 items-center"
				>
					<StyledText className="text-center font-bold text-2xl text-foreground">
						Payment Failed
					</StyledText>
					<StyledText className="mt-2 text-center text-muted">
						We couldn't process your payment. Please try again or use a
						different payment method.
					</StyledText>
				</AnimatedView>

				{/* Info Card */}
				<AnimatedView entering={FadeInUp.duration(200)} className="mt-8">
					<StyledView
						className="rounded-xl p-4"
						style={{
							backgroundColor: isLight
								? "rgba(255,255,255,0.9)"
								: "rgba(30,30,45,0.9)",
						}}
					>
						<StyledView className="flex-row items-start">
							<Ionicons
								name="information-circle-outline"
								size={24}
								color={isLight ? "#667eea" : "#a855f7"}
								style={{ marginRight: 12 }}
							/>
							<StyledView className="flex-1">
								<StyledText className="font-semibold text-foreground">
									What happened?
								</StyledText>
								<StyledText className="mt-1 text-muted text-sm">
									The payment was cancelled, declined, or expired. Your order
									has been saved and you can try again from your orders page.
								</StyledText>
							</StyledView>
						</StyledView>
					</StyledView>
				</AnimatedView>

				{/* Possible reasons */}
				<AnimatedView entering={FadeInUp.duration(200)} className="mt-4">
					<StyledView
						className="rounded-xl p-4"
						style={{
							backgroundColor: isLight
								? "rgba(255,255,255,0.9)"
								: "rgba(30,30,45,0.9)",
						}}
					>
						<StyledText className="mb-3 font-semibold text-foreground">
							Common reasons for payment failure:
						</StyledText>
						{[
							"Insufficient funds",
							"Card declined by bank",
							"Payment timeout",
							"Network connection issues",
						].map((reason) => (
							<StyledView key={reason} className="mb-2 flex-row items-center">
								<StyledView
									className="mr-3 h-1.5 w-1.5 rounded-full"
									style={{
										backgroundColor: isLight ? "#667eea" : "#a855f7",
									}}
								/>
								<StyledText className="text-muted text-sm">{reason}</StyledText>
							</StyledView>
						))}
					</StyledView>
				</AnimatedView>

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
							<Button.Label>Back to Home</Button.Label>
						</Button>
					</AnimatedView>
				</StyledView>
			</KeyboardAwareScrollView>
		</GradientBackground>
	);
}
