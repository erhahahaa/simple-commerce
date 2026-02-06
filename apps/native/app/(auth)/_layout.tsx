import { Redirect, Stack } from "expo-router";
import { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientBackground } from "@/components/gradient-background";
import { Logo } from "@/components/logo";
import { AnimatedView, StyledView } from "@/components/uniwind";
import { useGetSession } from "@/hooks/auth";

export default function AuthLayout() {
	const insets = useSafeAreaInsets();
	const session = useGetSession();

	if (session.data) {
		return <Redirect href="/" />;
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
						entering={FadeInDown.delay(100).springify()}
						className="mb-8 items-center"
					>
						<Logo />
					</AnimatedView>
					<Stack
						screenOptions={{
							headerShown: false,
							animation: "fade",
							contentStyle: { backgroundColor: "transparent" },
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
