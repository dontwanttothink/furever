import {
	logIn,
	signUp,
	SignupError,
	type CharacterizedSignupError,
} from "$lib/server/auth";
import { fail, redirect, type Actions } from "@sveltejs/kit";

function getMessage(error: CharacterizedSignupError): string {
	switch (error.type) {
		case SignupError.UserAlreadyExists:
			return "Este usuario ya está registrado. Intenta iniciar sesión.";
	}
}

export const actions = {
	default: async ({ request, cookies, getClientAddress }) => {
		const data = await request.formData();
		const name = data.get("name")?.toString();
		const email = data.get("email")?.toString();
		const password = data.get("password")?.toString();

		if (!name) {
			return fail(400, {
				error: "Se necesita un nombre.",
			});
		}
		if (name.length > 100) {
			return fail(400, {
				error: "El nombre no puede tener más de 100 caracteres.",
			});
		}

		if (!email || !password) {
			return fail(400, {
				error: "Se necesitan el usuario y la contraseña.",
			});
		}

		if (email.length > 100) {
			return fail(400, {
				error: "El correo electrónico no puede tener más de 100 caracteres.",
			});
		}

		if (password.length > 50) {
			return fail(400, {
				error: "La contraseña no puede tener más de 50 caracteres.",
			});
		}
		if (password.length < 8) {
			return fail(400, {
				error: "La contraseña debe tener al menos 8 caracteres.",
			});
		}
		if (password.at(-1) == " " || password.at(0) == " ") {
			return fail(400, {
				error: "La contraseña no puede empezar o terminar con un espacio.",
			});
		}

		const signupAttempt = await signUp(name, email, password);
		if (signupAttempt.result.isError) {
			return fail(400, {
				error: getMessage(signupAttempt.result),
			});
		}

		// Try to log the user in for them
		const loginAttempt = await logIn(email, password, getClientAddress());

		if (loginAttempt.result.isError) {
			throw new Error(
				"A newly created account can seemingly not be logged into: " + email,
			);
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
