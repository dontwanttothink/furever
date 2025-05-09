import { db } from "$lib/server/db";
import { getUserDataById, getUserDataByToken } from "$lib/server/auth/userData";
import { petsTable } from "$lib/server/db/schema";
import { error, fail, redirect, type Actions } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { deletePet, getFileAttachmentsFor } from "$lib/server/content";
import { assert } from "$lib";
import { InvalidSessionError } from "$lib/server/auth";

async function getPetForId(requestedId: number) {
	const matchedPets = await db
		.select()
		.from(petsTable)
		.where(eq(petsTable.id, requestedId));

	if (matchedPets.length > 1) {
		throw new Error(
			"More than one pet appears to have the same ID: " + requestedId,
		);
	}
	if (matchedPets.length == 0) {
		error(404);
	}

	const [pet] = matchedPets;
	return pet;
}

export async function load({ params }) {
	const requestedId = parseInt(params.id, 10);
	if (Number.isNaN(requestedId)) {
		error(404);
	}

	const pet = await getPetForId(requestedId);
	return {
		pet: {
			...pet,
			author: await getUserDataById(pet.author),
			attachmentUUIDs: await getFileAttachmentsFor(pet.id),
		},
	};
}

export const actions = {
	delete: async ({ params, cookies }) => {
		assert(params.id);

		const requestedId = parseInt(params.id, 10);
		if (Number.isNaN(requestedId)) {
			error(404);
		}

		const token = cookies.get("secret_token");
		if (!token) {
			return fail(401, { error: "Se necesita un token." });
		}

		let userData;
		try {
			userData = await getUserDataByToken(token);
		} catch (e) {
			if (e instanceof InvalidSessionError) {
				return fail(401, { error: "El token no es válido." });
			}
			throw e;
		}

		const pet = await getPetForId(requestedId);
		if (pet.author !== userData.userId) {
			return fail(403, {
				error: "No tienes permiso para eliminar esta mascota.",
			});
		}

		await deletePet(requestedId);

		redirect(303, "/mascotas");
	},
} satisfies Actions;
