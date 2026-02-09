import {
	index,
	integer,
	json,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { category } from "./category";

export const product = pgTable(
	"product",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		slug: text("slug").notNull().unique(),
		description: text("description"),
		price: integer("price").notNull(), // Price in cents (IDR)
		stock: integer("stock").notNull().default(0),
		images: json("images").$type<string[]>().default([]),
		categoryId: text("category_id").references(() => category.id, {
			onDelete: "set null",
		}),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("product_slug_idx").on(table.slug),
		index("product_category_idx").on(table.categoryId),
	],
);
