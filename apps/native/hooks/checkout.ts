import type {
	CalculateDomesticCost,
	Courier,
	OrderListQuery,
	SimulationStep,
} from "@simple-commerce/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { orpc, queryClient } from "@/utils/orpc";
import { CART_KEYS } from "./cart";

const ADDRESS_KEYS = {
	LIST: orpc.address.list.queryKey(),
	GET_DEFAULT: orpc.address.getDefault.queryKey(),
	GET_BY_ID: (id: string) => orpc.address.getById.queryKey({ input: { id } }),
} as const;

// ============================================
// Address Hooks
// ============================================

/**
 * Get all addresses for current user
 */
export function useAddresses() {
	return useQuery(orpc.address.list.queryOptions());
}

/**
 * Get default address
 */
export function useDefaultAddress() {
	return useQuery(orpc.address.getDefault.queryOptions());
}

/**
 * Get address by ID
 */
export function useAddressById(id: string) {
	return useQuery(
		orpc.address.getById.queryOptions({
			input: { id },
		}),
	);
}

/**
 * Create a new address
 */
export function useCreateAddress() {
	return useMutation(
		orpc.address.create.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.LIST });
				queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.GET_DEFAULT });
			},
		}),
	);
}

/**
 * Update an address
 */
export function useUpdateAddress() {
	return useMutation(
		orpc.address.update.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.LIST });
				queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.GET_DEFAULT });
			},
		}),
	);
}

/**
 * Delete an address
 */
export function useDeleteAddress() {
	return useMutation(
		orpc.address.delete.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.LIST });
				queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.GET_DEFAULT });
			},
		}),
	);
}

/**
 * Set address as default
 */
export function useSetDefaultAddress() {
	return useMutation(
		orpc.address.setDefault.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.LIST });
				queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.GET_DEFAULT });
			},
		}),
	);
}

const _SHIPPING_KEYS = {
	SEARCH_DESTINATION: (search: string) =>
		orpc.shipping.searchDestination.queryKey({ input: { search } }),
	CALCULATE_COST: (params: CalculateDomesticCost) =>
		orpc.shipping.calculateCost.queryKey({ input: params }),
};

// ============================================
// Shipping Hooks (V2 API)
// ============================================

/**
 * Search destinations (autocomplete)
 * Returns destinations with subdistrict-level precision
 */
export function useSearchDestination(
	search: string,
	options?: { enabled?: boolean; limit?: number },
) {
	return useQuery({
		...orpc.shipping.searchDestination.queryOptions({
			input: {
				search,
				limit: options?.limit ?? 10,
				offset: 0,
			},
		}),
		enabled: (options?.enabled ?? true) && search.length >= 3,
	});
}

/**
 * Calculate shipping cost (V2)
 * Uses destination IDs (subdistrict level) for precise calculation
 */
export function useShippingCost(
	options: Omit<CalculateDomesticCost, "courier"> & {
		courier: Courier;
		enabled?: boolean;
	},
) {
	return useQuery({
		...orpc.shipping.calculateCost.queryOptions({
			input: {
				origin: options.origin,
				destination: options.destination,
				weight: options.weight,
				courier: options.courier,
			},
		}),
		enabled:
			options.enabled !== false &&
			options.origin > 0 &&
			options.destination > 0 &&
			options.weight > 0,
	});
}

/**
 * Track waybill/AWB
 */
export function useTrackWaybill(awb: string, courier: Courier) {
	return useQuery({
		...orpc.shipping.trackWaybill.queryOptions({
			input: { awb, courier },
		}),
		enabled: !!awb && !!courier,
	});
}

const ORDER_KEYS = {
	LIST: (query?: OrderListQuery) =>
		orpc.order.list.queryKey({ input: query ?? {} }),
	GET_BY_ID: (id: string) => orpc.order.getById.queryKey({ input: { id } }),
	GET_BY_MIDTRANS_ID: (midtransOrderId: string) =>
		orpc.order.getByMidtransId.queryKey({ input: { midtransOrderId } }),
};

// ============================================
// Order Hooks
// ============================================

/**
 * Checkout - Create order from cart
 */
export function useCheckout() {
	return useMutation(
		orpc.order.checkout.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: CART_KEYS.GET });
				queryClient.invalidateQueries({ queryKey: CART_KEYS.COUNT });
				queryClient.invalidateQueries({ queryKey: ORDER_KEYS.LIST() });
			},
		}),
	);
}

/**
 * Get user's orders
 */
export function useOrders(options?: Partial<OrderListQuery>) {
	return useQuery(orpc.order.list.queryOptions({ input: options ?? {} }));
}

/**
 * Get order by ID
 */
export function useOrderById(id: string) {
	return useQuery(
		orpc.order.getById.queryOptions({
			input: { id },
		}),
	);
}

/**
 * Get order by Midtrans order ID
 */
export function useOrderByMidtransId(midtransOrderId: string) {
	return useQuery(
		orpc.order.getByMidtransId.queryOptions({
			input: { midtransOrderId },
		}),
	);
}

/**
 * Cancel order
 */
export function useCancelOrder() {
	return useMutation(
		orpc.order.cancel.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ORDER_KEYS.LIST() });
			},
		}),
	);
}

/**
 * Simulate order step (for testing/demo purposes)
 * Advances order through: processing -> shipped -> in_transit -> delivered
 */
export function useSimulateOrder() {
	return useMutation(
		orpc.order.simulateNextStep.mutationOptions({
			onSuccess: (_data, variables) => {
				// Invalidate specific order and list
				queryClient.invalidateQueries({
					queryKey: ORDER_KEYS.GET_BY_ID(variables.orderId),
				});
				queryClient.invalidateQueries({ queryKey: ORDER_KEYS.LIST() });
			},
		}),
	);
}

// Helper type for simulation steps
export type { SimulationStep };
