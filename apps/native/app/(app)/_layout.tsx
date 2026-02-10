import { Stack } from "expo-router";
import { useAppTheme } from "@/contexts/app-theme-context";

// Theme-aware background colors to prevent flash during navigation
const screenBackgroundColors = {
	light: "#fef3e7", // warm cream matching app gradient
	dark: "#0f0f1a", // dark matching app gradient
};

export default function AppLayout() {
	const { isLight } = useAppTheme();

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				animation: "fade",
				animationDuration: 200,
				contentStyle: {
					backgroundColor: isLight
						? screenBackgroundColors.light
						: screenBackgroundColors.dark,
				},
			}}
		>
			<Stack.Screen name="(tabs)" />
			<Stack.Screen
				name="product/[slug]"
				options={{
					animation: "slide_from_right",
				}}
			/>
		</Stack>
	);
}
