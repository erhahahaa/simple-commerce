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

			// If this is set as default, unset other defaults
			if (input.isDefault) {
				await db
					.update(address)
					.set({ isDefault: false })
					.where(eq(address.userId, userId));
			}

			// If this is the first address, make it default
			const existingAddresses = await db.query.address.findMany({
				where: eq(address.userId, userId),
			});

			const isDefault = input.isDefault || existingAddresses.length === 0;

			const [result] = await db
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
					district: input.district ?? null,
					postalCode: input.postalCode,
					address: input.address,
					isDefault,
				})
				.returning();

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
				throw new Error("Address not found");
			}

			// If setting as default, unset other defaults
			if (input.data.isDefault) {
				await db
					.update(address)
					.set({ isDefault: false })
					.where(eq(address.userId, userId));
			}

			const [result] = await db
				.update(address)
				.set({
					...input.data,
					updatedAt: new Date(),
				})
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
				throw new Error("Address not found");
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
				throw new Error("Address not found");
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
