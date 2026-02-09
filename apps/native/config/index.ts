/**
 * App configuration
 *
 * These values should be updated for production deployment.
 * For a fully production-ready app, consider using expo-constants
 * with app.config.js to load these from environment variables.
 */

export const config = {
	// Legal & Support URLs
	urls: {
		termsOfService: "https://example.com/terms",
		privacyPolicy: "https://example.com/privacy",
		helpCenter: "https://example.com/help",
		supportEmail: "mailto:support@simplecommerce.com",
	},

	// Locale & Currency
	locale: {
		currency: "IDR",
		locale: "id-ID",
	},

	// Checkout defaults
	checkout: {
		// Store origin destination ID for shipping calculation (Raja Ongkir V2)
		// This should be the subdistrict-level destination ID from Raja Ongkir.
		// Use the search endpoint to find your store's destination ID.
		// Example: Search for your store's location and use the returned 'id' field.
		storeOriginDestinationId: 17707 as number,
		// Default product weight in grams (used when product weight is not specified)
		defaultProductWeight: 500,
		// Supported couriers (Raja Ongkir V2)
		supportedCouriers: ["jne", "sicepat", "jnt"] as const,
	},
} as const;

/**
 * Format currency using app locale settings
 */
export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat(config.locale.locale, {
		style: "currency",
		currency: config.locale.currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}
