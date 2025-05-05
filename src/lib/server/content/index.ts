import { db } from "../db/index";
import { petAttachments, petsTable } from "../db/schema";
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { eq, type InferInsertModel } from "drizzle-orm";

const USER_CONTENT = process.env.USER_CONTENT;

const USER_CONTENT_ERROR = new Error(
	"The USER_CONTENT environment variable is not set. Please set it to the user content directory.",
);

export async function createPet(
	newPet: InferInsertModel<typeof petsTable>,
	imageFiles: File[] | Blob[],
): Promise<number> {
	const { insertedId } = (
		await db
			.insert(petsTable)
			.values(newPet)
			.returning({ insertedId: petsTable.id })
	)[0];

	await processAndRegisterPetImages(insertedId, imageFiles);
	return insertedId;
}

export async function deletePet(petId: number): Promise<void> {
	if (!USER_CONTENT) {
		throw USER_CONTENT_ERROR;
	}

	const attachments = await db
		.delete(petAttachments)
		.where(eq(petAttachments.petId, petId))
		.returning();
	for (const attachment of attachments) {
		const filePath = path.join(USER_CONTENT, attachment.attachmentId);
		try {
			await fs.unlink(filePath);
		} catch (error) {
			console.error(`Error deleting file ${filePath}:`, error);
		}
	}

	await db.delete(petsTable).where(eq(petsTable.id, petId));
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
): Promise<string[]> {
	if (!USER_CONTENT) {
		throw USER_CONTENT_ERROR;
	}

	await fs.mkdir(USER_CONTENT, { recursive: true });
	const registeredIds: string[] = [];

	for (const file of files) {
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const image = sharp(buffer);

		// Normalize: convert to JPEG, resize to max 1200x1200px, strip metadata
		const normalized = await image
			.autoOrient()
			.resize(1200, 1200, { fit: "inside" })
			.jpeg({ quality: 85 })
			.toBuffer();

		const attachmentId = randomUUID();
		const filename = `${attachmentId}.jpg`;
		const outPath = path.join(USER_CONTENT, filename);
		await fs.writeFile(outPath, normalized);

		await db.insert(petAttachments).values({
			petId,
			attachmentId: filename,
		});
		registeredIds.push(filename);
	}
	return registeredIds;
}

export async function getFileAttachmentsFor(petId: number) {
	const attachments = await db
		.select()
		.from(petAttachments)
		.where(eq(petAttachments.petId, petId));

	return attachments.map((attachment) => attachment.attachmentId);
}
