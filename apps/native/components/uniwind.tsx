import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { withUniwind } from "uniwind";

export const StyledText = withUniwind(Text);
export const StyledView = withUniwind(View);
export const StyledPressable = withUniwind(Pressable);
export const AnimatedView = Animated.createAnimatedComponent(StyledView);
export const AnimatedPressable =
	Animated.createAnimatedComponent(StyledPressable);
export const StyledIonicons = withUniwind(Ionicons);
