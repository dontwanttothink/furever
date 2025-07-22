import { getDB } from "$lib/server/db";
import { getUserDataById, getUserDataByToken } from "$lib/server/auth/userData";
import { petsTable } from "$lib/server/db/schema";
import { error, fail, redirect, type Actions } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { deletePet, getFileAttachmentsFor } from "$lib/server/content";
import { assert } from "$lib";
import { InvalidSessionError } from "$lib/server/auth";

async function getPetForId(
	requestedId: number,
	platform: NonNullable<App.Platform["env"]>,
) {
	const matchedPets = await getDB(platform.db)
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

export async function load({ params, platform }) {
	if (!platform?.env) {
		throw new TypeError();
	}

	const requestedId = parseInt(params.id, 10);
	if (Number.isNaN(requestedId)) {
		error(404);
	}

	const db = getDB(platform.env.db);

	const pet = await getPetForId(requestedId, platform.env);
	return {
		pet: {
			...pet,
			author: await getUserDataById(pet.author, db),
			attachmentUUIDs: await getFileAttachmentsFor(pet.id, db),
		},
	};
}

export const actions = {
	delete: async ({ params, cookies, platform }) => {
		assert(params.id);
		assert(platform?.env);

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
			userData = await getUserDataByToken(token, platform.env);
		} catch (e) {
			if (e instanceof InvalidSessionError) {
				return fail(401, { error: "El token no es válido." });
			}
			throw e;
		}

		const pet = await getPetForId(requestedId, platform.env);
		if (pet.author !== userData.userId) {
			return fail(403, {
				error: "No tienes permiso para eliminar esta mascota.",
			});
		}

		await deletePet(requestedId, platform.env);

		redirect(303, "/mascotas");
	},
} satisfies Actions;
