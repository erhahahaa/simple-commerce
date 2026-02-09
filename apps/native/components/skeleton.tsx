/** biome-ignore-all lint/suspicious/noArrayIndexKey: for quick mvp */
import { useEffect } from "react";
import type { DimensionValue } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";
import { useAppTheme } from "@/contexts/app-theme-context";

interface SkeletonProps {
	width?: DimensionValue;
	height?: number;
	borderRadius?: number;
	className?: string;
}

export function Skeleton({
	width = "100%",
	height = 20,
	borderRadius = 8,
	className,
}: SkeletonProps) {
	const { isLight } = useAppTheme();
	const opacity = useSharedValue(0.3);

	useEffect(() => {
		opacity.value = withRepeat(withTiming(0.7, { duration: 800 }), -1, true);
	}, [opacity]);

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));

	return (
		<Animated.View
			className={className}
			style={[
				{
					width,
					height,
					borderRadius,
					backgroundColor: isLight
						? "rgba(0,0,0,0.1)"
						: "rgba(255,255,255,0.1)",
				},
				animatedStyle,
			]}
		/>
	);
}

export function SkeletonText({
	width = "100%",
	lines = 1,
	className,
}: {
	width?: DimensionValue;
	lines?: number;
	className?: string;
}) {
	return (
		<>
			{Array.from({ length: lines }).map((_, idx) => (
				<Skeleton
					key={`skeleton-line-${idx}`}
					width={idx === lines - 1 && lines > 1 ? "70%" : width}
					height={14}
					borderRadius={4}
					className={idx > 0 ? "mt-2" : className}
				/>
			))}
		</>
	);
}

export function SkeletonCard({ className }: { className?: string }) {
	return (
		<Animated.View className={className}>
			<Skeleton width="100%" height={120} borderRadius={12} />
			<Skeleton width="80%" height={16} borderRadius={4} className="mt-3" />
			<Skeleton width="50%" height={14} borderRadius={4} className="mt-2" />
		</Animated.View>
	);
}

export function SkeletonAvatar({
	size = 48,
	className,
}: {
	size?: number;
	className?: string;
}) {
	return (
		<Skeleton
			width={size}
			height={size}
			borderRadius={size / 2}
			className={className}
		/>
	);
}
