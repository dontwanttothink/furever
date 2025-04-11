import { error, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export function load() {
	error(404, "Not Found");
}

export const actions = {
	default: async ({ cookies }) => {
		cookies.delete("secret_token", {
			path: "/",
		});
		// TODO: invalidate session

		redirect(303, "/" + encodeURIComponent("iniciar-sesión"));
	},
} satisfies Actions;
