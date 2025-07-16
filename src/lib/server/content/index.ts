import type { DrizzleD1Database } from "drizzle-orm/d1";
import { getDB } from "../db/index";
import { petAttachments, petsTable } from "../db/schema";
import { eq, type InferInsertModel } from "drizzle-orm";

export async function createPet(
	newPet: InferInsertModel<typeof petsTable>,
	imageFiles: File[] | Blob[],
	platform: NonNullable<App.Platform["env"]>,
): Promise<number> {
	const { insertedId } = (
		await getDB(platform.db)
			.insert(petsTable)
			.values(newPet)
			.returning({ insertedId: petsTable.id })
	)[0];

	await processAndRegisterPetImages(insertedId, imageFiles, platform);
	return insertedId;
}

export async function deletePet(
	petId: number,
	platform: NonNullable<App.Platform["env"]>,
): Promise<void> {
	const attachments = await getDB(platform.db)
		.delete(petAttachments)
		.where(eq(petAttachments.petId, petId))
		.returning();
	for (const attachment of attachments) {
		await platform.user_photography.delete(attachment.storageId);
	}

	await getDB(platform.db).delete(petsTable).where(eq(petsTable.id, petId));
}

/**
 * Normalize and register image attachments for a pet.
 *
 * @param petId The pet's database ID
 * @param files An array of File or Blob objects (from FormData)
 * @returns Array of registered attachment IDs
 */
export async function processAndRegisterPetImages(
	petId: number,
	files: File[] | Blob[],
	platform: NonNullable<App.Platform["env"]>,
): Promise<string[]> {
	const registeredIds: string[] = [];

	for (const file of files) {
		if (file.size == 0) {
			continue; // Skip empty files lol
		}
		if (file.size > 1000 ** 2 * 500) {
			continue; // Skip files that are too big silently (oops)
		}

		const arrayBuffer = await file.arrayBuffer();

		const storageId = crypto.randomUUID();

		// TODO: normalize this

		platform.user_photography.put(storageId, arrayBuffer, {
			httpMetadata: {
				contentType: file.type,
			},
		});
		await getDB(platform.db).insert(petAttachments).values({
			petId,
			storageId,
		});
		registeredIds.push(storageId);
	}
	return registeredIds;
}

export async function getFileAttachmentsFor(
	petId: number,
	db: DrizzleD1Database,
) {
	const attachments = await db
		.select()
		.from(petAttachments)
		.where(eq(petAttachments.petId, petId));

	return attachments.map((attachment) => attachment.storageId);
}
