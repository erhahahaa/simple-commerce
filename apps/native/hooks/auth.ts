import type {
	ForgotPasswordRequest,
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
import { useMutation } from "@tanstack/react-query";
import { emitSessionEvent } from "@/contexts/session-context";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/utils/orpc";

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

			// Delay to allow SecureStore to persist cookies before refetching session
			await new Promise((resolve) => setTimeout(resolve, 150));
			emitSessionEvent("refetch");
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

			// Delay to allow SecureStore to persist cookies before refetching session
			await new Promise((resolve) => setTimeout(resolve, 150));
			emitSessionEvent("refetch");
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
			emitSessionEvent("clear");
			return {
				success: true,
				message: "Signed out successfully",
			} satisfies { success: true; message: string };
		},
	});
}

export function useSocialAuth(provider: SocialProvider) {
	return useMutation({
		mutationKey: ["social-auth", provider],
		mutationFn: async () => {
			queryClient.clear();
			const res = await authClient.signIn.social({
				provider,
				callbackURL: "/(app)/(tabs)",
			});
			if (res.error) {
				return {
					success: false,
					error: res.error.message ?? "An unknown error occurred",
				} satisfies ErrorResponse;
			}

			// Note: Session refetch is handled by URL listener in _layout.tsx
			// since signIn.social() resolves before OAuth completes

			// Delay to allow SecureStore to persist cookies before refetching session
			await new Promise((resolve) => setTimeout(resolve, 150));
			emitSessionEvent("refetch");

			return {
				success: true,
				message: "Signed in successfully",
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

			// Delay to allow SecureStore to persist cookies before refetching session
			await new Promise((resolve) => setTimeout(resolve, 150));
			emitSessionEvent("refetch");

			return {
				success: true,
				message: "Email verified successfully",
				data: undefined,
			} satisfies EmptyResponse;
		},
	});
}
