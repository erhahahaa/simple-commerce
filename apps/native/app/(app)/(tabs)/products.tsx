import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Input, Spinner } from "heroui-native";
import { useCallback, useState } from "react";
import {
	FlatList,
	Image,
	RefreshControl,
	TouchableOpacity,
} from "react-native";
import { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientBackground } from "@/components/gradient-background";
import {
	AnimatedPressable,
	AnimatedView,
	StyledText,
	StyledView,
} from "@/components/uniwind";
import { useAppTheme } from "@/contexts/app-theme-context";
import { useCategories, useProducts } from "@/hooks/products";

type Product = {
	id: string;
	name: string;
	slug: string;
	price: number;
	images: string[] | null;
	category?: {
		id: string;
		name: string;
	} | null;
};

type Category = {
	id: string;
	name: string;
	slug: string;
};

function formatPrice(price: number) {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(price);
}

function ProductCard({
	product,
	index,
	isLight,
}: {
	product: Product;
	index: number;
	isLight: boolean;
}) {
	const imageUrl = product.images?.[0];

	return (
		<AnimatedPressable
			entering={FadeInUp.delay(index * 50).springify()}
			className="m-1.5 flex-1 overflow-hidden rounded-2xl"
			style={{
				backgroundColor: isLight
					? "rgba(255,255,255,0.95)"
					: "rgba(30,30,45,0.95)",
			}}
			onPress={() => router.push(`/product/${product.slug}`)}
		>
			{imageUrl ? (
				<Image
					source={{ uri: imageUrl }}
					className="h-36 w-full"
					resizeMode="cover"
				/>
			) : (
				<StyledView
					className="h-36 w-full items-center justify-center"
					style={{
						backgroundColor: isLight
							? "rgba(0,0,0,0.05)"
							: "rgba(255,255,255,0.05)",
					}}
				>
					<Ionicons
						name="image-outline"
						size={40}
						color={isLight ? "#9ca3af" : "#6b7280"}
					/>
				</StyledView>
			)}
			<StyledView className="p-3">
				{product.category && (
					<StyledText className="mb-1 text-muted text-xs">
						{product.category.name}
					</StyledText>
				)}
				<StyledText
					className="font-semibold text-foreground text-sm"
					numberOfLines={2}
				>
					{product.name}
				</StyledText>
				<StyledText
					className="mt-1.5 font-bold text-base"
					style={{ color: isLight ? "#667eea" : "#a855f7" }}
				>
					{formatPrice(product.price)}
				</StyledText>
			</StyledView>
		</AnimatedPressable>
	);
}

function CategoryChip({
	category,
	isSelected,
	onPress,
	isLight,
}: {
	category: Category | { id: string; name: string; slug: string };
	isSelected: boolean;
	onPress: () => void;
	isLight: boolean;
}) {
	return (
		<TouchableOpacity onPress={onPress}>
			<StyledView
				className="mr-2 rounded-full px-4 py-2"
				style={{
					backgroundColor: isSelected
						? isLight
							? "#667eea"
							: "#a855f7"
						: isLight
							? "rgba(255,255,255,0.9)"
							: "rgba(30,30,45,0.9)",
				}}
			>
				<StyledText
					className="font-medium text-sm"
					style={{
						color: isSelected ? "white" : isLight ? "#374151" : "#d1d5db",
					}}
				>
					{category.name}
				</StyledText>
			</StyledView>
		</TouchableOpacity>
	);
}

export default function ProductsScreen() {
	const insets = useSafeAreaInsets();
	const { isLight } = useAppTheme();
	const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
		undefined,
	);
	const [searchQuery, setSearchQuery] = useState("");

	const {
		data: productsData,
		isLoading: productsLoading,
		refetch: refetchProducts,
		isRefetching,
	} = useProducts({
		categoryId: selectedCategory,
		search: searchQuery || undefined,
	});

	const { data: categoriesData } = useCategories();

	const products =
		(productsData as { products: Product[] } | undefined)?.products ?? [];
	const categories = (categoriesData as Category[] | undefined) ?? [];

	const handleRefresh = useCallback(() => {
		refetchProducts();
	}, [refetchProducts]);

	const renderProduct = useCallback(
		({ item, index }: { item: Product; index: number }) => (
			<ProductCard product={item} index={index} isLight={isLight} />
		),
		[isLight],
	);

	const allCategory = { id: "", name: "All", slug: "all" };

	return (
		<GradientBackground variant="app">
			<StyledView className="flex-1" style={{ paddingTop: insets.top }}>
				{/* Header */}
				<AnimatedView
					entering={FadeInDown.delay(100).springify()}
					className="px-5 pb-4"
				>
					<StyledText className="mb-4 font-bold text-2xl text-foreground">
						Products
					</StyledText>

					{/* Search Bar */}
					<StyledView
						className="flex-row items-center rounded-xl px-4"
						style={{
							backgroundColor: isLight
								? "rgba(255,255,255,0.9)"
								: "rgba(30,30,45,0.9)",
						}}
					>
						<Ionicons
							name="search-outline"
							size={20}
							color={isLight ? "#9ca3af" : "#6b7280"}
						/>
						<Input
							placeholder="Search products..."
							value={searchQuery}
							onChangeText={setSearchQuery}
							className="ml-2 flex-1 border-0"
							style={{
								backgroundColor: "transparent",
							}}
						/>
						{searchQuery.length > 0 && (
							<TouchableOpacity onPress={() => setSearchQuery("")}>
								<Ionicons
									name="close-circle"
									size={20}
									color={isLight ? "#9ca3af" : "#6b7280"}
								/>
							</TouchableOpacity>
						)}
					</StyledView>
				</AnimatedView>

				{/* Categories */}
				<AnimatedView
					entering={FadeInDown.delay(200).springify()}
					className="mb-4"
				>
					<FlatList
						data={[allCategory, ...categories]}
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{ paddingHorizontal: 20 }}
						keyExtractor={(item) => item.id || "all"}
						renderItem={({ item }) => (
							<CategoryChip
								category={item}
								isSelected={
									item.id === ""
										? !selectedCategory
										: selectedCategory === item.id
								}
								onPress={() =>
									setSelectedCategory(item.id === "" ? undefined : item.id)
								}
								isLight={isLight}
							/>
						)}
					/>
				</AnimatedView>

				{/* Products Grid */}
				{productsLoading ? (
					<StyledView className="flex-1 items-center justify-center">
						<Spinner size="lg" />
					</StyledView>
				) : products.length === 0 ? (
					<StyledView className="flex-1 items-center justify-center px-8">
						<Ionicons
							name="cube-outline"
							size={64}
							color={isLight ? "#9ca3af" : "#6b7280"}
						/>
						<StyledText className="mt-4 text-center text-lg text-muted">
							No products found
						</StyledText>
						<StyledText className="mt-2 text-center text-muted">
							Try adjusting your search or filters
						</StyledText>
					</StyledView>
				) : (
					<FlatList
						data={products}
						numColumns={2}
						keyExtractor={(item) => item.id}
						renderItem={renderProduct}
						contentContainerStyle={{
							paddingHorizontal: 12,
							paddingBottom: insets.bottom + 80,
						}}
						showsVerticalScrollIndicator={false}
						refreshControl={
							<RefreshControl
								refreshing={isRefetching}
								onRefresh={handleRefresh}
								tintColor={isLight ? "#667eea" : "#a855f7"}
							/>
						}
					/>
				)}
			</StyledView>
		</GradientBackground>
	);
}
