export function load({ cookies }) {
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
		],
		sessionToken: cookies.get("secret_token"),
	};
}
