import { error, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { logOut } from "$lib/server/auth";

export function load() {
	error(404, "Not Found");
}

export const actions = {
	default: async ({ cookies, platform }) => {
		if (!platform?.env) {
			throw new TypeError();
		}

		const currentSession = cookies.get("secret_token");

		if (!currentSession) {
			return;
		}

		cookies.delete("secret_token", {
			path: "/",
		});
		await logOut(currentSession, platform.env);

		redirect(303, "/" + encodeURIComponent("iniciar-sesión"));
	},
} satisfies Actions;
