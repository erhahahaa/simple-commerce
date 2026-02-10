import { sql } from "drizzle-orm";
import { db } from "./index";
import * as schema from "./schema";

export async function resetDatabase() {
	// turn off foreign key checks
	await db.execute(sql`SET session_replication_role = 'replica';`);

	// truncate all tables
	for (const table of Object.values(schema)) {
		if (typeof table !== "object" || !("name" in table)) {
			continue;
		}
		await db.delete(table).where(sql`1=1`);
	}

	// turn on foreign key checks
	await db.execute(sql`SET session_replication_role = 'origin';`);
}

resetDatabase()
	.then(() => {
		console.log("Database reset completed.");
		process.exit(0);
	})
	.catch((error) => {
		console.error("Error resetting database:", error);
		process.exit(1);
	});
