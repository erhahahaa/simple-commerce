import type { RouterClient } from "@orpc/server";

import { protectedProcedure, publicProcedure } from "../index";
import { addressRouter } from "./address";
import { cartRouter } from "./cart";
import { categoryRouter } from "./category";
import { orderRouter } from "./order";
import { paymentRouter } from "./payment";
import { productRouter } from "./product";
import { shippingRouter } from "./shipping";
import { userRouter } from "./user";
import { wishlistRouter } from "./wishlist";

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
	// User profile router
	user: userRouter,
	// E-commerce routers
	order: orderRouter,
	// Payment router
	payment: paymentRouter,
	// E-commerce routers
	category: categoryRouter,
	product: productRouter,
	cart: cartRouter,
	address: addressRouter,
	shipping: shippingRouter,
	wishlist: wishlistRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
