import { zodResolver } from "@hookform/resolvers/zod";
import {
	type ForgotPasswordRequest,
	ForgotPasswordRequestSchema,
} from "@simple-commerce/schema/auth";
import { router } from "expo-router";
import {
	Button,
	FieldError,
	Input,
	Label,
	Spinner,
	TextField,
	useToast,
} from "heroui-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FadeInDown } from "react-native-reanimated";
import { AuthScreenWrapper } from "@/components/auth-screen-wrapper";
import { GlassCard } from "@/components/glass-card";
import { AnimatedView, StyledText, StyledView } from "@/components/uniwind";
import { useForgotPassword } from "@/hooks/auth";

export default function ForgotPassword() {
	const forgotPassword = useForgotPassword();
	const { toast } = useToast();
	const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<ForgotPasswordRequest>({
		resolver: zodResolver(ForgotPasswordRequestSchema),
		defaultValues: { email: "" },
	});

	const onSubmit = async (data: ForgotPasswordRequest) => {
		if (forgotPassword.isPending) return;
		setForgotPasswordSuccess(true);

		const result = await forgotPassword.mutateAsync({
			email: data.email,
		});

		if (!result.success) {
			toast.show({
				variant: "danger",
				label: "Forgot password failed",
				description: result.error,
			});
			return;
		}

		setForgotPasswordSuccess(true);
	};

	return (
		<AuthScreenWrapper>
			<AnimatedView
				entering={FadeInDown.delay(200).springify()}
				className="mb-6 items-center"
			>
				<StyledText className="font-bold text-2xl text-white">
					Forgot Password
				</StyledText>
				<StyledText className="mt-2 text-white/70">
					Enter your email to receive a OTP.
				</StyledText>
			</AnimatedView>

			<GlassCard delay={400}>
				<StyledView className="gap-4">
					<Controller
						control={control}
						name="email"
						render={({ field: { onChange, onBlur, value } }) => (
							<TextField isInvalid={!!errors.email}>
								<Label>Email</Label>
								<Input
									placeholder="Enter your email"
									value={value}
									onChangeText={onChange}
									onBlur={onBlur}
									keyboardType="email-address"
									autoCapitalize="none"
									autoCorrect={false}
								/>
								{errors.email && (
									<FieldError>{errors.email.message}</FieldError>
								)}
							</TextField>
						)}
					/>

					<Button
						className="mt-2"
						onPress={handleSubmit(onSubmit)}
						isDisabled={forgotPassword.isPending}
					>
						{forgotPassword.isPending ? (
							<Spinner size="sm" />
						) : (
							<Button.Label>Send Reset Link</Button.Label>
						)}
					</Button>
				</StyledView>
			</GlassCard>

			{forgotPasswordSuccess && (
				<AnimatedView
					entering={FadeInDown.delay(800).springify()}
					className="mt-6 items-center"
				>
					<StyledText className="text-center text-white/70">
						If an account with that email exists, a password reset link has been
						sent.
					</StyledText>
				</AnimatedView>
			)}

			<AnimatedView
				entering={FadeInDown.delay(800).springify()}
				className="mt-6 items-center"
			>
				<StyledText className="text-white/70">
					Remember your password?{" "}
					<StyledText
						className="font-medium text-blue-500"
						onPress={() => {
							router.replace("/(auth)/sign-in");
						}}
					>
						Sign In
					</StyledText>
				</StyledText>
			</AnimatedView>
		</AuthScreenWrapper>
	);
}
