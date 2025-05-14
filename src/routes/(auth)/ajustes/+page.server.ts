import { error, fail, json, redirect, type Actions } from "@sveltejs/kit";
import { deleteUser, updateName } from "$lib/server/auth";
import { getUserDataByToken } from "$lib/server/auth";
import {
	InvalidSessionError,
	InvalidUserError,
} from "$lib/server/auth/errors.js";
import { tidyName } from "$lib/hygiene";
import { Temporal } from "temporal-polyfill";

const signingPair = await crypto.subtle.generateKey("Ed25519", false, [
	"sign",
	"verify",
]);

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
		const body = await request.json();
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

		if (stage == "challenge please") {
			const challengeData = crypto.getRandomValues(new Uint8Array(32));
			const challenge = {
				// @ts-expect-error This will be fixed by TypeScript sometime.
				// It doesn't know about `.toBase64`.
				data: challengeData.toBase64() as string,
				created: Temporal.Now.instant().epochMilliseconds,
				login: userId,
			};

			const encoder = new TextEncoder();
			const signature = await crypto.subtle.sign(
				"Ed25519",
				signingPair.privateKey,
				encoder.encode(JSON.stringify(challenge)),
			);

			// @ts-expect-error Again, this will be fixed by TypeScript
			// sometime.
			const signatureBase64 = new Uint8Array(signature).toBase64();

			return json({
				challenge,
				authenticity: signatureBase64,
			});
		}

		if (stage == "check me") {
			const { given } = body;
		}
	},
} satisfies Actions;
