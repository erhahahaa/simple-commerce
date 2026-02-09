import { env } from "@simple-commerce/env/server";
import {
	CitySchema,
	GetShippingCostSchema,
	ProvinceSchema,
	ShippingCostResultSchema,
} from "@simple-commerce/schema";
import { z } from "zod";

import { publicProcedure } from "../index";

// Raja Ongkir API response type
interface RajaOngkirResponse {
	rajaongkir: {
		status: {
			code: number;
			description: string;
		};
		results: unknown;
	};
}

// Raja Ongkir API helper
async function rajaOngkirFetch(endpoint: string, options?: RequestInit) {
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

	const data = (await response.json()) as RajaOngkirResponse;

	if (data.rajaongkir?.status?.code !== 200) {
		throw new Error(
			data.rajaongkir?.status?.description || "Raja Ongkir API error",
		);
	}

	return data.rajaongkir.results;
}

export const shippingRouter = {
	/**
	 * Get all provinces
	 */
	getProvinces: publicProcedure
		.output(z.array(ProvinceSchema))
		.handler(async () => {
			const results = await rajaOngkirFetch("/province");
			return results as z.infer<typeof ProvinceSchema>[];
		}),

	/**
	 * Get cities by province ID
	 */
	getCities: publicProcedure
		.input(z.object({ provinceId: z.string() }))
		.output(z.array(CitySchema))
		.handler(async ({ input }) => {
			const results = await rajaOngkirFetch(
				`/city?province=${input.provinceId}`,
			);
			return results as z.infer<typeof CitySchema>[];
		}),

	/**
	 * Get all cities (no filter)
	 */
	getAllCities: publicProcedure
		.output(z.array(CitySchema))
		.handler(async () => {
			const results = await rajaOngkirFetch("/city");
			return results as z.infer<typeof CitySchema>[];
		}),

	/**
	 * Get city by ID
	 */
	getCityById: publicProcedure
		.input(z.object({ cityId: z.string() }))
		.output(CitySchema.nullable())
		.handler(async ({ input }) => {
			const results = await rajaOngkirFetch(`/city?id=${input.cityId}`);
			return (results as z.infer<typeof CitySchema>) || null;
		}),

	/**
	 * Calculate shipping cost
	 */
	getCost: publicProcedure
		.input(GetShippingCostSchema)
		.output(z.array(ShippingCostResultSchema))
		.handler(async ({ input }) => {
			const apiKey = env.RAJAONGKIR_API_KEY;
			const baseUrl = env.RAJAONGKIR_BASE_URL;

			if (!apiKey) {
				throw new Error("Raja Ongkir API key not configured");
			}

			const response = await fetch(`${baseUrl}/cost`, {
				method: "POST",
				headers: {
					key: apiKey,
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					origin: input.origin,
					destination: input.destination,
					weight: input.weight.toString(),
					courier: input.courier,
				}),
			});

			if (!response.ok) {
				throw new Error(`Raja Ongkir API error: ${response.statusText}`);
			}

			const data = (await response.json()) as RajaOngkirResponse;

			if (data.rajaongkir?.status?.code !== 200) {
				throw new Error(
					data.rajaongkir?.status?.description || "Raja Ongkir API error",
				);
			}

			return data.rajaongkir.results as z.infer<
				typeof ShippingCostResultSchema
			>[];
		}),
};
