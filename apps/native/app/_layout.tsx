import "@/global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { Stack, useRouter } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { useEffect, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { AppThemeProvider, useAppTheme } from "@/contexts/app-theme-context";
import { SessionProvider, useSession } from "@/contexts/session-context";
import { queryClient } from "@/utils/orpc";

export const unstable_settings = {
	initialRouteName: "(auth)",
};

// Theme-aware background colors to prevent flash during navigation
const screenBackgroundColors = {
	light: "#fef3e7", // warm cream matching app gradient
	dark: "#0f0f1a", // dark matching app gradient
};

function StackLayout() {
	const { isLight } = useAppTheme();
	const { isAuthenticated, isLoading, refetch } = useSession();
	const router = useRouter();
	const hasHandledOAuthCallback = useRef(false);

	// Listen for deep link returns from OAuth
	useEffect(() => {
		const subscription = Linking.addEventListener("url", async () => {
			// Prevent multiple refetches for the same OAuth callback
			if (hasHandledOAuthCallback.current) return;
			hasHandledOAuthCallback.current = true;

			// Wait for SecureStore to persist cookies from OAuth callback
			await new Promise((resolve) => setTimeout(resolve, 200));
			await refetch();

			// Reset flag after a delay to allow future OAuth flows
			setTimeout(() => {
				hasHandledOAuthCallback.current = false;
			}, 1000);
		});
		return () => subscription.remove();
	}, [refetch]);

	useEffect(() => {
		if (!isLoading) {
			if (!isAuthenticated) {
				router.replace("/(auth)/sign-in");
			} else {
				router.replace("/(app)/(tabs)");
			}
		}
	}, [isLoading, isAuthenticated, router]);

	return (
		<Stack
			screenOptions={{
				animation: "fade",
				animationDuration: 200,
				contentStyle: {
					backgroundColor: isLight
						? screenBackgroundColors.light
						: screenBackgroundColors.dark,
				},
			}}
		>
			<Stack.Screen name="(auth)" options={{ headerShown: false }} />
			<Stack.Screen name="(app)" options={{ headerShown: false }} />
		</Stack>
	);
}

export default function Layout() {
	return (
		<QueryClientProvider client={queryClient}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<KeyboardProvider>
					<AppThemeProvider>
						<HeroUINativeProvider>
							<SessionProvider>
								<StackLayout />
							</SessionProvider>
						</HeroUINativeProvider>
					</AppThemeProvider>
				</KeyboardProvider>
			</GestureHandlerRootView>
		</QueryClientProvider>
	);
}
