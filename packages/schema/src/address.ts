import { z } from "zod";

// ============================================
// Address Schemas
// ============================================

export const AddressSchema = z.object({
	id: z.string(),
	userId: z.string(),
	label: z.string(),
	recipientName: z.string(),
	phone: z.string(),
	provinceId: z.string(),
	provinceName: z.string(),
	cityId: z.string(),
	cityName: z.string(),
	district: z.string().nullable(),
	postalCode: z.string(),
	address: z.string(),
	isDefault: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type Address = z.infer<typeof AddressSchema>;

export const CreateAddressSchema = z.object({
	label: z.string().min(1).max(50),
	recipientName: z.string().min(1).max(100),
	phone: z.string().min(10).max(15),
	provinceId: z.string(),
	provinceName: z.string(),
	cityId: z.string(),
	cityName: z.string(),
	district: z.string().optional(),
	postalCode: z.string().min(5).max(10),
	address: z.string().min(10).max(500),
	isDefault: z.boolean().default(false),
});

export type CreateAddress = z.infer<typeof CreateAddressSchema>;

export const UpdateAddressSchema = CreateAddressSchema.partial();

export type UpdateAddress = z.infer<typeof UpdateAddressSchema>;

// ============================================
// Shipping Schemas (Raja Ongkir)
// ============================================

export const ProvinceSchema = z.object({
	province_id: z.string(),
	province: z.string(),
});

export type Province = z.infer<typeof ProvinceSchema>;

export const CitySchema = z.object({
	city_id: z.string(),
	province_id: z.string(),
	province: z.string(),
	type: z.string(),
	city_name: z.string(),
	postal_code: z.string(),
});

export type City = z.infer<typeof CitySchema>;

export const ShippingCostItemSchema = z.object({
	service: z.string(),
	description: z.string(),
	cost: z.array(
		z.object({
			value: z.number(),
			etd: z.string(),
			note: z.string(),
		}),
	),
});

export type ShippingCostItem = z.infer<typeof ShippingCostItemSchema>;

export const ShippingCostResultSchema = z.object({
	code: z.string(),
	name: z.string(),
	costs: z.array(ShippingCostItemSchema),
});

export type ShippingCostResult = z.infer<typeof ShippingCostResultSchema>;

export const GetShippingCostSchema = z.object({
	origin: z.string(), // City ID
	destination: z.string(), // City ID
	weight: z.number().int().min(1), // Weight in grams
	courier: z.enum(["jne", "pos", "tiki"]),
});

export type GetShippingCost = z.infer<typeof GetShippingCostSchema>;
