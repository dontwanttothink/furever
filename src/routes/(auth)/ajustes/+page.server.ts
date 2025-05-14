import { error, fail, redirect, type Actions } from "@sveltejs/kit";
import { deleteUser, updateName } from "$lib/server/auth";
import { getUserDataByToken } from "$lib/server/auth";
import { InvalidSessionError, InvalidUserError } from "$lib/server/auth/errors";
import { tidyName } from "$lib/hygiene";
import { Temporal } from "temporal-polyfill";
import { assert } from "$lib";
import { signingPair } from "$lib/server/auth/passkeys/constants"; // FIXME
import { verifyRegistrationResponse } from "@simplewebauthn/server";

export async function load({ parent }) {
	const parentData = await parent();
	if (!parentData.userData) {
		error(401, "No estás autenticado.");
	}
	return {
		userData: parentData.userData, // just for typescript to understand
	};
}

export const actions = {
	async name({ request, cookies }) {
		const token = cookies.get("secret_token");
		if (!token) {
			return fail(401, { error: "Se necesita un token." });
		}

		const data = await request.formData();
		const newName = data.get("name")?.toString();

		if (!newName) {
			return fail(400, { error: "Se necesita el nuevo nombre." });
		}

		let userId;
		try {
			userId = (await getUserDataByToken(token)).userId;
		} catch (e) {
			if (e instanceof InvalidSessionError) {
				return fail(400, { error: "La sesión es inválida." });
			}
			throw e;
		}

		try {
			await updateName(userId, tidyName(newName));
		} catch (e) {
			if (e instanceof InvalidUserError) {
				return fail(400, { error: "Parece que el usuario ya no existe." });
			}
			throw e;
		}
	},

	async deleteAccount({ cookies }) {
		const token = cookies.get("secret_token");
		if (!token) {
			return fail(401, { error: "Se necesita un token." });
		}

		let userId;
		try {
			userId = (await getUserDataByToken(token)).userId;
		} catch (e) {
			if (e instanceof InvalidSessionError) {
				return fail(400, { error: "La sesión es inválida." });
			}
			throw e;
		}
		await deleteUser(userId);

		cookies.delete("secret_token", {
			path: "/",
		});

		redirect(303, "/");
	},

	async registerPasskey({ request, cookies }) {
		const body: unknown = await request.json();
		if (!(body instanceof Object)) {
			return fail(400, { error: "El cuerpo de la petición no es un objeto." });
		}
		if (!("stage" in body)) {
			return fail(400, { error: "Se debe indicar la etapa." });
		}

		const { stage } = body;
		if (!stage || typeof stage !== "string") {
			return fail(400, { error: "Se debe indicar la etapa." });
		}

		const token = cookies.get("secret_token");
		if (!token) {
			return fail(401, { error: "Se necesita un token." });
		}
		let userId;
		try {
			userId = (await getUserDataByToken(token)).userId;
		} catch (e) {
			if (e instanceof InvalidSessionError) {
				return fail(400, { error: "La sesión es inválida." });
			}
			throw e;
		}
		console.log(userId);
		return fail(400, { error: "La etapa no es válida." });
	},
} satisfies Actions;
