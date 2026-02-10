import { Ionicons } from "@expo/vector-icons";
import { Spinner, useToast } from "heroui-native";
import { StyledPressable, StyledText, StyledView } from "@/components/uniwind";
import { useAppTheme } from "@/contexts/app-theme-context";
import { useSession } from "@/contexts/session-context";
import { useSendVerificationEmail } from "@/hooks/auth";

interface EmailVerificationBannerProps {
	/**
	 * Optional style override for the container
	 */
	className?: string;
}

export function EmailVerificationBanner({
	className,
}: EmailVerificationBannerProps) {
	const { user } = useSession();
	const sendVerificationEmail = useSendVerificationEmail();
	const { toast } = useToast();
	const { isLight } = useAppTheme();

	// Don't show if user is verified or not logged in
	if (!user || user.emailVerified) {
		return null;
	}

	const handleResend = async () => {
		if (sendVerificationEmail.isPending) return;

		try {
			const result = await sendVerificationEmail.mutateAsync(user.email);

			if (!result.success) {
				toast.show({
					variant: "danger",
					label: "Failed to send",
					description: result.error,
				});
				return;
			}

			toast.show({
				variant: "success",
				label: "Email sent",
				description: "Please check your inbox for the verification link.",
			});
		} catch (error) {
			console.error("Send verification email error:", error);
			toast.show({
				variant: "danger",
				label: "Failed to send",
				description: "Please check your connection and try again.",
			});
		}
	};

	return (
		<StyledView
			className={`mx-5 mb-4 flex-row items-center rounded-xl p-4 ${className ?? ""}`}
			style={{
				backgroundColor: isLight
					? "rgba(245, 158, 11, 0.15)"
					: "rgba(245, 158, 11, 0.2)",
				borderWidth: 1,
				borderColor: isLight
					? "rgba(245, 158, 11, 0.3)"
					: "rgba(245, 158, 11, 0.4)",
			}}
		>
			<StyledView
				className="mr-3 h-10 w-10 items-center justify-center rounded-full"
				style={{
					backgroundColor: isLight
						? "rgba(245, 158, 11, 0.2)"
						: "rgba(245, 158, 11, 0.3)",
				}}
			>
				<Ionicons name="mail-outline" size={20} color="#f59e0b" />
			</StyledView>

			<StyledView className="flex-1">
				<StyledText
					className="font-semibold text-sm"
					style={{ color: isLight ? "#92400e" : "#fbbf24" }}
				>
					Verify your email
				</StyledText>
				<StyledText
					className="text-xs"
					style={{ color: isLight ? "#a16207" : "#fcd34d" }}
				>
					Check your inbox or tap to resend
				</StyledText>
			</StyledView>

			<StyledPressable
				className="rounded-lg px-3 py-2"
				style={{
					backgroundColor: isLight
						? "rgba(245, 158, 11, 0.2)"
						: "rgba(245, 158, 11, 0.3)",
				}}
				onPress={handleResend}
				disabled={sendVerificationEmail.isPending}
			>
				{sendVerificationEmail.isPending ? (
					<Spinner size="sm" />
				) : (
					<StyledText
						className="font-semibold text-sm"
						style={{ color: isLight ? "#92400e" : "#fbbf24" }}
					>
						Resend
					</StyledText>
				)}
			</StyledPressable>
		</StyledView>
	);
}
