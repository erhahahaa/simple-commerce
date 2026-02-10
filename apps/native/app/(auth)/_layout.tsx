import { Stack } from "expo-router";
import { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientBackground } from "@/components/gradient-background";
import { Logo } from "@/components/logo";
import { AnimatedView, StyledView } from "@/components/uniwind";

export default function AuthLayout() {
	const insets = useSafeAreaInsets();

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
