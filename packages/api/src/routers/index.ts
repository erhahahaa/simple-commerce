import type { RouterClient } from "@orpc/server";

import { protectedProcedure, publicProcedure } from "../index";
import { addressRouter } from "./address";
import { cartRouter } from "./cart";
import { categoryRouter } from "./category";
import { productRouter } from "./product";
import { shippingRouter } from "./shipping";

export const appRouter = {
	healthCheck: publicProcedure.handler(() => {
		return "OK";
	}),
	privateData: protectedProcedure.handler(({ context }) => {
		return {
			message: "This is private",
			user: context.session?.user,
		};
	}),
	// E-commerce routers
	category: categoryRouter,
	product: productRouter,
	cart: cartRouter,
	address: addressRouter,
	shipping: shippingRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
