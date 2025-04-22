import { db } from "$lib/server/db";
import { desc } from "drizzle-orm";
import { petsTable } from "$lib/server/db/schema";

export async function load() {
	// Fetch recent pets from database
	const recentPets = await db
		.select()
		.from(petsTable)
		.orderBy(desc(petsTable.timestamp))
		.limit(10);

	return {
		recentPets,
	};
}
