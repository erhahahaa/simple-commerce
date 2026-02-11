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
	districtId: z.string().nullable(),
	districtName: z.string().nullable(),
	subdistrictId: z.string().nullable(),
	subdistrictName: z.string().nullable(),
	destinationId: z.number().nullable(), // Raja Ongkir V2 destination ID
	district: z.string().nullable(), // Legacy field
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
	// Legacy fields - optional for V2, kept for backward compatibility
	provinceId: z.string().optional().default(""),
	provinceName: z.string().min(1),
	cityId: z.string().optional().default(""),
	cityName: z.string().min(1),
	// V2 location fields
	districtId: z.string().optional(),
	districtName: z.string().optional(),
	subdistrictId: z.string().optional(),
	subdistrictName: z.string().optional(),
	destinationId: z.number().optional(), // Raja Ongkir V2 destination ID
	district: z.string().optional(), // Legacy field
	postalCode: z.string().min(5).max(10),
	address: z.string().min(10).max(500),
	isDefault: z.boolean().default(false),
});

export type CreateAddress = z.infer<typeof CreateAddressSchema>;

export const UpdateAddressSchema = CreateAddressSchema.partial();

export type UpdateAddress = z.infer<typeof UpdateAddressSchema>;

// ============================================
// Raja Ongkir V2 API Response Schemas
// ============================================

/**
 * V2 API Meta Response wrapper
 */
export const ApiMetaSchema = z.object({
	message: z.string(),
	code: z.number(),
	status: z.string(),
});

export type ApiMeta = z.infer<typeof ApiMetaSchema>;

/**
 * Domestic Destination (from search endpoint)
 * Used for autocomplete destination search
 */
export const DomesticDestinationSchema = z.object({
	id: z.number(),
	label: z.string(),
	province_name: z.string(),
	city_name: z.string(),
	district_name: z.string(),
	subdistrict_name: z.string(),
	zip_code: z.string(),
});

export type DomesticDestination = z.infer<typeof DomesticDestinationSchema>;

/**
 * Supported couriers for V2 API
 * JNE, SiCepat, J&T Express
 */
export const CourierSchema = z.enum(["jne", "sicepat", "jnt"]);

export type Courier = z.infer<typeof CourierSchema>;

/**
 * All available couriers in Raja Ongkir V2
 */
export const AllCouriersSchema = z.enum([
	"jne",
	"sicepat",
	"ide",
	"sap",
	"ninja",
	"jnt",
	"tiki",
	"wahana",
	"pos",
	"sentral",
	"lion",
	"rex",
]);

export type AllCouriers = z.infer<typeof AllCouriersSchema>;

/**
 * Shipping Cost Result (V2 format - flat structure)
 */
export const ShippingCostResultV2Schema = z.object({
	name: z.string(), // Courier name
	code: z.string(), // Courier code (jne, sicepat, jnt)
	service: z.string(), // Service type (REG, YES, etc.)
	description: z.string(), // Service description
	cost: z.number(), // Cost in IDR
	etd: z.string(), // Estimated time of delivery
});

export type ShippingCostResultV2 = z.infer<typeof ShippingCostResultV2Schema>;

/**
 * Calculate domestic cost input schema
 */
export const CalculateDomesticCostSchema = z.object({
	origin: z.number(), // Destination ID (subdistrict level)
	destination: z.number(), // Destination ID (subdistrict level)
	weight: z.number().int().min(1), // Weight in grams
	courier: CourierSchema,
	price: z.enum(["lowest", "highest"]).optional(),
});

export type CalculateDomesticCost = z.infer<typeof CalculateDomesticCostSchema>;

/**
 * Search destination input schema
 */
export const SearchDestinationSchema = z.object({
	search: z.string().min(1),
	limit: z.number().int().min(1).max(100).optional().default(10),
	offset: z.number().int().min(0).optional().default(0),
});

export type SearchDestination = z.infer<typeof SearchDestinationSchema>;

/**
 * Track waybill input schema
 */
export const TrackWaybillSchema = z.object({
	awb: z.string().min(1),
	courier: CourierSchema,
});

export type TrackWaybill = z.infer<typeof TrackWaybillSchema>;

/**
 * Tracking manifest item
 */
export const TrackingManifestSchema = z.object({
	manifest_code: z.string(),
	manifest_description: z.string(),
	manifest_date: z.string(),
	manifest_time: z.string(),
	city_name: z.string(),
});

export type TrackingManifest = z.infer<typeof TrackingManifestSchema>;

/**
 * Tracking result schema
 */
export const TrackingResultSchema = z.object({
	delivered: z.boolean(),
	summary: z.object({
		courier_code: z.string(),
		courier_name: z.string(),
		waybill_number: z.string(),
		service_code: z.string(),
		waybill_date: z.string(),
		shipper_name: z.string(),
		receiver_name: z.string(),
		origin: z.string(),
		destination: z.string(),
		status: z.string(),
	}),
	details: z.object({
		waybill_number: z.string(),
		waybill_date: z.string(),
		waybill_time: z.string(),
		weight: z.string(),
		origin: z.string(),
		destination: z.string(),
		shipper_name: z.string(),
		shipper_address1: z.string(),
		shipper_address2: z.string(),
		shipper_address3: z.string(),
		shipper_city: z.string(),
		receiver_name: z.string(),
		receiver_address1: z.string(),
		receiver_address2: z.string(),
		receiver_address3: z.string(),
		receiver_city: z.string(),
	}),
	delivery_status: z.object({
		status: z.string(),
		pod_receiver: z.string(),
		pod_date: z.string(),
		pod_time: z.string(),
	}),
	manifest: z.array(TrackingManifestSchema),
});

export type TrackingResult = z.infer<typeof TrackingResultSchema>;

// ============================================
// Legacy Shipping Schemas (V1 - kept for backward compatibility)
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
	origin: z.string(), // City ID (legacy)
	destination: z.string(), // City ID (legacy)
	weight: z.number().int().min(1), // Weight in grams
	courier: z.enum(["jne", "pos", "tiki"]),
});

export type GetShippingCost = z.infer<typeof GetShippingCostSchema>;
