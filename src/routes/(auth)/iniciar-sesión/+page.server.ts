import type { Actions } from "./$types";
import {
	AuthError,
	isCharacterizedAuthError,
	logIn,
	type CharacterizedAuthError,
} from "$lib/server/auth";
import { fail } from "@sveltejs/kit";

function getMessage(error: CharacterizedAuthError): string {
	switch (error.type) {
		case AuthError.IncorrectCredentials:
			return "El nombre de usuario o la contraseña son incorrectos.";
		case AuthError.TimedOut:
			return `Debes esperar hasta ${error.until} para intentar de nuevo.`;
		default:
			return `Algo salió mal. Hubo un error desconocido: ${error.type}`;
	}
}

export const actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const email = data.get("email")?.toString();
		const password = data.get("password")?.toString();

		if (!email || !password) {
			return { error: "Email and password are required." };
		}

		const characterizedResult = await logIn(email, password);

		if (isCharacterizedAuthError(characterizedResult)) {
			return fail(400, {
				error: getMessage(characterizedResult),
			});
		}

		return { success: true };
	},
} satisfies Actions;
