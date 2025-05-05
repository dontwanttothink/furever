import { Temporal } from "temporal-polyfill";
import { db } from "$lib/server/db";
import { petsTable } from "$lib/server/db/schema";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { DogBreeds, Sex, Species } from "$lib/pets";
import { assert } from "$lib";
import { getCurrentTimestampInSeconds } from "$lib/server/auth/internal";
import { getUserDataByToken } from "$lib/server/auth/userData";
import type { InferInsertModel } from "drizzle-orm";
import { createPet } from "$lib/server/content";

const validSpecies = Object.values(Species).filter(
	(n) => typeof n === "number",
);
const validBreeds = Object.values(DogBreeds).filter(
	(n) => typeof n === "number",
);
const validSexes = Object.values(Sex).filter((n) => typeof n === "number");

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const userToken = cookies.get("secret_token");
		if (!userToken) {
			return fail(401, { error: "No estás autenticado." });
		}

		const userData = await getUserDataByToken(userToken);

		const badRequestErrors = [];

		const data = await request.formData();

		const name = data.get("nombre")?.toString();
		if (!name) {
			badRequestErrors.push("Se necesita un nombre.");
		}

		const speciesRaw = data.get("especie")?.toString();
		if (!speciesRaw || !validSpecies.includes(parseInt(speciesRaw, 10))) {
			badRequestErrors.push("La especie indicada es inválida.");
		}

		const breedRaw = data.get("raza")?.toString();
		if (!breedRaw || !validBreeds.includes(parseInt(breedRaw, 10))) {
			badRequestErrors.push("La raza indicada es inválida.");
		}

		const sexRaw = data.get("sexo")?.toString();
		if (!sexRaw || !validSexes.includes(parseInt(sexRaw, 10))) {
			console.log(sexRaw);
			badRequestErrors.push("El sexo indicado es inválido.");
		}

		const birthDayIsUnknown =
			data.get("fecha-de-nacimiento-es-desconocida")?.toString() == "on";

		const birthDayRaw = data.get("día-nacimiento")?.toString();
		if (
			!birthDayIsUnknown &&
			(!birthDayRaw || Number.isNaN(parseInt(birthDayRaw, 10)))
		) {
			badRequestErrors.push("El día de nacimiento es inválido.");
		}

		const birthMonthRaw = data.get("mes-nacimiento")?.toString();
		if (
			!birthDayIsUnknown &&
			(!birthMonthRaw || Number.isNaN(parseInt(birthMonthRaw, 10)))
		) {
			badRequestErrors.push("El mes de nacimiento es inválido.");
		}

		const birthYearRaw = data.get("año-nacimiento")?.toString();
		if (
			!birthDayIsUnknown &&
			(!birthYearRaw || Number.isNaN(parseInt(birthYearRaw, 10)))
		) {
			badRequestErrors.push("El año de nacimiento es inválido.");
		}

		const description = data.get("descripción")?.toString();
		if (!description) {
			badRequestErrors.push("Se necesita una descripción.");
		}

		const maybeWeight = data.get("peso")?.toString();

		const imageFiles = data
			.getAll("imágenes")
			.filter((f) => f instanceof File) as File[];

		if (badRequestErrors.length > 0) {
			return fail(400, { error: badRequestErrors });
		}

		assert(speciesRaw && breedRaw && sexRaw && name && description);

		const species: Species = parseInt(speciesRaw, 10);
		const breed: DogBreeds = parseInt(breedRaw, 10);
		const sex: Sex = parseInt(sexRaw, 10);

		// FIXME: These should be optional. They are currently always set.
		const wasDewormed = data.get("fue-desparacitado")?.toString() == "on";
		const wasNeutered = data.get("fue-esterilizado")?.toString() == "on";

		const newPet: InferInsertModel<typeof petsTable> = {
			author: userData.userId,
			timestamp: getCurrentTimestampInSeconds(),
			name: name,
			species: species,
			breed: breed,
			sex: sex,
			isDewormed: Number(wasDewormed),
			isNeutered: Number(wasNeutered),
			description: description,
		};

		if (!birthDayIsUnknown) {
			assert(birthDayRaw && birthMonthRaw && birthYearRaw);
			const birthDay = parseInt(birthDayRaw, 10);
			const birthMonth = parseInt(birthMonthRaw, 10);
			const birthYear = parseInt(birthYearRaw, 10);

			let birthInstant;
			try {
				birthInstant = Temporal.ZonedDateTime.from({
					year: birthYear,
					month: birthMonth,
					day: birthDay,
					timeZone: "-05",
				});
			} catch (e) {
				if (e instanceof RangeError) {
					return fail(400, { error: "Fecha de nacimiento inválida." });
				}
				throw e;
			}
			newPet.birthDate = birthInstant.epochMilliseconds / 1000;

			// FIXME: take precision into account (i'm speedrunning this and
			// i'm tired)
		}

		if (maybeWeight && !Number.isNaN(parseInt(maybeWeight, 10))) {
			newPet.weight = parseInt(maybeWeight, 10);
		}

		const insertedId = await createPet(newPet, imageFiles);

		redirect(303, "/mascotas/ver/" + insertedId.toString());
	},
};
