import { getDB } from "$lib/server/db";
import { desc, type InferSelectModel } from "drizzle-orm";
import { petsTable } from "$lib/server/db/schema";
import { getUserDataById } from "$lib/server/auth/userData";
import { getFileAttachmentsFor } from "$lib/server/content";

export async function load({ platform }) {
	console.log(platform?.env);
	if (!platform?.env?.db) {
		throw new TypeError("Missing database binding");
	}

	const db = getDB(platform.env.db);

	// Fetch recent pets from database
	const recentPets: (InferSelectModel<typeof petsTable> & {
		authorName: string;
		attachmentUUIDs: string[];
	})[] = await Promise.all(
		(
			await getDB(platform.env.db)
				.select()
				.from(petsTable)
				.orderBy(desc(petsTable.timestamp))
				.limit(10)
		).map(async (pet) => {
			const authorId = pet.author;
			const { name } = await getUserDataById(authorId, db);
			return {
				...pet,
				authorName: name,
				attachmentUUIDs: await getFileAttachmentsFor(pet.id, db),
			};
		}),
	);

	return {
		recentPets,
	};
}
