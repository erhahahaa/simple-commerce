import { expoClient } from "@better-auth/expo/client";
import { env } from "@simple-commerce/env/native";
import { createAuthClient } from "better-auth/react";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const configScheme = Constants.expoConfig?.scheme;
const scheme = Array.isArray(configScheme)
	? configScheme[0]
	: (configScheme ?? "simple-commerce");

export const authClient = createAuthClient({
	baseURL: env.EXPO_PUBLIC_SERVER_URL,
	plugins: [
		expoClient({
			scheme,
			storagePrefix: scheme,
			storage: SecureStore,
		}),
	],
});
