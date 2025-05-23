import { getUserDataByToken, InvalidSessionError } from "$lib/server/auth";

export async function load({ cookies }) {
	const secretToken = cookies.get("secret_token");

	let userData = null;
	if (secretToken) {
		try {
			userData = await getUserDataByToken(secretToken);
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
}
