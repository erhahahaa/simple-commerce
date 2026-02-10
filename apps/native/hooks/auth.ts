import type {
	ForgotPasswordRequest,
	GetSessionResponse,
	ResetPasswordRequest,
	SignInRequest,
	SignInResponse,
	SignUpRequest,
	SignUpResponse,
	SocialProvider,
} from "@simple-commerce/schema/auth";
import type {
	EmptyResponse,
	ErrorResponse,
} from "@simple-commerce/schema/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/utils/orpc";

export const AUTH_KEYS = {
	SESSION: ["session"],
} as const;

export function useSignIn() {
	return useMutation({
		mutationKey: ["sign-in"],
		mutationFn: async (body: SignInRequest) => {
			queryClient.clear();
			const res = await authClient.signIn.email(body);
			if (res.error) {
				return {
					success: false,
					error: res.error.message ?? "An unknown error occurred",
				} satisfies ErrorResponse;
			}

			await queryClient.refetchQueries();
			return {
				success: true,
				message: "Signed in successfully",
				data: res.data.user,
			} satisfies SignInResponse;
		},
	});
}

export function useSignUp() {
	return useMutation({
		mutationKey: ["sign-up"],
		mutationFn: async (body: SignUpRequest) => {
			const res = await authClient.signUp.email(body);
			if (res.error) {
				return {
					success: false,
					error: res.error.message ?? "An unknown error occurred",
				} satisfies ErrorResponse;
			}

			await queryClient.refetchQueries();
			return {
				success: true,
				message: "Signed up successfully",
				data: res.data.user,
			} satisfies SignUpResponse;
		},
	});
}

export function useSignOut() {
	return useMutation({
		mutationKey: ["sign-out"],
		mutationFn: async () => {
			const res = await authClient.signOut();
			if (res.error) {
				return {
					success: false,
					error: res.error.message ?? "An unknown error occurred",
				} satisfies ErrorResponse;
			}

			queryClient.clear();
			return {
				success: true,
				message: "Signed out successfully",
			} satisfies { success: true; message: string };
		},
	});
}

export function useGetSession() {
	return useQuery({
		queryKey: ["session"],
		queryFn: async () => {
			const res = await authClient.getSession();
			if (res.error || res.data === null) {
				return {
					success: false,
					error: res.error?.message ?? "An unknown error occurred",
				} satisfies ErrorResponse;
			}

			return {
				success: true,
				data: res.data,
			} satisfies GetSessionResponse;
		},
		retry: false,
		staleTime: 1 * 60 * 1000, // 1 minute
	});
}

export function useSocialAuth(provider: SocialProvider) {
	return useMutation({
		mutationKey: ["social-auth", provider],
		mutationFn: async () => {
			const res = await authClient.signIn.social({ provider });
			if (res.error) {
				return {
					success: false,
					error: res.error.message ?? "An unknown error occurred",
				} satisfies ErrorResponse;
			}

			return {
				success: true,
				message: "Redirecting to social provider",
				data: undefined,
			} satisfies EmptyResponse;
		},
	});
}

export function useForgotPassword() {
	return useMutation({
		mutationKey: ["forgot-password"],
		mutationFn: async (body: ForgotPasswordRequest) => {
			const res = await authClient.requestPasswordReset(body);
			if (res.error) {
				return {
					success: false,
					error: res.error.message ?? "An unknown error occurred",
				} satisfies ErrorResponse;
			}

			return {
				success: true,
				message: "Password reset email sent",
				data: undefined,
			} satisfies EmptyResponse;
		},
	});
}

export function useResetPassword() {
	return useMutation({
		mutationKey: ["reset-password"],
		mutationFn: async (body: ResetPasswordRequest) => {
			const res = await authClient.resetPassword(body);
			if (res.error) {
				return {
					success: false,
					error: res.error.message ?? "An unknown error occurred",
				} satisfies ErrorResponse;
			}

			return {
				success: true,
				message: "Password has been reset successfully",
				data: undefined,
			} satisfies EmptyResponse;
		},
	});
}

export function useSendVerificationEmail() {
	return useMutation({
		mutationKey: ["send-verification-email"],
		mutationFn: async (email: string) => {
			const res = await authClient.sendVerificationEmail({ email });
			if (res.error) {
				return {
					success: false,
					error: res.error.message ?? "An unknown error occurred",
				} satisfies ErrorResponse;
			}

			return {
				success: true,
				message: "Verification email sent",
				data: undefined,
			} satisfies EmptyResponse;
		},
	});
}

export function useVerifyEmail() {
	return useMutation({
		mutationKey: ["verify-email"],
		mutationFn: async (token: string) => {
			const res = await authClient.verifyEmail({ query: { token } });
			if (res.error) {
				return {
					success: false,
					error: res.error.message ?? "An unknown error occurred",
				} satisfies ErrorResponse;
			}

			// Refetch session to update emailVerified status
			await queryClient.refetchQueries({ queryKey: AUTH_KEYS.SESSION });

			return {
				success: true,
				message: "Email verified successfully",
				data: undefined,
			} satisfies EmptyResponse;
		},
	});
}
