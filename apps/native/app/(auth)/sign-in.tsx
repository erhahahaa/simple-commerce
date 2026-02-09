import { zodResolver } from "@hookform/resolvers/zod";
import {
	type SignInRequest,
	SignInRequestSchema,
} from "@simple-commerce/schema/auth";
import { Link, router } from "expo-router";
import {
	Button,
	Checkbox,
	FieldError,
	Input,
	Label,
	Spinner,
	TextField,
	useToast,
} from "heroui-native";
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
import { useSignIn } from "@/hooks/auth";

export default function SignInScreen() {
	const signIn = useSignIn();
	const { toast } = useToast();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<SignInRequest>({
		resolver: zodResolver(SignInRequestSchema),
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
	});

	const onSubmit = async (data: SignInRequest) => {
		if (signIn.isPending) return;

		try {
			const result = await signIn.mutateAsync({
				email: data.email,
				password: data.password,
				rememberMe: data.rememberMe,
			});

			if (!result.success) {
				toast.show({
					variant: "danger",
					label: "Sign in failed",
					description: result.error,
				});
				return;
			}

			toast.show({
				variant: "success",
				label: "Sign in successful",
				description: result.message,
			});
			router.replace("/(app)/(tabs)");
		} catch (error) {
			console.error("Sign in error:", error);
			toast.show({
				variant: "danger",
				label: "Sign in failed",
				description: "Please check your connection and try again",
			});
		}
	};

	return (
		<AuthScreenWrapper>
			{/* Welcome Text */}
			<AnimatedView
				entering={FadeInDown.duration(200)}
				className="mb-6 items-center"
			>
				<StyledText className="font-bold text-2xl text-white">
					Welcome back
				</StyledText>
				<StyledText className="mt-2 text-white/70">
					Sign in to continue shopping
				</StyledText>
			</AnimatedView>

			{/* Form Card */}
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

					<Controller
						control={control}
						name="password"
						render={({ field: { onChange, onBlur, value } }) => (
							<TextField isInvalid={!!errors.password}>
								<StyledView className="flex flex-row items-center justify-between">
									<Label>Password</Label>
									<Link href="/(auth)/forgot-password" asChild>
										<StyledText className="font-medium text-blue-500 text-sm">
											Forgot password?
										</StyledText>
									</Link>
								</StyledView>

								<PasswordInput
									placeholder="Enter your password"
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

					<StyledView className="flex-row items-center justify-between">
						<Controller
							control={control}
							name="rememberMe"
							render={({ field: { onChange, value } }) => (
								<StyledView className="flex-row items-center">
									<Checkbox isSelected={value} onSelectedChange={onChange} />
									<StyledPressable
										onPress={() => onChange(!value)}
										className="ml-2"
									>
										<StyledText className="text-foreground">
											Remember me
										</StyledText>
									</StyledPressable>
								</StyledView>
							)}
						/>
					</StyledView>

					<Button
						className="mt-2"
						onPress={handleSubmit(onSubmit)}
						isDisabled={signIn.isPending}
					>
						{signIn.isPending ? (
							<Spinner size="sm" />
						) : (
							<Button.Label>Sign In</Button.Label>
						)}
					</Button>
				</StyledView>
			</GlassCard>

			<SocialDivider />

			{/* Social Login */}
			<AnimatedView entering={FadeInUp.duration(200)} className="mb-2 gap-3">
				<GoogleSocialButton />
			</AnimatedView>

			{/* Sign Up Link */}
			<AnimatedView
				entering={FadeInUp.duration(200)}
				className="mt-6 flex-row items-center justify-center"
			>
				<StyledText className="text-white/70">
					Don't have an account?{" "}
				</StyledText>
				<Link href="/(auth)/sign-up" asChild>
					<StyledText className="font-bold text-blue-500">Sign Up</StyledText>
				</Link>
			</AnimatedView>
		</AuthScreenWrapper>
	);
}
