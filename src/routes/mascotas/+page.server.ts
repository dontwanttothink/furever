import { getDB } from "$lib/server/db";
import { desc, type InferSelectModel } from "drizzle-orm";
import { petsTable } from "$lib/server/db/schema";
import { getUserDataById } from "$lib/server/auth/userData";
import { getFileAttachmentsFor } from "$lib/server/content";

export async function load({ platform }) {
	if (!platform?.env) {
		throw new TypeError();
	}

	const env = platform.env;

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
			const { name } = await getUserDataById(authorId, env);
			return {
				...pet,
				authorName: name,
				attachmentUUIDs: await getFileAttachmentsFor(pet.id, env),
			};
		}),
	);

	return {
		recentPets,
	};
}
