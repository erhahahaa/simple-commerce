import { Ionicons } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { router, useLocalSearchParams } from "expo-router";
import { Button, Spinner } from "heroui-native";
import { useEffect, useRef, useState } from "react";
import { BackHandler } from "react-native";
import { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { WebViewNavigation } from "react-native-webview";
import { WebView } from "react-native-webview";
import { GradientBackground } from "@/components/gradient-background";
import {
	AnimatedView,
	StyledPressable,
	StyledText,
	StyledView,
} from "@/components/uniwind";
import { useAppTheme } from "@/contexts/app-theme-context";

export default function PaymentScreen() {
	const { snapUrl, orderId } = useLocalSearchParams<{
		snapUrl: string;
		orderId: string;
	}>();
	const insets = useSafeAreaInsets();
	const { isLight } = useAppTheme();
	const webViewRef = useRef<WebView>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [canGoBack, setCanGoBack] = useState(false);

	// Handle Android back button
	useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			"hardwareBackPress",
			() => {
				if (canGoBack && webViewRef.current) {
					webViewRef.current.goBack();
					return true;
				}
				return false;
			},
		);

		return () => backHandler.remove();
	}, [canGoBack]);

	const handleNavigationStateChange = (navState: WebViewNavigation) => {
		setCanGoBack(navState.canGoBack);

		const url = navState.url.toLowerCase();

		// Check for success/finish URLs from Midtrans
		if (
			url.includes("transaction_status=settlement") ||
			url.includes("transaction_status=capture") ||
			url.includes("status_code=200") ||
			url.includes("/finish") ||
			url.includes("/success")
		) {
			// Payment successful
			router.replace({
				pathname: "/checkout/success" as Href,
				params: { orderId },
			} as never);
			return;
		}

		// Check for pending payment
		if (
			url.includes("transaction_status=pending") ||
			url.includes("/pending")
		) {
			// Payment pending (e.g., bank transfer)
			router.replace({
				pathname: "/checkout/success" as Href,
				params: { orderId, status: "pending" },
			} as never);
			return;
		}

		// Check for error/cancel URLs
		if (
			url.includes("transaction_status=deny") ||
			url.includes("transaction_status=cancel") ||
			url.includes("transaction_status=expire") ||
			url.includes("/error") ||
			url.includes("/cancel")
		) {
			// Payment failed or cancelled
			router.replace({
				pathname: "/checkout/failed" as Href,
				params: { orderId },
			} as never);
			return;
		}
	};

	const handleClose = () => {
		// Show confirmation or just go back
		router.back();
	};

	if (!snapUrl) {
		return (
			<GradientBackground variant="app">
				<StyledView
					className="flex-1 items-center justify-center px-8"
					style={{ paddingTop: insets.top }}
				>
					<Ionicons
						name="alert-circle-outline"
						size={64}
						color={isLight ? "#ef4444" : "#f87171"}
					/>
					<StyledText className="mt-4 font-semibold text-foreground text-lg">
						Payment Error
					</StyledText>
					<StyledText className="mt-2 text-center text-muted">
						Unable to load payment page. Please try again.
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
							onPress={handleClose}
						>
							<Ionicons
								name="close"
								size={20}
								color={isLight ? "#1a1a2e" : "#ffffff"}
							/>
						</StyledPressable>
						<StyledText className="font-bold text-foreground text-xl">
							Complete Payment
						</StyledText>
					</StyledView>
					{isLoading && <Spinner size="sm" />}
				</AnimatedView>

				{/* WebView */}
				<StyledView className="flex-1">
					<WebView
						ref={webViewRef}
						source={{ uri: snapUrl }}
						onNavigationStateChange={handleNavigationStateChange}
						onLoadStart={() => setIsLoading(true)}
						onLoadEnd={() => setIsLoading(false)}
						startInLoadingState
						renderLoading={() => (
							<StyledView className="absolute inset-0 items-center justify-center bg-background">
								<Spinner size="lg" />
								<StyledText className="mt-4 text-muted">
									Loading payment page...
								</StyledText>
							</StyledView>
						)}
						style={{ flex: 1 }}
						javaScriptEnabled
						domStorageEnabled
						sharedCookiesEnabled
						thirdPartyCookiesEnabled
						allowsBackForwardNavigationGestures
					/>
				</StyledView>

				{/* Bottom Safe Area */}
				<StyledView style={{ height: insets.bottom }} />
			</StyledView>
		</GradientBackground>
	);
}
