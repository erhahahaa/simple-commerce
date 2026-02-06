import { BlurView } from "expo-blur";
import type { PropsWithChildren } from "react";
import { Platform, StyleSheet } from "react-native";
import { FadeInUp } from "react-native-reanimated";
import { AnimatedView, StyledView } from "@/components/uniwind";
import { useAppTheme } from "@/contexts/app-theme-context";

type Props = {
	className?: string;
	delay?: number;
};

export function GlassCard({
	children,
	className = "",
	delay = 0,
}: PropsWithChildren<Props>) {
	const { isLight } = useAppTheme();

	// For Android/web, use a semi-transparent background instead of blur
	const fallbackStyle = {
		backgroundColor: isLight
			? "rgba(255, 255, 255, 0.85)"
			: "rgba(30, 30, 45, 0.85)",
	};

	return (
		<AnimatedView
			entering={FadeInUp.delay(delay).springify()}
			className={`overflow-hidden rounded-3xl ${className}`}
			style={[styles.card, fallbackStyle]}
		>
			{Platform.OS === "ios" && (
				<BlurView
					intensity={isLight ? 80 : 40}
					tint={isLight ? "light" : "dark"}
					style={StyleSheet.absoluteFill}
				/>
			)}
			<StyledView style={styles.content}>{children}</StyledView>
		</AnimatedView>
	);
}

const styles = StyleSheet.create({
	card: {
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.2)",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.15,
		shadowRadius: 20,
		elevation: 10,
	},
	content: {
		padding: 24,
	},
});
