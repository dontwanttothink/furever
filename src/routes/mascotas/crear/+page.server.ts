import { db } from "$lib/server/db";
import { petsTable } from "$lib/server/db/schema";
import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { Species } from "$lib/pets";

const validSpecies = Object.values(Species).filter(
	(n) => typeof n === "number",
);

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const name = data.get("nombre")?.toString();
		if (!name) {
			return fail(400, { error: "Se necesita un nombre." });
		}

		let species = data.get("species")?.toString();
		if (!species || !validSpecies.includes(parseInt(species, 10))) {
			return fail(400, { error: "La especie indicada es inválida." });
		}
		species = parseInt(species, 10);

		let breed = data.get("raza")?.toString();
		let sexo = data.get("sex")?.toString();
		let birthDay = data.get("día-nacimiento")?.toString();
		let birthMonth = data.get("mes-nacimiento")?.toString();
		let birthYear = data.get("año-nacimiento")?.toString();
		let description = data.get("descripción")?.toString();
		let weight = data.get("peso")?.toString();
		let wasDewormed = data.get("fue-desparacitado")?.toString();
		let wasNeutered = data.get("fue-esterilizado")?.toString();
		let birthDayIsUnknown =
			data.get("fecha-de-nacimiento-es-desconocida")?.toString() == "on";

		db.insert(petsTable).values({
			name,
			species,
		});

		console.log([...data.entries()]);
	},
};
