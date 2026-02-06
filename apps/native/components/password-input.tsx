import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Input } from "heroui-native";
import { useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { StyledPressable, StyledView } from "@/components/uniwind";

type PasswordInputProps = {
	placeholder?: string;
	value: string;
	onChangeText: (text: string) => void;
	onBlur?: () => void;
};

export function PasswordInput({
	placeholder = "Enter password",
	value,
	onChangeText,
	onBlur,
}: PasswordInputProps) {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const togglePasswordVisibility = () => {
		if (Platform.OS === "ios") {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		}
		setIsPasswordVisible(!isPasswordVisible);
	};

	return (
		<StyledView className="relative">
			<Input
				placeholder={placeholder}
				value={value}
				onChangeText={onChangeText}
				onBlur={onBlur}
				secureTextEntry={!isPasswordVisible}
				autoCapitalize="none"
				autoCorrect={false}
				style={styles.input}
			/>
			<StyledPressable
				className="absolute top-0 right-0 bottom-0 items-center justify-center px-4"
				onPress={togglePasswordVisibility}
				hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
			>
				<Ionicons
					name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
					size={18}
					color="#9ca3af"
				/>
			</StyledPressable>
		</StyledView>
	);
}

const styles = StyleSheet.create({
	input: {
		paddingRight: 48,
	},
});
