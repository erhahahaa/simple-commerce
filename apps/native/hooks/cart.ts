import { useMutation, useQuery } from "@tanstack/react-query";
import { orpc, queryClient } from "@/utils/orpc";

export const CART_KEYS = {
	GET: orpc.cart.get.queryKey(),
	COUNT: orpc.cart.count.queryKey(),
} as const;

/**
 * Get the current user's cart with all items
 */
export function useCart() {
	return useQuery(orpc.cart.get.queryOptions());
}

/**
 * Get cart item count (lightweight query for badges)
 */
export function useCartCount() {
	return useQuery(orpc.cart.count.queryOptions());
}

/**
 * Add a product to the cart
 */
export function useAddToCart() {
	return useMutation(
		orpc.cart.addItem.mutationOptions({
			onSuccess: () => {
				// Invalidate cart queries to refetch updated data
				queryClient.invalidateQueries({ queryKey: CART_KEYS.GET });
				queryClient.invalidateQueries({ queryKey: CART_KEYS.COUNT });
			},
		}),
	);
}

/**
 * Update cart item quantity
 */
export function useUpdateCartItem() {
	return useMutation(
		orpc.cart.updateItem.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: CART_KEYS.GET });
				queryClient.invalidateQueries({ queryKey: CART_KEYS.COUNT });
			},
		}),
	);
}

/**
 * Remove an item from the cart
 */
export function useRemoveFromCart() {
	return useMutation(
		orpc.cart.removeItem.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: CART_KEYS.GET });
				queryClient.invalidateQueries({ queryKey: CART_KEYS.COUNT });
			},
		}),
	);
}

/**
 * Clear all items from the cart
 */
export function useClearCart() {
	return useMutation(
		orpc.cart.clear.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: CART_KEYS.GET });
				queryClient.invalidateQueries({ queryKey: CART_KEYS.COUNT });
			},
		}),
	);
}
