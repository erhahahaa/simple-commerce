import type { DomesticDestination } from "@simple-commerce/schema";

/**
 * Format destination for display in address forms
 */
export function getDestinationDisplay(destination: DomesticDestination | null) {
	if (!destination) return null;
	return {
		main: `${destination.subdistrict_name}, ${destination.district_name}`,
		sub: `${destination.city_name}, ${destination.province_name} - ${destination.zip_code}`,
	};
}

/**
 * Build address payload from form fields and selected destination
 * Used by both create and update address forms
 */
export function buildAddressPayload(
	fields: {
		label: string;
		recipientName: string;
		phone: string;
		address: string;
		isDefault: boolean;
	},
	destination: DomesticDestination,
) {
	return {
		label: fields.label.trim(),
		recipientName: fields.recipientName.trim(),
		phone: fields.phone.trim(),
		// Legacy fields - empty for V2
		provinceId: "",
		provinceName: destination.province_name,
		cityId: "",
		cityName: destination.city_name,
		// V2 location fields
		districtId: "",
		districtName: destination.district_name,
		subdistrictId: "",
		subdistrictName: destination.subdistrict_name,
		destinationId: destination.id,
		postalCode: destination.zip_code,
		address: fields.address.trim(),
		isDefault: fields.isDefault,
	};
}
