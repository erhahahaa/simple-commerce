import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSequence,
	withSpring,
} from "react-native-reanimated";
import { AnimatedView, StyledText, StyledView } from "@/components/uniwind";
import { useAppTheme } from "@/contexts/app-theme-context";

type Props = {
	size?: "sm" | "md";
	showText?: boolean;
};

const sizeMap = {
	sm: { icon: 18, container: 32, text: "text-lg" },
	md: { icon: 24, container: 42, text: "text-2xl" },
} as const;

export function Logo({ size = "sm", showText = true }: Props) {
	const { isLight } = useAppTheme();
	const scale = useSharedValue(0);
	const textOpacity = useSharedValue(0);

	useEffect(() => {
		scale.value = withSequence(
			withSpring(1.1, { damping: 8 }),
			withSpring(1, { damping: 12 }),
		);
		textOpacity.value = withDelay(200, withSpring(1));
	}, [scale, textOpacity]);

	const iconAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	const textAnimatedStyle = useAnimatedStyle(() => ({
		opacity: textOpacity.value,
	}));

	const config = sizeMap[size];

	return (
		<StyledView className="flex flex-row items-center gap-2">
			<AnimatedView
				style={[
					iconAnimatedStyle,
					{
						width: config.container,
						height: config.container,
						borderRadius: config.container / 2.5,
					},
				]}
				className="items-center justify-center overflow-hidden"
			>
				<LinearGradient
					colors={isLight ? ["#667eea", "#764ba2"] : ["#a855f7", "#6366f1"]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={StyleSheet.absoluteFill}
				/>
				<Ionicons name="bag-handle" size={config.icon} color="white" />
			</AnimatedView>
			{showText && (
				<Animated.View style={textAnimatedStyle}>
					<StyledText
						className={`font-bold ${config.text}`}
						style={{ color: isLight ? "#1a1a2e" : "#ffffff" }}
					>
						SimpleCommerce
					</StyledText>
				</Animated.View>
			)}
		</StyledView>
	);
}
