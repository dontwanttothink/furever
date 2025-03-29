import type { Actions } from "./$types";
import { logIn } from "$lib/server/auth";
import { fail } from "@sveltejs/kit";

export const actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const email = data.get("email")?.toString() ?? "";
		const password = data.get("password")?.toString() ?? "";

		if (!email || !password) {
			return { error: "Email and password are required." };
		}

		const { error } = await logIn(email, password);

		if (error) {
			return fail(400, { error });
		}

		return { success: true };
	},
} satisfies Actions;
