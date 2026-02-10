import "@/global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { AppThemeProvider, useAppTheme } from "@/contexts/app-theme-context";
import { useGetSession } from "@/hooks/auth";
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
	const { data: session, isLoading: sessionLoading } = useGetSession();
	const router = useRouter();

	useEffect(() => {
		if (!sessionLoading) {
			if (!session?.success || !session.data?.user) {
				router.replace("/(auth)/sign-in");
			} else {
				router.replace("/(app)/(tabs)");
			}
		}
	}, [sessionLoading, session, router]);

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
							<StackLayout />
						</HeroUINativeProvider>
					</AppThemeProvider>
				</KeyboardProvider>
			</GestureHandlerRootView>
		</QueryClientProvider>
	);
}
