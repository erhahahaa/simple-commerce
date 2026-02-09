import { Ionicons } from "@expo/vector-icons";
import type { DomesticDestination } from "@simple-commerce/schema";
import { Input, Spinner } from "heroui-native";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSearchDestination } from "@/hooks/checkout";
import { StyledPressable, StyledText, StyledView } from "./uniwind";

interface DestinationSearchProps {
	onSelect: (destination: DomesticDestination) => void;
	onClose: () => void;
	isLight: boolean;
	initialSearch?: string;
}

/**
 * Destination search component using Raja Ongkir V2 Direct Search API.
 * Provides autocomplete search for locations with subdistrict-level precision.
 */
export function DestinationSearch({
	onSelect,
	onClose,
	isLight,
	initialSearch = "",
}: DestinationSearchProps) {
	const insets = useSafeAreaInsets();
	const [search, setSearch] = useState(initialSearch);
	const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

	// Debounce search input
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(search);
		}, 300);
		return () => clearTimeout(timer);
	}, [search]);

	// Use the search destination hook
	const {
		data: results,
		isLoading,
		error,
	} = useSearchDestination(debouncedSearch, {
		enabled: debouncedSearch.length >= 3,
		limit: 20,
	});

	const handleSelect = (destination: DomesticDestination) => {
		onSelect(destination);
		onClose();
	};

	const destinations = results ?? [];
	const errorMessage = error instanceof Error ? error.message : null;

	return (
		<StyledView
			className="absolute inset-0 z-50"
			style={{ backgroundColor: isLight ? "#f8f9fa" : "#0f0f1a" }}
		>
			{/* Header */}
			<StyledView
				className="flex-row items-center px-4 pb-3"
				style={{ paddingTop: insets.top + 10 }}
			>
				<StyledPressable
					className="mr-3 h-10 w-10 items-center justify-center rounded-full"
					style={{
						backgroundColor: isLight
							? "rgba(0,0,0,0.05)"
							: "rgba(255,255,255,0.05)",
					}}
					onPress={onClose}
				>
					<Ionicons
						name="arrow-back"
						size={20}
						color={isLight ? "#1a1a2e" : "#ffffff"}
					/>
				</StyledPressable>
				<StyledText className="flex-1 font-bold text-foreground text-lg">
					Search Location
				</StyledText>
			</StyledView>

			{/* Search Input */}
			<StyledView className="px-4 pb-3">
				<Input
					placeholder="Search city, district, or subdistrict..."
					value={search}
					onChangeText={setSearch}
					autoFocus
				/>
				<StyledText className="mt-2 text-muted text-xs">
					Type at least 3 characters to search
				</StyledText>
			</StyledView>

			{/* Results */}
			<ScrollView
				className="flex-1 px-4"
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
			>
				{isLoading ? (
					<StyledView className="items-center py-8">
						<Spinner size="lg" />
						<StyledText className="mt-2 text-muted">Searching...</StyledText>
					</StyledView>
				) : errorMessage ? (
					<StyledView className="items-center py-8">
						<Ionicons
							name="alert-circle-outline"
							size={40}
							color={isLight ? "#ef4444" : "#f87171"}
						/>
						<StyledText
							className="mt-2 text-center"
							style={{ color: "#ef4444" }}
						>
							{errorMessage}
						</StyledText>
					</StyledView>
				) : destinations.length === 0 && debouncedSearch.length >= 3 ? (
					<StyledView className="items-center py-8">
						<Ionicons
							name="location-outline"
							size={40}
							color={isLight ? "#9ca3af" : "#6b7280"}
						/>
						<StyledText className="mt-2 text-center text-muted">
							No locations found for "{debouncedSearch}"
						</StyledText>
					</StyledView>
				) : destinations.length === 0 ? (
					<StyledView className="items-center py-8">
						<Ionicons
							name="search-outline"
							size={40}
							color={isLight ? "#9ca3af" : "#6b7280"}
						/>
						<StyledText className="mt-2 text-center text-muted">
							Search for your city, district, or subdistrict
						</StyledText>
					</StyledView>
				) : (
					destinations.map((destination) => (
						<TouchableOpacity
							key={destination.id}
							onPress={() => handleSelect(destination)}
						>
							<StyledView
								className="mb-2 rounded-xl p-4"
								style={{
									backgroundColor: isLight
										? "rgba(255,255,255,0.9)"
										: "rgba(30,30,45,0.9)",
									borderWidth: 1,
									borderColor: isLight
										? "rgba(0,0,0,0.1)"
										: "rgba(255,255,255,0.1)",
								}}
							>
								<StyledView className="flex-row items-start">
									<Ionicons
										name="location"
										size={18}
										color={isLight ? "#667eea" : "#a855f7"}
										style={{ marginRight: 10, marginTop: 2 }}
									/>
									<StyledView className="flex-1">
										<StyledText className="font-semibold text-foreground">
											{destination.subdistrict_name}
										</StyledText>
										<StyledText className="mt-1 text-muted text-sm">
											{destination.district_name}, {destination.city_name}
										</StyledText>
										<StyledText className="text-muted text-xs">
											{destination.province_name} - {destination.zip_code}
										</StyledText>
									</StyledView>
								</StyledView>
							</StyledView>
						</TouchableOpacity>
					))
				)}
			</ScrollView>
		</StyledView>
	);
}
