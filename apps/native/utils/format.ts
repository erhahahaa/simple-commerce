/**
 * Format a number as Indonesian Rupiah currency
 * @param price - The price in IDR (smallest unit)
 * @returns Formatted currency string (e.g., "Rp 150.000")
 */
export function formatCurrency(price: number): string {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(price);
}

/**
 * Format a number with thousand separators
 * @param num - The number to format
 * @returns Formatted number string (e.g., "1.500.000")
 */
export function formatNumber(num: number): string {
	return new Intl.NumberFormat("id-ID").format(num);
}

/**
 * Format a date in short format (e.g., "11 Feb 2026, 14:30")
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDateShort(date: Date | string): string {
	return new Intl.DateTimeFormat("id-ID", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));
}

/**
 * Format a date in long format (e.g., "11 Februari 2026, 14:30")
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDateLong(date: Date | string): string {
	return new Intl.DateTimeFormat("id-ID", {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));
}

/**
 * Format a date without time (e.g., "11 Feb 2026")
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDateOnly(date: Date | string): string {
	return new Intl.DateTimeFormat("id-ID", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(date));
}
