import { useToast } from "heroui-native";
import { useSocialAuth } from "@/hooks/auth";
import { SocialButton } from "./social-button";

const PROVIDER = "google" as const;

export function GoogleSocialButton() {
	const googleAuth = useSocialAuth(PROVIDER);
	const { toast } = useToast();

	const handlePress = async () => {
		if (googleAuth.isPending) return;

		const result = await googleAuth.mutateAsync();

		// Handle result accordingly
		if (!result.success) {
			toast.show({
				variant: "danger",
				label: "Google Sign-In Failed",
				description: result.error,
			});
		}
	};

	return (
		<SocialButton
			provider={PROVIDER}
			onPress={handlePress}
			isLoading={googleAuth.isPending}
		/>
	);
}
