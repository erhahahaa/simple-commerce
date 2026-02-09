import { env } from "@simple-commerce/env/server";
import {
	CalculateDomesticCostSchema,
	type DomesticDestination,
	DomesticDestinationSchema,
	SearchDestinationSchema,
	type ShippingCostResultV2,
	ShippingCostResultV2Schema,
	type TrackingResult,
	TrackingResultSchema,
	TrackWaybillSchema,
} from "@simple-commerce/schema";
import { z } from "zod";

import { publicProcedure } from "../index";

// ============================================
// Raja Ongkir API V2 Types
// ============================================

/**
 * V2 API Response wrapper
 */
interface RajaOngkirV2Response<T> {
	meta: {
		message: string;
		code: number;
		status: string;
	};
	data: T;
}

// ============================================
// Raja Ongkir API V2 Helper
// ============================================

/**
 * Make a request to the Raja Ongkir V2 API
 */
async function rajaOngkirV2Fetch<T>(
	endpoint: string,
	options?: RequestInit,
): Promise<T> {
	const apiKey = env.RAJAONGKIR_API_KEY;
	const baseUrl = env.RAJAONGKIR_BASE_URL;

	if (!apiKey) {
		throw new Error("Raja Ongkir API key not configured");
	}

	const response = await fetch(`${baseUrl}${endpoint}`, {
		...options,
		headers: {
			key: apiKey,
			...options?.headers,
		},
	});

	if (!response.ok) {
		throw new Error(`Raja Ongkir API error: ${response.statusText}`);
	}

	const data = (await response.json()) as RajaOngkirV2Response<T>;

	if (data.meta?.code !== 200) {
		throw new Error(data.meta?.message || "Raja Ongkir API error");
	}

	return data.data;
}

// ============================================
// Shipping Router - V2 Endpoints
// ============================================

export const shippingRouter = {
	/**
	 * Search domestic destinations (autocomplete)
	 * Returns destinations with subdistrict-level precision
	 */
	searchDestination: publicProcedure
		.input(SearchDestinationSchema)
		.output(z.array(DomesticDestinationSchema))
		.handler(async ({ input }) => {
			const params = new URLSearchParams({
				search: input.search,
				limit: input.limit?.toString() ?? "10",
				offset: input.offset?.toString() ?? "0",
			});

			const results = await rajaOngkirV2Fetch<DomesticDestination[]>(
				`/destination/domestic-destination?${params.toString()}`,
				{ headers: { method: "GET" } },
			);

			return results ?? [];
		}),

	/**
	 * Calculate domestic shipping cost (V2)
	 * Uses destination IDs (subdistrict level) for precise calculation
	 */
	calculateCost: publicProcedure
		.input(CalculateDomesticCostSchema)
		.output(z.array(ShippingCostResultV2Schema))
		.handler(async ({ input }) => {
			const bodyParams: Record<string, string> = {
				origin: input.origin.toString(),
				destination: input.destination.toString(),
				weight: input.weight.toString(),
				courier: input.courier,
			};

			if (input.price) {
				bodyParams.price = input.price;
			}
			const results = await rajaOngkirV2Fetch<ShippingCostResultV2[]>(
				"/calculate/domestic-cost",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: new URLSearchParams(bodyParams),
				},
			);

			return results ?? [];
		}),

	/**
	 * Track waybill/AWB number
	 * Get real-time shipment tracking information
	 */
	trackWaybill: publicProcedure
		.input(TrackWaybillSchema)
		.output(TrackingResultSchema.nullable())
		.handler(async ({ input }) => {
			const bodyParams: Record<string, string> = {
				awb: input.awb,
				courier: input.courier,
			};

			const results = await rajaOngkirV2Fetch<TrackingResult | null>(
				"/track/waybill",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: new URLSearchParams(bodyParams),
				},
			);

			return results;
		}),
};
