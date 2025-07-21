import { getUserDataByToken, InvalidSessionError } from "$lib/server/auth";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies, platform }) => {
	const secretToken = cookies.get("secret_token");

	if (!platform?.env) {
		throw new TypeError();
	}

	let userData = null;
	if (secretToken) {
		try {
			userData = await getUserDataByToken(secretToken, platform.env);
		} catch (e) {
			if (e instanceof InvalidSessionError) {
				cookies.delete("secret_token", {
					path: "/",
				});
			} else {
				throw e;
			}
		}
	}

	return {
		routes: [
			{
				path: "/",
				name: "Inicio",
			},
			{
				path: "/mascotas",
				name: "Mascotas",
			},
			// {
			// 	path: "/adopta",
			// 	name: "Adopta",
			// },
		],
		userData,
	};
};
