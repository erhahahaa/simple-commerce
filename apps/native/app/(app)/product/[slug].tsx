import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { Button, Spinner, useToast } from "heroui-native";
import { useState } from "react";
import { Dimensions, Image, ScrollView, TouchableOpacity } from "react-native";
import { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientBackground } from "@/components/gradient-background";
import {
	AnimatedView,
	StyledPressable,
	StyledText,
	StyledView,
} from "@/components/uniwind";
import { useAppTheme } from "@/contexts/app-theme-context";
import { useAddToCart } from "@/hooks/cart";
import { useProductBySlug } from "@/hooks/products";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function formatPrice(price: number) {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(price);
}

export default function ProductDetailScreen() {
	const { slug } = useLocalSearchParams<{ slug: string }>();
	const insets = useSafeAreaInsets();
	const { isLight } = useAppTheme();
	const { toast } = useToast();
	const [quantity, setQuantity] = useState(1);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	const { data: product, isLoading, error } = useProductBySlug(slug ?? "");
	const addToCartMutation = useAddToCart();

	const productData = product as {
		id: string;
		name: string;
		slug: string;
		description: string | null;
		price: number;
		stock: number;
		images: string[] | null;
		category?: {
			id: string;
			name: string;
		} | null;
	} | null;

	const handleAddToCart = () => {
		if (!productData) return;

		addToCartMutation.mutate(
			{ productId: productData.id, quantity },
			{
				onSuccess: () => {
					toast.show({
						variant: "success",
						label: "Added to cart",
						description: `${quantity} x ${productData.name}`,
					});
					setQuantity(1); // Reset quantity after adding
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

	const increaseQuantity = () => {
		if (productData && quantity < productData.stock) {
			setQuantity((prev) => prev + 1);
		}
	};

	const decreaseQuantity = () => {
		if (quantity > 1) {
			setQuantity((prev) => prev - 1);
		}
	};

	if (isLoading) {
		return (
			<GradientBackground variant="app">
				<StyledView className="flex-1 items-center justify-center">
					<Spinner size="lg" />
				</StyledView>
			</GradientBackground>
		);
	}

	if (error || !productData) {
		return (
			<GradientBackground variant="app">
				<StyledView
					className="flex-1 items-center justify-center px-8"
					style={{ paddingTop: insets.top }}
				>
					<Ionicons
						name="alert-circle-outline"
						size={64}
						color={isLight ? "#ef4444" : "#f87171"}
					/>
					<StyledText className="mt-4 font-semibold text-foreground text-lg">
						Product not found
					</StyledText>
					<Button className="mt-6" onPress={() => router.back()}>
						<Button.Label>Go Back</Button.Label>
					</Button>
				</StyledView>
			</GradientBackground>
		);
	}

	const images = productData.images ?? [];
	const currentImage = images[selectedImageIndex];
	const isOutOfStock = productData.stock === 0;

	return (
		<GradientBackground variant="app">
			{/* Header */}
			<AnimatedView
				entering={FadeInDown.delay(100).springify()}
				className="absolute top-0 right-0 left-0 z-10 flex-row items-center justify-between px-4"
				style={{ paddingTop: insets.top + 8 }}
			>
				<StyledPressable
					className="h-10 w-10 items-center justify-center rounded-full"
					style={{
						backgroundColor: isLight
							? "rgba(255,255,255,0.9)"
							: "rgba(30,30,45,0.9)",
					}}
					onPress={() => router.back()}
				>
					<Ionicons
						name="arrow-back"
						size={20}
						color={isLight ? "#1a1a2e" : "#ffffff"}
					/>
				</StyledPressable>
				<StyledPressable
					className="h-10 w-10 items-center justify-center rounded-full"
					style={{
						backgroundColor: isLight
							? "rgba(255,255,255,0.9)"
							: "rgba(30,30,45,0.9)",
					}}
				>
					<Ionicons
						name="heart-outline"
						size={20}
						color={isLight ? "#1a1a2e" : "#ffffff"}
					/>
				</StyledPressable>
			</AnimatedView>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
			>
				{/* Product Image */}
				<AnimatedView entering={FadeInUp.delay(100).springify()}>
					{currentImage ? (
						<Image
							source={{ uri: currentImage }}
							style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
							resizeMode="cover"
						/>
					) : (
						<StyledView
							className="items-center justify-center"
							style={{
								width: SCREEN_WIDTH,
								height: SCREEN_WIDTH,
								backgroundColor: isLight
									? "rgba(0,0,0,0.05)"
									: "rgba(255,255,255,0.05)",
							}}
						>
							<Ionicons
								name="image-outline"
								size={80}
								color={isLight ? "#9ca3af" : "#6b7280"}
							/>
						</StyledView>
					)}

					{/* Image Thumbnails */}
					{images.length > 1 && (
						<StyledView className="mt-4 flex-row justify-center gap-2">
							{images.map((img, idx) => (
								<TouchableOpacity
									key={img}
									onPress={() => setSelectedImageIndex(idx)}
								>
									<Image
										source={{ uri: img }}
										className="h-16 w-16 rounded-lg"
										style={{
											borderWidth: idx === selectedImageIndex ? 2 : 0,
											borderColor: isLight ? "#667eea" : "#a855f7",
										}}
										resizeMode="cover"
									/>
								</TouchableOpacity>
							))}
						</StyledView>
					)}
				</AnimatedView>

				{/* Product Info */}
				<AnimatedView
					entering={FadeInUp.delay(200).springify()}
					className="mt-6 px-5"
				>
					{/* Category */}
					{productData.category && (
						<StyledView
							className="mb-3 self-start rounded-full px-3 py-1"
							style={{
								backgroundColor: isLight
									? "rgba(102,126,234,0.1)"
									: "rgba(168,85,247,0.1)",
							}}
						>
							<StyledText
								className="font-medium text-xs"
								style={{ color: isLight ? "#667eea" : "#a855f7" }}
							>
								{productData.category.name}
							</StyledText>
						</StyledView>
					)}

					{/* Name */}
					<StyledText className="font-bold text-2xl text-foreground">
						{productData.name}
					</StyledText>

					{/* Price */}
					<StyledText
						className="mt-2 font-bold text-2xl"
						style={{ color: isLight ? "#667eea" : "#a855f7" }}
					>
						{formatPrice(productData.price)}
					</StyledText>

					{/* Stock Status */}
					<StyledView className="mt-3 flex-row items-center">
						<StyledView
							className="mr-2 h-2 w-2 rounded-full"
							style={{
								backgroundColor: isOutOfStock ? "#ef4444" : "#22c55e",
							}}
						/>
						<StyledText
							className="font-medium text-sm"
							style={{
								color: isOutOfStock ? "#ef4444" : "#22c55e",
							}}
						>
							{isOutOfStock ? "Out of Stock" : `${productData.stock} in stock`}
						</StyledText>
					</StyledView>

					{/* Description */}
					{productData.description && (
						<StyledView className="mt-6">
							<StyledText className="mb-2 font-semibold text-foreground text-lg">
								Description
							</StyledText>
							<StyledText className="text-muted leading-6">
								{productData.description}
							</StyledText>
						</StyledView>
					)}
				</AnimatedView>
			</ScrollView>

			{/* Bottom Action Bar */}
			<AnimatedView
				entering={FadeInUp.delay(300).springify()}
				className="absolute right-0 bottom-0 left-0 px-5 pt-4"
				style={{
					paddingBottom: insets.bottom + 12,
					backgroundColor: isLight
						? "rgba(255,255,255,0.95)"
						: "rgba(30,30,45,0.95)",
					borderTopWidth: 1,
					borderTopColor: isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
				}}
			>
				<StyledView className="flex-row items-center gap-4">
					{/* Quantity Selector */}
					<StyledView
						className="flex-row items-center rounded-xl px-2"
						style={{
							backgroundColor: isLight
								? "rgba(0,0,0,0.05)"
								: "rgba(255,255,255,0.05)",
						}}
					>
						<TouchableOpacity
							onPress={decreaseQuantity}
							disabled={quantity <= 1}
						>
							<StyledView className="h-10 w-10 items-center justify-center">
								<Ionicons
									name="remove"
									size={20}
									color={
										quantity <= 1
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
						<StyledText className="w-10 text-center font-bold text-foreground text-lg">
							{quantity}
						</StyledText>
						<TouchableOpacity
							onPress={increaseQuantity}
							disabled={quantity >= productData.stock}
						>
							<StyledView className="h-10 w-10 items-center justify-center">
								<Ionicons
									name="add"
									size={20}
									color={
										quantity >= productData.stock
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

					{/* Add to Cart Button */}
					<Button
						className="flex-1"
						isDisabled={isOutOfStock || addToCartMutation.isPending}
						onPress={handleAddToCart}
					>
						<Ionicons
							name="cart-outline"
							size={18}
							color="white"
							style={{ marginRight: 8 }}
						/>
						<Button.Label>
							{addToCartMutation.isPending
								? "Adding..."
								: isOutOfStock
									? "Out of Stock"
									: "Add to Cart"}
						</Button.Label>
					</Button>
				</StyledView>
			</AnimatedView>
		</GradientBackground>
	);
}
