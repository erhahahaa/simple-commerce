import {
	boolean,
	index,
	integer,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const address = pgTable(
	"address",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		label: text("label").notNull(), // e.g., "Home", "Office"
		recipientName: text("recipient_name").notNull(),
		phone: text("phone").notNull(),
		// Raja Ongkir V2 location fields
		provinceId: text("province_id").notNull(), // Province ID (legacy, kept for reference)
		provinceName: text("province_name").notNull(),
		cityId: text("city_id").notNull(), // City ID (legacy, kept for reference)
		cityName: text("city_name").notNull(),
		districtId: text("district_id"), // District ID (V2)
		districtName: text("district_name"), // District name (V2)
		subdistrictId: text("subdistrict_id"), // Subdistrict ID (V2)
		subdistrictName: text("subdistrict_name"), // Subdistrict name (V2)
		destinationId: integer("destination_id"), // Raja Ongkir V2 destination ID for cost calculation
		district: text("district"), // Legacy field (free text)
		postalCode: text("postal_code").notNull(),
		address: text("address").notNull(), // Full street address
		isDefault: boolean("is_default").default(false).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("address_user_idx").on(table.userId)],
);
