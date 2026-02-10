import { getTableName, is, sql, Table } from "drizzle-orm";
import { db } from "./index";
import * as schema from "./schema";

export async function resetDatabase() {
	const tableNames = Object.values(schema)
		.filter(
			(table) =>
				is(table, Table) && typeof table === "object" && table !== null,
		)
		.map((table) => `"${getTableName(table)}"`)
		.join(", ");

	if (!tableNames) {
		console.warn("No tables found to reset.");
		return;
	}

	await db.execute(
		sql.raw(`
			TRUNCATE ${tableNames}
			RESTART IDENTITY
			CASCADE;
		`),
	);
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
