import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { Spinner } from "heroui-native";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientBackground } from "@/components/gradient-background";
import { Logo } from "@/components/logo";
import { AnimatedView, StyledView } from "@/components/uniwind";
import { useAppTheme } from "@/contexts/app-theme-context";
import { useGetSession } from "@/hooks/auth";

export default function AuthLayout() {
	const insets = useSafeAreaInsets();
	const { data: session, isLoading: sessionLoading } = useGetSession();
	const { isLight } = useAppTheme();
	const router = useRouter();

	useEffect(() => {
		if (!sessionLoading && (!session?.success || !session.data?.user)) {
			router.replace("/(auth)/sign-in");
		}
	}, [sessionLoading, session, router]);

	if (sessionLoading) {
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

	return (
		<StyledView className="flex-1">
			<GradientBackground variant="auth">
				<StyledView
					style={{
						flex: 1,
						paddingTop: insets.top + 40,
					}}
				>
					<AnimatedView
						entering={FadeInDown.duration(300)}
						className="mb-8 items-center"
					>
						<Logo />
					</AnimatedView>
					<Stack
						screenOptions={{
							headerShown: false,
							animation: "fade",
							animationDuration: 200,
							contentStyle: {
								backgroundColor: "transparent",
							},
						}}
					>
						<Stack.Screen name="sign-in" />
						<Stack.Screen name="sign-up" />
						<Stack.Screen name="forgot-password" />
						<Stack.Screen name="reset-password" />
					</Stack>
				</StyledView>
			</GradientBackground>
		</StyledView>
	);
}
