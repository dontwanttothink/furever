import { db } from "$lib/server/db";
import { desc, type InferSelectModel } from "drizzle-orm";
import { petsTable } from "$lib/server/db/schema";
import { getUserDataById } from "$lib/server/auth/userData";
import { getFileAttachmentsFor } from "$lib/server/content";

export async function load() {
	// Fetch recent pets from database
	const recentPets: (InferSelectModel<typeof petsTable> & {
		authorName: string;
		attachmentUUIDs: string[];
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
			return {
				...pet,
				authorName: name,
				attachmentUUIDs: await getFileAttachmentsFor(pet.id),
			};
		}),
	);

	return {
		recentPets,
	};
}
