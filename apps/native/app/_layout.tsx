import "@/global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AppThemeProvider, useAppTheme } from "@/contexts/app-theme-context";
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
