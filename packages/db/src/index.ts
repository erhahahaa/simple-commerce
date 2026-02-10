import { env } from "@simple-commerce/env/server";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

export const db = drizzle(env.DATABASE_URL, { schema });

export async function markUserVerified(userId: string): Promise<void> {
	try {
		await db
			.update(schema.user)
			.set({ emailVerified: true })
			.where(eq(schema.user.id, userId));
	} catch (error) {
		console.error("Error marking user as verified:", error);
		return;
	}
}
