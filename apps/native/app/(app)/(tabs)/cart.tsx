import { Ionicons } from "@expo/vector-icons";
import type { CartItemWithProduct } from "@simple-commerce/schema";
import type { Href } from "expo-router";
import { router } from "expo-router";
import { Button, Spinner, useToast } from "heroui-native";
import { Image, RefreshControl, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientBackground } from "@/components/gradient-background";
import { AnimatedView, StyledText, StyledView } from "@/components/uniwind";
import { useAppTheme } from "@/contexts/app-theme-context";
import {
	useCart,
	useClearCart,
	useRemoveFromCart,
	useUpdateCartItem,
} from "@/hooks/cart";
import { formatCurrency } from "@/utils/format";

interface CartItemCardProps {
	item: CartItemWithProduct;
	isLight: boolean;
	onUpdateQuantity: (cartItemId: string, quantity: number) => void;
	onRemove: (cartItemId: string) => void;
	isUpdating: boolean;
}

function CartItemCard({
	item,
	isLight,
	onUpdateQuantity,
	onRemove,
	isUpdating,
}: CartItemCardProps) {
	const productImage = item.product.images?.[0];
	const itemTotal = item.product.price * item.quantity;

	return (
		<AnimatedView
			entering={FadeInUp.springify()}
			className="mb-3 flex-row rounded-2xl p-3"
			style={{
				backgroundColor: isLight
					? "rgba(255,255,255,0.8)"
					: "rgba(30,30,45,0.8)",
			}}
		>
			{/* Product Image */}
			<TouchableOpacity
				onPress={() => router.push(`/product/${item.product.slug}` as Href)}
				activeOpacity={0.8}
			>
				{productImage ? (
					<Image
						source={{ uri: productImage }}
						className="h-24 w-24 rounded-xl"
						resizeMode="cover"
					/>
				) : (
					<StyledView
						className="h-24 w-24 items-center justify-center rounded-xl"
						style={{
							backgroundColor: isLight
								? "rgba(0,0,0,0.05)"
								: "rgba(255,255,255,0.05)",
						}}
					>
						<Ionicons
							name="image-outline"
							size={32}
							color={isLight ? "#9ca3af" : "#6b7280"}
						/>
					</StyledView>
				)}
			</TouchableOpacity>

			{/* Product Info */}
			<StyledView className="ml-3 flex-1 justify-between">
				<StyledView>
					<TouchableOpacity
						onPress={() => router.push(`/product/${item.product.slug}` as Href)}
						activeOpacity={0.7}
					>
						<StyledText
							className="font-semibold text-foreground"
							numberOfLines={2}
						>
							{item.product.name}
						</StyledText>
					</TouchableOpacity>
					<StyledText
						className="mt-1 font-bold"
						style={{ color: isLight ? "#667eea" : "#a855f7" }}
					>
						{formatCurrency(item.product.price)}
					</StyledText>
				</StyledView>

				{/* Quantity Controls */}
				<StyledView className="flex-row items-center justify-between">
					<StyledView
						className="flex-row items-center rounded-lg"
						style={{
							backgroundColor: isLight
								? "rgba(0,0,0,0.05)"
								: "rgba(255,255,255,0.05)",
						}}
					>
						<TouchableOpacity
							onPress={() =>
								onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
							}
							disabled={item.quantity <= 1 || isUpdating}
						>
							<StyledView className="h-8 w-8 items-center justify-center">
								<Ionicons
									name="remove"
									size={16}
									color={
										item.quantity <= 1 || isUpdating
											? isLight
												? "#d1d5db"
												: "#4b5563"
											: isLight
												? "#374151"
												: "#d1d5db"
									}
								/>
							</StyledView>
						</TouchableOpacity>
						<StyledText className="w-8 text-center font-bold text-foreground">
							{item.quantity}
						</StyledText>
						<TouchableOpacity
							onPress={() =>
								onUpdateQuantity(
									item.id,
									Math.min(item.product.stock, item.quantity + 1),
								)
							}
							disabled={item.quantity >= item.product.stock || isUpdating}
						>
							<StyledView className="h-8 w-8 items-center justify-center">
								<Ionicons
									name="add"
									size={16}
									color={
										item.quantity >= item.product.stock || isUpdating
											? isLight
												? "#d1d5db"
												: "#4b5563"
											: isLight
												? "#374151"
												: "#d1d5db"
									}
								/>
							</StyledView>
						</TouchableOpacity>
					</StyledView>

					{/* Remove Button */}
					<TouchableOpacity
						onPress={() => onRemove(item.id)}
						disabled={isUpdating}
					>
						<StyledView className="h-8 w-8 items-center justify-center">
							<Ionicons
								name="trash-outline"
								size={18}
								color={
									isUpdating ? (isLight ? "#d1d5db" : "#4b5563") : "#ef4444"
								}
							/>
						</StyledView>
					</TouchableOpacity>
				</StyledView>
			</StyledView>

			{/* Item Total */}
			<StyledView className="ml-2 items-end justify-between">
				<StyledView />
				<StyledText className="font-bold text-foreground text-sm">
					{formatCurrency(itemTotal)}
				</StyledText>
			</StyledView>
		</AnimatedView>
	);
}

export default function CartScreen() {
	const insets = useSafeAreaInsets();
	const { isLight } = useAppTheme();
	const { toast } = useToast();

	const { data, isLoading, refetch, isRefetching } = useCart();
	const updateMutation = useUpdateCartItem();
	const removeMutation = useRemoveFromCart();
	const clearMutation = useClearCart();

	const cartItems = data?.cart?.items ?? [];
	const isEmpty = cartItems.length === 0;
	const subtotal = data?.subtotal ?? 0;
	const itemCount = data?.itemCount ?? 0;

	const isUpdating =
		updateMutation.isPending ||
		removeMutation.isPending ||
		clearMutation.isPending;

	const handleUpdateQuantity = (cartItemId: string, quantity: number) => {
		updateMutation.mutate(
			{ cartItemId, quantity },
			{
				onError: (error) => {
					toast.show({
						variant: "danger",
						label: "Failed to update",
						description: error.message,
					});
				},
			},
		);
	};

	const handleRemoveItem = (cartItemId: string) => {
		removeMutation.mutate(
			{ cartItemId },
			{
				onSuccess: () => {
					toast.show({
						variant: "success",
						label: "Item removed",
						description: "Item has been removed from your cart",
					});
				},
				onError: (error) => {
					toast.show({
						variant: "danger",
						label: "Failed to remove",
						description: error.message,
					});
				},
			},
		);
	};

	const handleClearCart = () => {
		clearMutation.mutate(undefined, {
			onSuccess: () => {
				toast.show({
					variant: "success",
					label: "Cart cleared",
					description: "All items have been removed",
				});
			},
			onError: (error) => {
				toast.show({
					variant: "danger",
					label: "Failed to clear cart",
					description: error.message,
				});
			},
		});
	};

	const handleCheckout = () => {
		router.push("/(app)/checkout" as never);
	};

	return (
		<GradientBackground variant="app">
			<StyledView
				className="flex-1"
				style={{
					paddingTop: insets.top + 10,
				}}
			>
				{/* Header */}
				<AnimatedView
					entering={FadeInDown.duration(200)}
					className="flex-row items-center justify-between px-5 pb-4"
				>
					<StyledText className="font-bold text-2xl text-foreground">
						Shopping Cart
					</StyledText>
					{!isEmpty && (
						<TouchableOpacity onPress={handleClearCart} disabled={isUpdating}>
							<StyledText
								className="font-medium"
								style={{
									color: isUpdating
										? isLight
											? "#d1d5db"
											: "#4b5563"
										: "#ef4444",
								}}
							>
								Clear All
							</StyledText>
						</TouchableOpacity>
					)}
				</AnimatedView>

				{isLoading ? (
					<StyledView className="flex-1 items-center justify-center">
						<Spinner size="lg" />
					</StyledView>
				) : isEmpty ? (
					<StyledView className="flex-1 items-center justify-center px-8">
						<AnimatedView entering={FadeInUp.duration(200)}>
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
						<Button
							className="mt-6"
							onPress={() => router.push("/(app)/(tabs)/products" as Href)}
						>
							<Button.Label>Browse Products</Button.Label>
						</Button>
					</StyledView>
				) : (
					<>
						{/* Cart Items */}
						<KeyboardAwareScrollView
							className="flex-1 px-5"
							bottomOffset={20}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{ paddingBottom: 200 }}
							refreshControl={
								<RefreshControl refreshing={isRefetching} onRefresh={refetch} />
							}
						>
							{cartItems.map((item: CartItemWithProduct) => (
								<CartItemCard
									key={item.id}
									item={item}
									isLight={isLight}
									onUpdateQuantity={handleUpdateQuantity}
									onRemove={handleRemoveItem}
									isUpdating={isUpdating}
								/>
							))}
						</KeyboardAwareScrollView>

						{/* Bottom Summary */}
						<AnimatedView
							entering={FadeInUp.duration(200)}
							className="absolute right-0 bottom-0 left-0 px-5 pt-4"
							style={{
								paddingBottom: insets.bottom + 90,
								backgroundColor: isLight
									? "rgba(255,255,255,0.95)"
									: "rgba(30,30,45,0.95)",
								borderTopWidth: 1,
								borderTopColor: isLight
									? "rgba(0,0,0,0.1)"
									: "rgba(255,255,255,0.1)",
							}}
						>
							{/* Summary Row */}
							<StyledView className="mb-4 flex-row items-center justify-between">
								<StyledView>
									<StyledText className="text-muted text-sm">
										{itemCount} {itemCount === 1 ? "item" : "items"}
									</StyledText>
									<StyledText className="font-bold text-foreground text-xl">
										{formatCurrency(subtotal)}
									</StyledText>
								</StyledView>
							</StyledView>

							{/* Checkout Button */}
							<Button
								className="w-full"
								size="lg"
								onPress={handleCheckout}
								isDisabled={isUpdating}
							>
								<Ionicons
									name="card-outline"
									size={18}
									color="white"
									style={{ marginRight: 8 }}
								/>
								<Button.Label>Proceed to Checkout</Button.Label>
							</Button>
						</AnimatedView>
					</>
				)}
			</StyledView>
		</GradientBackground>
	);
}
