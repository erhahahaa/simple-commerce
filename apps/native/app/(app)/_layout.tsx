import { LinearGradient } from "expo-linear-gradient";
import { Redirect, Stack } from "expo-router";
import { Spinner } from "heroui-native";
import { StyleSheet, View } from "react-native";
import { FadeIn } from "react-native-reanimated";
import { Logo } from "@/components/logo";
import { AnimatedView, StyledView } from "@/components/uniwind";
import { useAppTheme } from "@/contexts/app-theme-context";
import { authClient } from "@/lib/auth-client";

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
					entering={FadeIn.duration(500)}
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
