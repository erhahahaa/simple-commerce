import { Ionicons } from "@expo/vector-icons";
import { Spinner } from "heroui-native";
import {
	FlatList,
	Image,
	RefreshControl,
	TouchableOpacity,
} from "react-native";
import { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientBackground } from "@/components/gradient-background";
import { AnimatedView, StyledText, StyledView } from "@/components/uniwind";
import { useAppTheme } from "@/contexts/app-theme-context";

// TODO: Import cart hooks when cart API is ready
// import { useCart } from "@/hooks/cart";

export default function CartScreen() {
	const insets = useSafeAreaInsets();
	const { isLight } = useAppTheme();

	// Placeholder - will be replaced with actual cart data
	const isLoading = false;
	const cartItems: never[] = [];
	const isEmpty = cartItems.length === 0;

	return (
		<GradientBackground variant="app">
			<StyledView className="flex-1" style={{ paddingTop: insets.top }}>
				{/* Header */}
				<AnimatedView
					entering={FadeInDown.delay(100).springify()}
					className="px-5 pb-4"
				>
					<StyledText className="font-bold text-2xl text-foreground">
						Shopping Cart
					</StyledText>
				</AnimatedView>

				{isLoading ? (
					<StyledView className="flex-1 items-center justify-center">
						<Spinner size="lg" />
					</StyledView>
				) : isEmpty ? (
					<StyledView className="flex-1 items-center justify-center px-8">
						<AnimatedView entering={FadeInUp.delay(200).springify()}>
							<Ionicons
								name="cart-outline"
								size={80}
								color={isLight ? "#9ca3af" : "#6b7280"}
							/>
						</AnimatedView>
						<StyledText className="mt-4 text-center font-semibold text-foreground text-lg">
							Your cart is empty
						</StyledText>
						<StyledText className="mt-2 text-center text-muted">
							Add some products to get started
						</StyledText>
					</StyledView>
				) : (
					<StyledView className="flex-1 items-center justify-center">
						<StyledText className="text-muted">
							Cart items will appear here
						</StyledText>
					</StyledView>
				)}
			</StyledView>
		</GradientBackground>
	);
}
