import "@/global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import {
	Stack,
	useRootNavigationState,
	useRouter,
	useSegments,
} from "expo-router";
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

// Auth-related deep link paths that should bypass auth redirect
const AUTH_DEEP_LINK_PATHS = ["reset-password", "verify-email"];

function StackLayout() {
	const { isLight } = useAppTheme();
	const { isAuthenticated, isLoading, refetch } = useSession();
	const router = useRouter();
	const segments = useSegments();
	const navigationState = useRootNavigationState();
	const hasHandledOAuthCallback = useRef(false);
	const hasHandledInitialRoute = useRef(false);
	// Track if we're currently on a protected auth screen (reset-password, verify-email)
	const isOnProtectedAuthScreen = useRef(false);

	// Listen for deep link events (when app is already running)
	useEffect(() => {
		const subscription = Linking.addEventListener("url", async (event) => {
			// Check if this is an auth-related deep link
			const parsed = Linking.parse(event.url);
			const path = parsed.path || parsed.hostname;

			// Handle reset-password and verify-email deep links
			if (path && AUTH_DEEP_LINK_PATHS.includes(path)) {
				const token = parsed.queryParams?.token as string | undefined;
				if (token) {
					isOnProtectedAuthScreen.current = true;
					router.replace({
						pathname: `/(auth)/${path}` as
							| "/(auth)/reset-password"
							| "/(auth)/verify-email",
						params: { token },
					});
					return;
				}
			}

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
	}, [refetch, router]);

	// Handle auth-based routing
	useEffect(() => {
		// Wait for navigation state to be ready
		if (!navigationState?.key) return;

		// Wait for session check to complete
		if (isLoading) return;

		// Get current segment group
		const inAuthGroup = segments[0] === "(auth)";
		const currentScreen = segments[1] as string | undefined;

		// Update protected screen status based on current segments
		if (
			inAuthGroup &&
			currentScreen &&
			AUTH_DEEP_LINK_PATHS.includes(currentScreen)
		) {
			isOnProtectedAuthScreen.current = true;
		}

		// Don't redirect if we're on a protected auth screen
		if (isOnProtectedAuthScreen.current) {
			return;
		}

		// Prevent multiple redirects on initial load
		if (!hasHandledInitialRoute.current) {
			hasHandledInitialRoute.current = true;

			// Check for initial deep link
			Linking.getInitialURL().then((url) => {
				if (url) {
					const parsed = Linking.parse(url);
					const path = parsed.path || parsed.hostname;

					if (path && AUTH_DEEP_LINK_PATHS.includes(path)) {
						const token = parsed.queryParams?.token as string | undefined;
						if (token) {
							isOnProtectedAuthScreen.current = true;
							router.replace({
								pathname: `/(auth)/${path}` as
									| "/(auth)/reset-password"
									| "/(auth)/verify-email",
								params: { token },
							});
							return;
						}
					}
				}

				// No deep link or not an auth deep link, proceed with normal auth flow
				if (!isAuthenticated) {
					router.replace("/(auth)/sign-in");
				} else {
					router.replace("/(app)/(tabs)");
				}
			});
			return;
		}

		// Normal auth flow for subsequent navigations
		if (!isAuthenticated && !inAuthGroup) {
			router.replace("/(auth)/sign-in");
		} else if (isAuthenticated && inAuthGroup) {
			// Reset protected screen flag when user becomes authenticated
			isOnProtectedAuthScreen.current = false;
			router.replace("/(app)/(tabs)");
		}
	}, [isLoading, isAuthenticated, segments, navigationState?.key, router]);

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
