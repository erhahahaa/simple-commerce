import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, Stack } from "expo-router";
import { Button } from "heroui-native";
import { StyleSheet } from "react-native";
import { FadeInDown, FadeInUp } from "react-native-reanimated";
import { AnimatedView, StyledText, StyledView } from "@/components/uniwind";
import { useAppTheme } from "@/contexts/app-theme-context";

export default function NotFoundScreen() {
	const { isLight } = useAppTheme();

	const gradientColors = isLight
		? (["#667eea", "#764ba2", "#f093fb"] as const)
		: (["#1a1a2e", "#16213e", "#0f3460"] as const);

	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />
			<StyledView style={StyleSheet.absoluteFill}>
				<LinearGradient
					colors={gradientColors}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={StyleSheet.absoluteFill}
				/>
				<StyledView className="flex-1 items-center justify-center p-6">
					<AnimatedView
						entering={FadeInDown.springify()}
						className="items-center"
					>
						<StyledView className="mb-6 h-32 w-32 items-center justify-center rounded-full bg-white/10">
							<Ionicons name="compass-outline" size={64} color="white" />
						</StyledView>
					</AnimatedView>

					<AnimatedView
						entering={FadeInUp.duration(200)}
						className="items-center"
					>
						<StyledText className="mb-2 font-bold text-6xl text-white">
							404
						</StyledText>
						<StyledText className="mb-2 font-semibold text-2xl text-white">
							Lost in Space
						</StyledText>
						<StyledText className="mb-8 max-w-xs text-center text-white/70">
							The page you're looking for has wandered off into the digital
							void.
						</StyledText>
					</AnimatedView>

					<AnimatedView entering={FadeInUp.duration(200)}>
						<Link href="/" asChild>
							<Button className="px-8">
								<Ionicons
									name="home-outline"
									size={18}
									color="white"
									style={{ marginRight: 8 }}
								/>
								<Button.Label>Go Home</Button.Label>
							</Button>
						</Link>
					</AnimatedView>
				</StyledView>
			</StyledView>
		</>
	);
}
