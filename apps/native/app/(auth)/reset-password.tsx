import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	type ResetPasswordRequest,
	ResetPasswordRequestSchema,
} from "@simple-commerce/schema/auth";
import { router, useLocalSearchParams } from "expo-router";
import {
	Button,
	FieldError,
	Label,
	Spinner,
	TextField,
	useToast,
} from "heroui-native";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { FadeInDown } from "react-native-reanimated";
import { AuthScreenWrapper } from "@/components/auth-screen-wrapper";
import { GlassCard } from "@/components/glass-card";
import { PasswordInput } from "@/components/password-input";
import { AnimatedView, StyledText, StyledView } from "@/components/uniwind";
import { useResetPassword } from "@/hooks/auth";
import { passwordRequirements, validatePassword } from "@/utils/password";

export default function ResetPasswordPage() {
	const { token: tokenParam } = useLocalSearchParams<{ token?: string }>();
	const resetPassword = useResetPassword();
	const { toast } = useToast();

	const {
		control,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<ResetPasswordRequest>({
		resolver: zodResolver(ResetPasswordRequestSchema),
		defaultValues: {
			token: tokenParam ?? "",
			newPassword: "",
			confirmNewPassword: "",
		},
	});

	const newPassword = watch("newPassword");
	const metRequirements = useMemo(() => {
		return validatePassword(newPassword);
	}, [newPassword]);

	const onSubmit = async (data: ResetPasswordRequest) => {
		if (resetPassword.isPending) return;

		try {
			const result = await resetPassword.mutateAsync({
				token: data.token,
				newPassword: data.newPassword,
				confirmNewPassword: data.confirmNewPassword,
			});

			if (!result.success) {
				toast.show({
					variant: "danger",
					label: "Reset password failed",
					description: result.error,
				});
				return;
			}

			toast.show({
				variant: "success",
				label: "Reset password successful",
				description: "You can now sign in with your new password.",
			});

			router.replace("/(auth)/sign-in");
		} catch (error) {
			console.error("Reset password error:", error);
			toast.show({
				variant: "danger",
				label: "Reset password failed",
				description: "Please check your connection and try again",
			});
		}
	};

	return (
		<AuthScreenWrapper>
			<AnimatedView
				entering={FadeInDown.duration(200)}
				className="mb-6 items-center"
			>
				<StyledText className="font-bold text-2xl text-white">
					Reset Password
				</StyledText>
				<StyledText className="mt-2 text-white/70">
					Enter your new password below
				</StyledText>
			</AnimatedView>

			<GlassCard delay={400}>
				<StyledView className="gap-4">
					<Controller
						control={control}
						name="newPassword"
						render={({ field: { onChange, onBlur, value } }) => (
							<TextField isInvalid={!!errors.newPassword}>
								<Label>Password</Label>
								<PasswordInput
									placeholder="Create a password"
									value={value}
									onChangeText={onChange}
									onBlur={onBlur}
								/>
								{errors.newPassword && (
									<FieldError>{errors.newPassword.message}</FieldError>
								)}
							</TextField>
						)}
					/>

					{/* Password Requirements - visual indicator */}
					{newPassword.length > 0 && (
						<StyledView className="rounded-xl bg-default-100 p-4">
							<StyledText className="mb-3 font-semibold text-foreground text-sm">
								New Password strength
							</StyledText>
							{/* Progress bar */}
							<StyledView className="mb-3 h-2 overflow-hidden rounded-full bg-default-200">
								<StyledView
									className={`h-full rounded-full ${
										metRequirements.length === 5
											? "bg-green-500"
											: metRequirements.length >= 3
												? "bg-yellow-500"
												: "bg-red-500"
									}`}
									style={{
										width: `${(metRequirements.length / 5) * 100}%`,
									}}
								/>
							</StyledView>
							<StyledView className="gap-2">
								{passwordRequirements.map((req) => {
									const isMet = req.regex.test(newPassword);
									return (
										<StyledView
											key={req.label}
											className="flex-row items-center"
										>
											<Ionicons
												name={isMet ? "checkmark-circle" : "ellipse-outline"}
												size={16}
												color={isMet ? "#22c55e" : "#9ca3af"}
											/>
											<StyledText
												className={`ml-2 text-sm ${
													isMet ? "text-green-600" : "text-foreground-400"
												}`}
											>
												{req.label}
											</StyledText>
										</StyledView>
									);
								})}
							</StyledView>
						</StyledView>
					)}

					<Controller
						control={control}
						name="confirmNewPassword"
						render={({ field: { onChange, onBlur, value } }) => (
							<TextField isInvalid={!!errors.confirmNewPassword}>
								<Label>Confirm Password</Label>
								<PasswordInput
									placeholder="Confirm your password"
									value={value}
									onChangeText={onChange}
									onBlur={onBlur}
								/>
								{errors.confirmNewPassword && (
									<FieldError>{errors.confirmNewPassword.message}</FieldError>
								)}
							</TextField>
						)}
					/>

					<Button
						className="mt-2"
						onPress={handleSubmit(onSubmit)}
						isDisabled={resetPassword.isPending}
					>
						{resetPassword.isPending ? (
							<Spinner color="white" />
						) : (
							<Button.Label>Reset Password</Button.Label>
						)}
					</Button>
				</StyledView>
			</GlassCard>
		</AuthScreenWrapper>
	);
}
