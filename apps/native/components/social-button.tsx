import { Ionicons } from "@expo/vector-icons";
import type { SocialProvider } from "@simple-commerce/schema/auth";
import { Spinner } from "heroui-native";
import {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import {
	AnimatedPressable,
	StyledText,
	StyledView,
} from "@/components/uniwind";

type Props = {
	provider: SocialProvider;
	onPress?: () => void;
	isLoading?: boolean;
};

const providerConfig: Record<
	SocialProvider,
	{ icon: keyof typeof Ionicons.glyphMap; label: string; color: string }
> = {
	google: {
		icon: "logo-google",
		label: "Continue with Google",
		color: "#DB4437",
	},
	apple: {
		icon: "logo-apple",
		label: "Continue with Apple",
		color: "#000000",
	},
	github: {
		icon: "logo-github",
		label: "Continue with GitHub",
		color: "#333333",
	},
};

export function SocialButton({ provider, onPress, isLoading }: Props) {
	const scale = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	const handlePressIn = () => {
		scale.value = withSpring(0.97);
	};

	const handlePressOut = () => {
		scale.value = withSpring(1);
	};

	const config = providerConfig[provider];

	return (
		<AnimatedPressable
			className="flex-row items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-4"
			style={animatedStyle}
			onPress={onPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
		>
			{isLoading ? (
				<Spinner size="sm" />
			) : (
				<>
					<StyledView className="mr-3">
						<Ionicons name={config.icon} size={22} color="white" />
					</StyledView>
					<StyledText className="font-semibold text-base text-white">
						{config.label}
					</StyledText>
				</>
			)}
		</AnimatedPressable>
	);
}

export function SocialDivider() {
	return (
		<StyledView className="my-6 flex-row items-center">
			<StyledView className="h-px flex-1 bg-white/20" />
			<StyledText className="mx-4 text-sm text-white/60">or</StyledText>
			<StyledView className="h-px flex-1 bg-white/20" />
		</StyledView>
	);
}
