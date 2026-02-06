import { cn } from "heroui-native";
import type { PropsWithChildren } from "react";
import { ScrollView, type ViewProps } from "react-native";
import type { AnimatedProps } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimatedView } from "@/components/uniwind";

type Props = AnimatedProps<ViewProps> & {
	className?: string;
};

export function Container({
	children,
	className,
	...props
}: PropsWithChildren<Props>) {
	const insets = useSafeAreaInsets();

	return (
		<AnimatedView
			className={cn("flex-1 bg-background", className)}
			style={{
				paddingBottom: insets.bottom,
			}}
			{...props}
		>
			<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
				{children}
			</ScrollView>
		</AnimatedView>
	);
}
