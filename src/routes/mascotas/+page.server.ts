import { db } from "$lib/server/db";
import { desc, type InferSelectModel } from "drizzle-orm";
import { petsTable } from "$lib/server/db/schema";
import { getUserDataById } from "$lib/server/auth/userData";

export async function load() {
	// Fetch recent pets from database
	const recentPets: (InferSelectModel<typeof petsTable> & {
		authorName: string;
	})[] = await Promise.all(
		(
			await db
				.select()
				.from(petsTable)
				.orderBy(desc(petsTable.timestamp))
				.limit(10)
		).map(async (pet) => {
			const authorId = pet.author;
			const { name } = await getUserDataById(authorId);
			return { ...pet, authorName: name };
		}),
	);

	return {
		recentPets,
	};
}
