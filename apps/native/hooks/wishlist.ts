import { useMutation, useQuery } from "@tanstack/react-query";
import { orpc, queryClient } from "@/utils/orpc";
import { USER_KEYS } from "./user";

const WISHLIST_KEYS = {
	LIST: orpc.wishlist.list.queryKey(),
	COUNT: orpc.wishlist.count.queryKey(),
	IS_IN_WISHLIST: (productId: string) =>
		orpc.wishlist.isInWishlist.queryKey({ input: { productId } }),
} as const;

/**
 * Get all wishlist items with product details
 */
export function useWishlist() {
	return useQuery(orpc.wishlist.list.queryOptions());
}

/**
 * Get wishlist count (lightweight query for badges)
 */
export function useWishlistCount() {
	return useQuery(orpc.wishlist.count.queryOptions());
}

/**
 * Check if a product is in the wishlist
 */
export function useIsInWishlist(productId: string) {
	return useQuery(
		orpc.wishlist.isInWishlist.queryOptions({ input: { productId } }),
	);
}

/**
 * Add product to wishlist
 */
export function useAddToWishlist() {
	return useMutation(
		orpc.wishlist.add.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: WISHLIST_KEYS.LIST });
				queryClient.invalidateQueries({ queryKey: USER_KEYS.STATS });
			},
		}),
	);
}

/**
 * Remove product from wishlist
 */
export function useRemoveFromWishlist() {
	return useMutation(
		orpc.wishlist.remove.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: WISHLIST_KEYS.LIST });
				queryClient.invalidateQueries({ queryKey: USER_KEYS.STATS });
			},
		}),
	);
}

/**
 * Toggle wishlist status (add if not present, remove if present)
 */
export function useToggleWishlist() {
	return useMutation(
		orpc.wishlist.toggle.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: WISHLIST_KEYS.LIST });
				queryClient.invalidateQueries({ queryKey: USER_KEYS.STATS });
			},
		}),
	);
}
