import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { AppRouterClient } from "@simple-commerce/api/routers/index";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { Platform } from "react-native";

import { authClient } from "@/lib/auth-client";

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			// Log query errors for debugging (consider using a logging service in production)
			if (__DEV__) {
				console.error("[QueryCache Error]:", error);
			}
		},
	}),
});

export const link = new RPCLink({
	url: "https://demo-simple-commerce-api.zenta.dev/rpc",
	fetch:
		Platform.OS !== "web"
			? undefined
			: (url, options) =>
					fetch(url, {
						...options,
						credentials: "include",
					}),
	headers() {
		if (Platform.OS === "web") {
			return {};
		}
		const headers = new Map<string, string>();
		const cookies = authClient.getCookie();
		if (cookies) {
			headers.set("Cookie", cookies);
		}
		return Object.fromEntries(headers);
	},
});

export const client: AppRouterClient = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
