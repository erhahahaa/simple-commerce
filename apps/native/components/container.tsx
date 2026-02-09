import { cn } from "heroui-native";
import type { PropsWithChildren } from "react";
import type { ViewProps } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
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
			<KeyboardAwareScrollView
				contentContainerStyle={{ flexGrow: 1 }}
				bottomOffset={20}
			>
				{children}
			</KeyboardAwareScrollView>
		</AnimatedView>
	);
}
