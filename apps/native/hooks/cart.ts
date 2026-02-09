import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

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
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: { productId: string; quantity?: number }) =>
			orpc.cart.addItem.call({
				productId: input.productId,
				quantity: input.quantity ?? 1,
			}),
		onSuccess: () => {
			// Invalidate cart queries to refetch updated data
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
	});
}

/**
 * Update cart item quantity
 */
export function useUpdateCartItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: { cartItemId: string; quantity: number }) =>
			orpc.cart.updateItem.call({
				cartItemId: input.cartItemId,
				quantity: input.quantity,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
	});
}

/**
 * Remove an item from the cart
 */
export function useRemoveFromCart() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: { cartItemId: string }) =>
			orpc.cart.removeItem.call({ cartItemId: input.cartItemId }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
	});
}

/**
 * Clear all items from the cart
 */
export function useClearCart() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => orpc.cart.clear.call(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
	});
}
