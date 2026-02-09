import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

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
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: {
			label: string;
			recipientName: string;
			phone: string;
			provinceId: string;
			provinceName: string;
			cityId: string;
			cityName: string;
			district?: string;
			postalCode: string;
			address: string;
			isDefault?: boolean;
		}) => orpc.address.create.call(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["address"] });
		},
	});
}

/**
 * Update an address
 */
export function useUpdateAddress() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: {
			id: string;
			data: {
				label?: string;
				recipientName?: string;
				phone?: string;
				provinceId?: string;
				provinceName?: string;
				cityId?: string;
				cityName?: string;
				district?: string;
				postalCode?: string;
				address?: string;
				isDefault?: boolean;
			};
		}) => orpc.address.update.call(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["address"] });
		},
	});
}

/**
 * Delete an address
 */
export function useDeleteAddress() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: { id: string }) => orpc.address.delete.call(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["address"] });
		},
	});
}

/**
 * Set address as default
 */
export function useSetDefaultAddress() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: { id: string }) => orpc.address.setDefault.call(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["address"] });
		},
	});
}

// ============================================
// Shipping Hooks
// ============================================

/**
 * Get all provinces
 */
export function useProvinces() {
	return useQuery(orpc.shipping.getProvinces.queryOptions());
}

/**
 * Get cities by province ID
 */
export function useCities(provinceId: string | undefined) {
	return useQuery({
		...orpc.shipping.getCities.queryOptions({
			input: { provinceId: provinceId ?? "" },
		}),
		enabled: !!provinceId,
	});
}

/**
 * Get shipping cost
 */
export function useShippingCost(options: {
	origin: string;
	destination: string;
	weight: number;
	courier: "jne" | "pos" | "tiki";
	enabled?: boolean;
}) {
	return useQuery({
		...orpc.shipping.getCost.queryOptions({
			input: {
				origin: options.origin,
				destination: options.destination,
				weight: options.weight,
				courier: options.courier,
			},
		}),
		enabled:
			options.enabled !== false &&
			!!options.origin &&
			!!options.destination &&
			options.weight > 0,
	});
}

// ============================================
// Order Hooks
// ============================================

/**
 * Checkout - Create order from cart
 */
export function useCheckout() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: {
			addressId: string;
			courier: string;
			service: string;
			shippingCost: number;
			estimatedDays?: number;
		}) => orpc.order.checkout.call(input),
		onSuccess: () => {
			// Clear cart cache since it's now empty
			queryClient.invalidateQueries({ queryKey: ["cart"] });
			queryClient.invalidateQueries({ queryKey: ["order"] });
		},
	});
}

/**
 * Get user's orders
 */
export function useOrders(options?: {
	status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
	paymentStatus?: "pending" | "paid" | "failed" | "expired" | "refunded";
	limit?: number;
	offset?: number;
}) {
	return useQuery(
		orpc.order.list.queryOptions({
			input: {
				status: options?.status,
				paymentStatus: options?.paymentStatus,
				limit: options?.limit ?? 20,
				offset: options?.offset ?? 0,
			},
		}),
	);
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
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: { orderId: string }) => orpc.order.cancel.call(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["order"] });
		},
	});
}
