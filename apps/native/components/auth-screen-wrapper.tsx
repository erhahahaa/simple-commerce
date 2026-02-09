import type { PropsWithChildren } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function AuthScreenWrapper({ children }: PropsWithChildren) {
	const insets = useSafeAreaInsets();

	return (
		<KeyboardAwareScrollView
			contentContainerStyle={{
				flexGrow: 1,
				paddingTop: 20,
				paddingBottom: insets.bottom + 20,
				paddingHorizontal: 20,
			}}
			keyboardShouldPersistTaps="handled"
			showsVerticalScrollIndicator={false}
			bottomOffset={20}
		>
			{children}
		</KeyboardAwareScrollView>
	);
}
