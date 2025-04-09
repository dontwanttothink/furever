import type { Actions } from "./$types";
import {
	LoginError,
	logIn,
	type CharacterizedLoginError,
} from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";

function getMessage(error: CharacterizedLoginError): string {
	switch (error.type) {
		case LoginError.IncorrectCredentials:
			return "El nombre de usuario o la contraseña son incorrectos.";
		case LoginError.TimedOut:
			return `Debes esperar hasta ${error.until} para intentar de nuevo.`;
	}
}

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get("email")?.toString();
		const password = data.get("password")?.toString();

		if (!email || !password) {
			return fail(400, { error: "Se necesitan el usuario y la contraseña." });
		}

		if (password.length > 50) {
			return fail(400, {
				error: "La contraseña no puede tener más de 50 caracteres.",
			});
		}

		const loginAttempt = await logIn(email, password);

		if (loginAttempt.result.isError) {
			return fail(400, {
				error: getMessage(loginAttempt.result),
			});
		}

		if (!("token" in loginAttempt)) {
			throw new TypeError("Missing token in successful login response");
		}

		cookies.set("secret_token", loginAttempt.token, {
			path: "/",
			secure: true,
			expires: new Date(loginAttempt.result.until * 1_000),
		});
		redirect(303, "/mascotas");
	},
} satisfies Actions;
