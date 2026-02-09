import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
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
		provinceId: text("province_id").notNull(), // Raja Ongkir province ID
		provinceName: text("province_name").notNull(),
		cityId: text("city_id").notNull(), // Raja Ongkir city ID
		cityName: text("city_name").notNull(),
		district: text("district"),
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
