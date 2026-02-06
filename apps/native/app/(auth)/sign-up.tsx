import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	type SignUpRequest,
	SignUpRequestSchema,
} from "@simple-commerce/schema/auth";
import { Link, router } from "expo-router";
import {
	Button,
	FieldError,
	Input,
	Label,
	Spinner,
	TextField,
	useToast,
} from "heroui-native";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { FadeInDown, FadeInUp } from "react-native-reanimated";
import { AuthScreenWrapper } from "@/components/auth-screen-wrapper";
import { GlassCard } from "@/components/glass-card";
import { GoogleSocialButton } from "@/components/google-social-button";
import { PasswordInput } from "@/components/password-input";
import { SocialDivider } from "@/components/social-button";
import {
	AnimatedView,
	StyledPressable,
	StyledText,
	StyledView,
} from "@/components/uniwind";
import { useSignUp } from "@/hooks/auth";
import { passwordRequirements, validatePassword } from "@/utils/password";

export default function SignUpScreen() {
	const signUp = useSignUp();
	const { toast } = useToast();

	const {
		control,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<SignUpRequest>({
		resolver: zodResolver(SignUpRequestSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const password = watch("password");

	const metRequirements = useMemo(() => {
		return validatePassword(password);
	}, [password]);

	const onSubmit = async (data: SignUpRequest) => {
		const result = await signUp.mutateAsync(data);

		if (!result.success) {
			toast.show({
				variant: "danger",
				label: "Sign up failed",
				description: result.error,
			});
			return;
		}

		toast.show({
			variant: "success",
			label: "Sign up successful",
			description: result.message,
		});
		router.replace("/(app)" as never);
	};

	return (
		<AuthScreenWrapper>
			{/* Welcome Text */}
			<AnimatedView
				entering={FadeInDown.delay(200).springify()}
				className="mb-4 items-center"
			>
				<StyledText className="font-bold text-2xl text-white">
					Create your account
				</StyledText>
				<StyledText className="mt-2 text-white/70">
					Join us and start shopping
				</StyledText>
			</AnimatedView>

			{/* Form Card */}
			<GlassCard delay={400}>
				<StyledView className="gap-4">
					<Controller
						control={control}
						name="name"
						render={({ field: { onChange, onBlur, value } }) => (
							<TextField isInvalid={!!errors.name}>
								<Label>Full Name</Label>
								<Input
									placeholder="Enter your name"
									value={value}
									onChangeText={onChange}
									onBlur={onBlur}
									autoCapitalize="words"
									autoCorrect={false}
								/>
								{errors.name && <FieldError>{errors.name.message}</FieldError>}
							</TextField>
						)}
					/>

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

					<Controller
						control={control}
						name="password"
						render={({ field: { onChange, onBlur, value } }) => (
							<TextField isInvalid={!!errors.password}>
								<Label>Password</Label>
								<PasswordInput
									placeholder="Create a password"
									value={value}
									onChangeText={onChange}
									onBlur={onBlur}
								/>
								{errors.password && (
									<FieldError>{errors.password.message}</FieldError>
								)}
							</TextField>
						)}
					/>

					{/* Password Requirements - visual indicator */}
					{password.length > 0 && (
						<StyledView className="rounded-xl bg-default-100 p-4">
							<StyledText className="mb-3 font-semibold text-foreground text-sm">
								Password strength
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
									const isMet = req.regex.test(password);
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
						name="confirmPassword"
						render={({ field: { onChange, onBlur, value } }) => (
							<TextField isInvalid={!!errors.confirmPassword}>
								<Label>Confirm Password</Label>
								<PasswordInput
									placeholder="Confirm your password"
									value={value}
									onChangeText={onChange}
									onBlur={onBlur}
								/>
								{errors.confirmPassword && (
									<FieldError>{errors.confirmPassword.message}</FieldError>
								)}
							</TextField>
						)}
					/>

					<Button
						className="mt-2"
						onPress={handleSubmit(onSubmit)}
						isDisabled={signUp.isPending}
					>
						{signUp.isPending ? (
							<Spinner size="sm" />
						) : (
							<Button.Label>Create Account</Button.Label>
						)}
					</Button>
				</StyledView>
			</GlassCard>
			<SocialDivider />

			{/* Social Login */}
			<AnimatedView
				entering={FadeInUp.delay(300).springify()}
				className="mb-2 gap-3"
			>
				<GoogleSocialButton />
			</AnimatedView>

			{/* Sign In Link */}
			<AnimatedView
				entering={FadeInUp.delay(500).springify()}
				className="mt-6 flex-row items-center justify-center"
			>
				<StyledText className="text-white/70">
					Already have an account?{" "}
				</StyledText>
				<Link href="/(auth)/sign-in" asChild>
					<StyledPressable>
						<StyledText className="font-bold text-blue-500">Sign In</StyledText>
					</StyledPressable>
				</Link>
			</AnimatedView>

			{/* Terms */}
			<AnimatedView
				entering={FadeInUp.delay(600).springify()}
				className="mt-4 px-4"
			>
				<StyledText className="text-center text-white/50 text-xs">
					By creating an account, you agree to our{" "}
					<StyledText className="text-white/70 underline">
						Terms of Service
					</StyledText>{" "}
					and{" "}
					<StyledText className="text-white/70 underline">
						Privacy Policy
					</StyledText>
				</StyledText>
			</AnimatedView>
		</AuthScreenWrapper>
	);
}
