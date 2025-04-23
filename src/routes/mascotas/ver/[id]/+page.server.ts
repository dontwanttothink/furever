import { db } from "$lib/server/db";
import { petsTable } from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export async function load({ params }) {
	const requestedId = parseInt(params.id, 10);
	if (Number.isNaN(requestedId)) {
		error(404);
	}

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
	return { pet };
}
