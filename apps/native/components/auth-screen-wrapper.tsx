import type { PropsWithChildren } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function AuthScreenWrapper({ children }: PropsWithChildren) {
	const insets = useSafeAreaInsets();

	return (
		<ScrollView
			contentContainerStyle={{
				flexGrow: 1,
				paddingTop: 20,
				paddingBottom: insets.bottom + 20,
				paddingHorizontal: 20,
			}}
			keyboardShouldPersistTaps="handled"
			showsVerticalScrollIndicator={false}
		>
			{children}
		</ScrollView>
	);
}
