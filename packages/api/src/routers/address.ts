import { db } from "@simple-commerce/db";
import { address } from "@simple-commerce/db/schema";
import {
	AddressSchema,
	CreateAddressSchema,
	UpdateAddressSchema,
} from "@simple-commerce/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { protectedProcedure } from "../index";

export const addressRouter = {
	/**
	 * Get all addresses for current user
	 */
	list: protectedProcedure
		.output(z.array(AddressSchema))
		.handler(async ({ context }) => {
			const userId = context.session.user.id;

			const addresses = await db.query.address.findMany({
				where: eq(address.userId, userId),
				orderBy: (addr, { desc }) => [
					desc(addr.isDefault),
					desc(addr.createdAt),
				],
			});

			return addresses;
		}),

	/**
	 * Get address by ID
	 */
	getById: protectedProcedure
		.input(z.object({ id: z.string() }))
		.output(AddressSchema.nullable())
		.handler(async ({ context, input }) => {
			const userId = context.session.user.id;

			const result = await db.query.address.findFirst({
				where: and(eq(address.id, input.id), eq(address.userId, userId)),
			});

			return result ?? null;
		}),

	/**
	 * Get default address
	 */
	getDefault: protectedProcedure
		.output(AddressSchema.nullable())
		.handler(async ({ context }) => {
			const userId = context.session.user.id;

			const result = await db.query.address.findFirst({
				where: and(eq(address.userId, userId), eq(address.isDefault, true)),
			});

			return result ?? null;
		}),

	/**
	 * Create a new address
	 */
	create: protectedProcedure
		.input(CreateAddressSchema)
		.output(AddressSchema)
		.handler(async ({ context, input }) => {
			const userId = context.session.user.id;
			const id = `addr_${crypto.randomUUID()}`;

			// Use transaction to prevent race conditions with default address logic
			const result = await db.transaction(async (tx) => {
				// If this is set as default, unset other defaults
				if (input.isDefault) {
					await tx
						.update(address)
						.set({ isDefault: false })
						.where(eq(address.userId, userId));
				}

				// If this is the first address, make it default
				const existingAddresses = await tx.query.address.findMany({
					where: eq(address.userId, userId),
				});

				const isDefault = input.isDefault || existingAddresses.length === 0;

				const [newAddress] = await tx
					.insert(address)
					.values({
						id,
						userId,
						label: input.label,
						recipientName: input.recipientName,
						phone: input.phone,
						provinceId: input.provinceId,
						provinceName: input.provinceName,
						cityId: input.cityId,
						cityName: input.cityName,
						districtId: input.districtId ?? null,
						districtName: input.districtName ?? null,
						subdistrictId: input.subdistrictId ?? null,
						subdistrictName: input.subdistrictName ?? null,
						destinationId: input.destinationId ?? null,
						district: input.district ?? null,
						postalCode: input.postalCode,
						address: input.address,
						isDefault,
					})
					.returning();

				return newAddress;
			});

			if (!result) {
				throw new Error("Failed to create address");
			}

			return result;
		}),

	/**
	 * Update an address
	 */
	update: protectedProcedure
		.input(z.object({ id: z.string(), data: UpdateAddressSchema }))
		.output(AddressSchema.nullable())
		.handler(async ({ context, input }) => {
			const userId = context.session.user.id;

			// Verify ownership
			const existing = await db.query.address.findFirst({
				where: and(eq(address.id, input.id), eq(address.userId, userId)),
			});

			if (!existing) {
				throw new Error("Address not found or access denied");
			}

			// If setting as default, unset other defaults
			if (input.data.isDefault) {
				await db
					.update(address)
					.set({ isDefault: false })
					.where(eq(address.userId, userId));
			}

			const updateData: Record<string, unknown> = {
				updatedAt: new Date(),
			};

			// Explicitly map each field to ensure proper null coercion
			if (input.data.label !== undefined) updateData.label = input.data.label;
			if (input.data.recipientName !== undefined)
				updateData.recipientName = input.data.recipientName;
			if (input.data.phone !== undefined) updateData.phone = input.data.phone;
			if (input.data.provinceId !== undefined)
				updateData.provinceId = input.data.provinceId;
			if (input.data.provinceName !== undefined)
				updateData.provinceName = input.data.provinceName;
			if (input.data.cityId !== undefined)
				updateData.cityId = input.data.cityId;
			if (input.data.cityName !== undefined)
				updateData.cityName = input.data.cityName;
			if (input.data.postalCode !== undefined)
				updateData.postalCode = input.data.postalCode;
			if (input.data.address !== undefined)
				updateData.address = input.data.address;
			if (input.data.isDefault !== undefined)
				updateData.isDefault = input.data.isDefault;

			// V2 fields - ensure null coercion for optional fields
			if (input.data.districtId !== undefined)
				updateData.districtId = input.data.districtId || null;
			if (input.data.districtName !== undefined)
				updateData.districtName = input.data.districtName || null;
			if (input.data.subdistrictId !== undefined)
				updateData.subdistrictId = input.data.subdistrictId || null;
			if (input.data.subdistrictName !== undefined)
				updateData.subdistrictName = input.data.subdistrictName || null;
			if (input.data.destinationId !== undefined)
				updateData.destinationId = input.data.destinationId ?? null;
			if (input.data.district !== undefined)
				updateData.district = input.data.district || null;

			const [result] = await db
				.update(address)
				.set(updateData)
				.where(eq(address.id, input.id))
				.returning();

			return result ?? null;
		}),

	/**
	 * Delete an address
	 */
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.output(z.object({ success: z.boolean() }))
		.handler(async ({ context, input }) => {
			const userId = context.session.user.id;

			// Verify ownership
			const existing = await db.query.address.findFirst({
				where: and(eq(address.id, input.id), eq(address.userId, userId)),
			});

			if (!existing) {
				throw new Error("Address not found or access denied");
			}

			await db.delete(address).where(eq(address.id, input.id));

			// If deleted address was default, set another as default
			if (existing.isDefault) {
				const firstAddress = await db.query.address.findFirst({
					where: eq(address.userId, userId),
				});

				if (firstAddress) {
					await db
						.update(address)
						.set({ isDefault: true })
						.where(eq(address.id, firstAddress.id));
				}
			}

			return { success: true };
		}),

	/**
	 * Set an address as default
	 */
	setDefault: protectedProcedure
		.input(z.object({ id: z.string() }))
		.output(AddressSchema)
		.handler(async ({ context, input }) => {
			const userId = context.session.user.id;

			// Verify ownership
			const existing = await db.query.address.findFirst({
				where: and(eq(address.id, input.id), eq(address.userId, userId)),
			});

			if (!existing) {
				throw new Error("Address not found or access denied");
			}

			// Unset all defaults
			await db
				.update(address)
				.set({ isDefault: false })
				.where(eq(address.userId, userId));

			// Set this as default
			const [result] = await db
				.update(address)
				.set({ isDefault: true, updatedAt: new Date() })
				.where(eq(address.id, input.id))
				.returning();

			if (!result) {
				throw new Error("Failed to update address");
			}

			return result;
		}),
};
