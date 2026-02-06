import { LinearGradient } from "expo-linear-gradient";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";
import { useAppTheme } from "@/contexts/app-theme-context";
import { StyledView } from "./uniwind";

type Props = {
	variant?: "auth" | "app";
};

export function GradientBackground({
	children,
	variant = "auth",
}: PropsWithChildren<Props>) {
	const { isLight } = useAppTheme();
	const rotation = useSharedValue(0);

	useEffect(() => {
		rotation.value = withRepeat(
			withTiming(360, { duration: 20000 }),
			-1,
			false,
		);
	}, [rotation]);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${rotation.value}deg` }],
	}));

	// Modern gradient colors based on theme
	const lightColors = {
		auth: ["#667eea", "#764ba2", "#f093fb"] as const,
		app: ["#a8edea", "#fed6e3", "#ffecd2"] as const,
	};

	const darkColors = {
		auth: ["#1a1a2e", "#16213e", "#0f3460"] as const,
		app: ["#0f0f1a", "#1a1a2e", "#16213e"] as const,
	};

	const colors = isLight ? lightColors[variant] : darkColors[variant];

	return (
		<StyledView style={styles.container}>
			<LinearGradient
				colors={colors}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={StyleSheet.absoluteFill}
			/>
			{/* Animated floating orbs for visual interest */}
			<Animated.View style={[styles.orb, styles.orb1, animatedStyle]}>
				<LinearGradient
					colors={
						isLight
							? ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)"]
							: ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]
					}
					style={styles.orbGradient}
				/>
			</Animated.View>
			<Animated.View
				style={[
					styles.orb,
					styles.orb2,
					animatedStyle,
					{ transform: [{ rotate: "-45deg" }] },
				]}
			>
				<LinearGradient
					colors={
						isLight
							? ["rgba(255,255,255,0.2)", "rgba(255,255,255,0.05)"]
							: ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]
					}
					style={styles.orbGradient}
				/>
			</Animated.View>
			{children}
		</StyledView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	orb: {
		position: "absolute",
		borderRadius: 999,
		overflow: "hidden",
	},
	orb1: {
		width: 300,
		height: 300,
		top: -100,
		right: -100,
	},
	orb2: {
		width: 400,
		height: 400,
		bottom: -150,
		left: -150,
	},
	orbGradient: {
		flex: 1,
		borderRadius: 999,
	},
});
