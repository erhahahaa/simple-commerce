import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Button, Spinner, useToast } from "heroui-native";
import { useEffect, useState } from "react";
import { FadeInDown } from "react-native-reanimated";
import { AuthScreenWrapper } from "@/components/auth-screen-wrapper";
import { GlassCard } from "@/components/glass-card";
import { AnimatedView, StyledText, StyledView } from "@/components/uniwind";
import { useVerifyEmail } from "@/hooks/auth";

type VerificationStatus = "loading" | "success" | "error";

export default function VerifyEmailPage() {
	const { token: tokenParam } = useLocalSearchParams<{ token?: string }>();
	const verifyEmail = useVerifyEmail();
	const { toast } = useToast();
	const [status, setStatus] = useState<VerificationStatus>("loading");
	const [errorMessage, setErrorMessage] = useState<string>("");

	useEffect(() => {
		async function verify() {
			if (!tokenParam) {
				setStatus("error");
				setErrorMessage("Invalid verification link: missing token");
				return;
			}

			try {
				const result = await verifyEmail.mutateAsync(tokenParam);

				if (!result.success) {
					setStatus("error");
					setErrorMessage(result.error);
					return;
				}

				setStatus("success");
				toast.show({
					variant: "success",
					label: "Email verified",
					description: "Your email has been verified successfully.",
				});
			} catch (error) {
				console.error("Email verification error:", error);
				setStatus("error");
				setErrorMessage("Failed to verify email. Please try again.");
			}
		}

		verify();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tokenParam, toast, verifyEmail]);

	const handleContinue = () => {
		if (status === "success") {
			router.replace("/(app)/(tabs)");
		} else {
			router.replace("/(auth)/sign-in");
		}
	};

	return (
		<AuthScreenWrapper>
			<AnimatedView
				entering={FadeInDown.duration(200)}
				className="mb-6 items-center"
			>
				<StyledText className="font-bold text-2xl text-white">
					Email Verification
				</StyledText>
				<StyledText className="mt-2 text-white/70">
					{status === "loading"
						? "Verifying your email..."
						: status === "success"
							? "Your email has been verified"
							: "Verification failed"}
				</StyledText>
			</AnimatedView>

			<GlassCard delay={400}>
				<StyledView className="items-center gap-6 py-4">
					{status === "loading" && (
						<>
							<StyledView className="h-20 w-20 items-center justify-center rounded-full bg-blue-500/20">
								<Spinner size="lg" />
							</StyledView>
							<StyledText className="text-center text-foreground">
								Please wait while we verify your email address...
							</StyledText>
						</>
					)}

					{status === "success" && (
						<>
							<StyledView className="h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
								<Ionicons name="checkmark-circle" size={48} color="#22c55e" />
							</StyledView>
							<StyledView className="gap-2">
								<StyledText className="text-center font-semibold text-foreground text-lg">
									Email Verified Successfully
								</StyledText>
								<StyledText className="text-center text-foreground-500">
									Your email address has been verified. You now have full access
									to all features.
								</StyledText>
							</StyledView>
							<Button className="mt-2 w-full" onPress={handleContinue}>
								<Button.Label>Continue to App</Button.Label>
							</Button>
						</>
					)}

					{status === "error" && (
						<>
							<StyledView className="h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
								<Ionicons name="close-circle" size={48} color="#ef4444" />
							</StyledView>
							<StyledView className="gap-2">
								<StyledText className="text-center font-semibold text-foreground text-lg">
									Verification Failed
								</StyledText>
								<StyledText className="text-center text-foreground-500">
									{errorMessage ||
										"We couldn't verify your email. The link may have expired or already been used."}
								</StyledText>
							</StyledView>
							<Button
								className="mt-2 w-full"
								variant="outline"
								onPress={handleContinue}
							>
								<Button.Label>Back to Sign In</Button.Label>
							</Button>
						</>
					)}
				</StyledView>
			</GlassCard>
		</AuthScreenWrapper>
	);
}
