import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Button, Spinner, useToast } from "heroui-native";
import { useCallback, useState } from "react";
import {
	Image,
	RefreshControl,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientBackground } from "@/components/gradient-background";
import { Skeleton } from "@/components/skeleton";
import {
	AnimatedView,
	StyledPressable,
	StyledText,
	StyledView,
} from "@/components/uniwind";
import { formatCurrency } from "@/config";
import { useAppTheme } from "@/contexts/app-theme-context";
import { useAddToCart } from "@/hooks/cart";
import { useRemoveFromWishlist, useWishlist } from "@/hooks/wishlist";

type WishlistProduct = {
	id: string;
	name: string;
	slug: string;
	price: number;
	images: string[] | null;
	category?: { name: string } | null;
};

function WishlistItem({
	product,
	onRemove,
	onAddToCart,
	isRemoving,
	isAddingToCart,
	isLight,
}: {
	product: WishlistProduct;
	onRemove: () => void;
	onAddToCart: () => void;
	isRemoving: boolean;
	isAddingToCart: boolean;
	isLight: boolean;
}) {
	return (
		<StyledPressable
			className="mb-3 flex-row rounded-2xl p-3"
			style={{
				backgroundColor: isLight
					? "rgba(255,255,255,0.95)"
					: "rgba(30,30,45,0.95)",
			}}
			onPress={() => router.push(`/(app)/product/${product.slug}`)}
		>
			{/* Product Image */}
			<StyledView
				className="h-24 w-24 overflow-hidden rounded-xl"
				style={{
					backgroundColor: isLight ? "#f3f4f6" : "#374151",
				}}
			>
				{product.images?.[0] ? (
					<Image
						source={{ uri: product.images[0] }}
						style={{ width: "100%", height: "100%" }}
						resizeMode="cover"
					/>
				) : (
					<StyledView className="flex-1 items-center justify-center">
						<Ionicons
							name="image-outline"
							size={32}
							color={isLight ? "#9ca3af" : "#6b7280"}
						/>
					</StyledView>
				)}
			</StyledView>

			{/* Product Info */}
			<StyledView className="ml-3 flex-1 justify-between">
				<StyledView>
					{product.category && (
						<StyledText
							className="mb-1 text-xs"
							style={{ color: isLight ? "#667eea" : "#a855f7" }}
						>
							{product.category.name}
						</StyledText>
					)}
					<StyledText
						className="font-semibold text-foreground"
						numberOfLines={2}
					>
						{product.name}
					</StyledText>
					<StyledText
						className="mt-1 font-bold"
						style={{ color: isLight ? "#667eea" : "#a855f7" }}
					>
						{formatCurrency(product.price)}
					</StyledText>
				</StyledView>

				{/* Actions */}
				<StyledView className="mt-2 flex-row gap-2">
					<TouchableOpacity
						onPress={onAddToCart}
						disabled={isAddingToCart}
						style={{
							flex: 1,
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
							paddingVertical: 8,
							borderRadius: 8,
							backgroundColor: isLight ? "#667eea" : "#a855f7",
						}}
					>
						{isAddingToCart ? (
							<Spinner size="sm" color="white" />
						) : (
							<>
								<Ionicons name="cart-outline" size={16} color="white" />
								<StyledText className="ml-1 font-medium text-white text-xs">
									Add to Cart
								</StyledText>
							</>
						)}
					</TouchableOpacity>
					<TouchableOpacity
						onPress={onRemove}
						disabled={isRemoving}
						style={{
							padding: 8,
							borderRadius: 8,
							backgroundColor: "rgba(239,68,68,0.1)",
						}}
					>
						{isRemoving ? (
							<Spinner size="sm" />
						) : (
							<Ionicons name="trash-outline" size={20} color="#ef4444" />
						)}
					</TouchableOpacity>
				</StyledView>
			</StyledView>
		</StyledPressable>
	);
}

function WishlistItemSkeleton({ isLight }: { isLight: boolean }) {
	return (
		<StyledView
			className="mb-3 flex-row rounded-2xl p-3"
			style={{
				backgroundColor: isLight
					? "rgba(255,255,255,0.95)"
					: "rgba(30,30,45,0.95)",
			}}
		>
			<Skeleton width={96} height={96} borderRadius={12} />
			<StyledView className="ml-3 flex-1 justify-between">
				<StyledView>
					<Skeleton width="30%" height={12} />
					<Skeleton width="80%" height={16} className="mt-2" />
					<Skeleton width="40%" height={18} className="mt-2" />
				</StyledView>
				<StyledView className="mt-2 flex-row gap-2">
					<Skeleton width="70%" height={36} borderRadius={8} />
					<Skeleton width={36} height={36} borderRadius={8} />
				</StyledView>
			</StyledView>
		</StyledView>
	);
}

export default function WishlistScreen() {
	const insets = useSafeAreaInsets();
	const { isLight } = useAppTheme();
	const { toast } = useToast();
	const [refreshing, setRefreshing] = useState(false);

	const { data: wishlistItems, isLoading, isError, refetch } = useWishlist();
	const removeMutation = useRemoveFromWishlist();
	const addToCartMutation = useAddToCart();

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await refetch();
		setRefreshing(false);
	}, [refetch]);

	const handleRemove = (productId: string) => {
		removeMutation.mutate(
			{ productId },
			{
				onSuccess: () => {
					toast.show({
						variant: "success",
						label: "Removed from wishlist",
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

	const handleAddToCart = (productId: string, productName: string) => {
		addToCartMutation.mutate(
			{ productId, quantity: 1 },
			{
				onSuccess: () => {
					toast.show({
						variant: "success",
						label: "Added to cart",
						description: productName,
					});
				},
				onError: (error) => {
					toast.show({
						variant: "danger",
						label: "Failed to add to cart",
						description: error.message,
					});
				},
			},
		);
	};

	return (
		<GradientBackground variant="app">
			<StyledView className="flex-1" style={{ paddingTop: insets.top + 10 }}>
				{/* Header */}
				<AnimatedView
					entering={FadeInDown.duration(200)}
					className="flex-row items-center px-5 pb-4"
				>
					<StyledPressable
						className="mr-4 h-10 w-10 items-center justify-center rounded-full"
						style={{
							backgroundColor: isLight
								? "rgba(0,0,0,0.05)"
								: "rgba(255,255,255,0.05)",
						}}
						onPress={() => router.back()}
					>
						<Ionicons
							name="arrow-back"
							size={20}
							color={isLight ? "#1a1a2e" : "#ffffff"}
						/>
					</StyledPressable>
					<StyledText className="font-bold text-foreground text-xl">
						My Wishlist
					</StyledText>
					{wishlistItems && wishlistItems.length > 0 && (
						<StyledView
							className="ml-2 rounded-full px-2 py-0.5"
							style={{
								backgroundColor: isLight
									? "rgba(102,126,234,0.1)"
									: "rgba(168,85,247,0.1)",
							}}
						>
							<StyledText
								className="font-semibold text-xs"
								style={{ color: isLight ? "#667eea" : "#a855f7" }}
							>
								{wishlistItems.length}
							</StyledText>
						</StyledView>
					)}
				</AnimatedView>

				{isLoading ? (
					<ScrollView
						className="flex-1 px-5"
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
					>
						<AnimatedView entering={FadeInUp.duration(200)}>
							<WishlistItemSkeleton isLight={isLight} />
							<WishlistItemSkeleton isLight={isLight} />
							<WishlistItemSkeleton isLight={isLight} />
						</AnimatedView>
					</ScrollView>
				) : isError ? (
					<StyledView className="flex-1 items-center justify-center px-5">
						<AnimatedView
							entering={FadeInUp.duration(200)}
							className="items-center"
						>
							<StyledView
								className="mb-4 h-20 w-20 items-center justify-center rounded-full"
								style={{
									backgroundColor: "rgba(239,68,68,0.1)",
								}}
							>
								<Ionicons
									name="alert-circle-outline"
									size={40}
									color="#ef4444"
								/>
							</StyledView>
							<StyledText className="mb-2 font-semibold text-foreground text-lg">
								Failed to load wishlist
							</StyledText>
							<StyledText className="mb-6 text-center text-muted">
								Please check your connection and try again
							</StyledText>
							<Button size="lg" onPress={() => refetch()}>
								<Ionicons
									name="refresh"
									size={18}
									color="white"
									style={{ marginRight: 8 }}
								/>
								<Button.Label>Try Again</Button.Label>
							</Button>
						</AnimatedView>
					</StyledView>
				) : wishlistItems && wishlistItems.length > 0 ? (
					<ScrollView
						className="flex-1 px-5"
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
						refreshControl={
							<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
						}
					>
						<AnimatedView entering={FadeInUp.duration(200)}>
							{wishlistItems.map((item) => (
								<WishlistItem
									key={item.id}
									product={item.product as unknown as WishlistProduct}
									onRemove={() => handleRemove(item.productId)}
									onAddToCart={() =>
										handleAddToCart(item.productId, item.product.name)
									}
									isRemoving={
										removeMutation.isPending &&
										removeMutation.variables?.productId === item.productId
									}
									isAddingToCart={
										addToCartMutation.isPending &&
										addToCartMutation.variables?.productId === item.productId
									}
									isLight={isLight}
								/>
							))}
						</AnimatedView>
					</ScrollView>
				) : (
					<StyledView className="flex-1 items-center justify-center px-5">
						<AnimatedView
							entering={FadeInUp.duration(200)}
							className="items-center"
						>
							<StyledView
								className="mb-4 h-20 w-20 items-center justify-center rounded-full"
								style={{
									backgroundColor: isLight
										? "rgba(239,68,68,0.1)"
										: "rgba(239,68,68,0.1)",
								}}
							>
								<Ionicons name="heart-outline" size={40} color="#ef4444" />
							</StyledView>
							<StyledText className="mb-2 font-semibold text-foreground text-lg">
								Your wishlist is empty
							</StyledText>
							<StyledText className="mb-6 text-center text-muted">
								Save your favorite items to buy them later
							</StyledText>
							<Button
								size="lg"
								onPress={() => router.push("/(app)/(tabs)/products")}
							>
								<Ionicons
									name="search"
									size={18}
									color="white"
									style={{ marginRight: 8 }}
								/>
								<Button.Label>Browse Products</Button.Label>
							</Button>
						</AnimatedView>
					</StyledView>
				)}
			</StyledView>
		</GradientBackground>
	);
}
