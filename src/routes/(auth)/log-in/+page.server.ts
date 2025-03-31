import type { Actions } from "./$types";
import {
	logIn,
	AuthResult,
	type CharacterizedAuthResult,
} from "$lib/server/auth";
import { fail } from "@sveltejs/kit";

function getMessage(result: CharacterizedAuthResult) {
	switch (result.type) {
		case AuthResult.IncorrectCredentials: {
			return "El usuario o la contraseña no son correctos.";
		}
		case AuthResult.TimedOut: {
			return "Debes esperar antes de volver a intentar.";
		}
		default: {
			return `Algo salió mal. Intenta de nuevo: ${result}`;
		}
	}
}

export const actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const email = data.get("email")?.toString() ?? "";
		const password = data.get("password")?.toString() ?? "";

		if (!email || !password) {
			return { error: "Email and password are required." };
		}

		const { type: result, isError } = await logIn(email, password);

		if (isError) {
			return fail(400, {
				error: result,
			});
		}

		return { success: true };
	},
} satisfies Actions;
