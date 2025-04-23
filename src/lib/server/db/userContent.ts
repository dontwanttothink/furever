import { db } from "./index";
import { petAttachments } from "./schema";
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";

const USER_CONTENT = process.env.USER_CONTENT;

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
		throw new Error(
			"The USER_CONTENT environment variable is not set. Please set it to the user content directory.",
		);
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
