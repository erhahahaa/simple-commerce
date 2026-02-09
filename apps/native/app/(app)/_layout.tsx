import { LinearGradient } from "expo-linear-gradient";
import { Redirect, Stack } from "expo-router";
import { Spinner } from "heroui-native";
import { StyleSheet, View } from "react-native";
import { FadeIn } from "react-native-reanimated";
import { Logo } from "@/components/logo";
import { AnimatedView, StyledView } from "@/components/uniwind";
import { useAppTheme } from "@/contexts/app-theme-context";
import { authClient } from "@/lib/auth-client";

// Theme-aware background colors to prevent flash during navigation
const screenBackgroundColors = {
	light: "#fef3e7", // warm cream matching app gradient
	dark: "#0f0f1a", // dark matching app gradient
};

export default function AppLayout() {
	const { data: session, isPending } = authClient.useSession();
	const { isLight } = useAppTheme();

	if (isPending) {
		const gradientColors = isLight
			? (["#a8edea", "#fed6e3", "#ffecd2"] as const)
			: (["#0f0f1a", "#1a1a2e", "#16213e"] as const);

		return (
			<View style={StyleSheet.absoluteFill}>
				<LinearGradient
					colors={gradientColors}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={StyleSheet.absoluteFill}
				/>
				<AnimatedView
					entering={FadeIn.duration(300)}
					className="flex-1 items-center justify-center"
				>
					<Logo />
					<StyledView className="mt-8">
						<Spinner />
					</StyledView>
				</AnimatedView>
			</View>
		);
	}

	if (!session) {
		return <Redirect href="/(auth)/sign-in" />;
	}

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
