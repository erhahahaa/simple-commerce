import { useMutation, useQuery } from "@tanstack/react-query";
import { emitSessionEvent } from "@/contexts/session-context";
import { orpc, queryClient } from "@/utils/orpc";

export const USER_KEYS = {
	PROFILE: orpc.user.getProfile.queryKey(),
	STATS: orpc.user.getStats.queryKey(),
} as const;

/**
 * Get current user's profile
 */
export function useProfile() {
	return useQuery(orpc.user.getProfile.queryOptions());
}

/**
 * Update user profile
 */
export function useUpdateProfile() {
	return useMutation(
		orpc.user.updateProfile.mutationOptions({
			onSuccess: () => {
				// Invalidate profile query to refetch updated data
				emitSessionEvent("refetch");
				queryClient.invalidateQueries({ queryKey: USER_KEYS.PROFILE });
				queryClient.invalidateQueries({ queryKey: USER_KEYS.STATS });
			},
		}),
	);
}

/**
 * Get user statistics (orders, spending, wishlist count)
 */
export function useUserStats() {
	return useQuery(orpc.user.getStats.queryOptions());
}
