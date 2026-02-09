import { index, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { product } from "./product";

export const wishlist = pgTable(
	"wishlist",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		productId: text("product_id")
			.notNull()
			.references(() => product.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("wishlist_user_idx").on(table.userId),
		index("wishlist_product_idx").on(table.productId),
		unique("wishlist_user_product_unique").on(table.userId, table.productId),
	],
);
