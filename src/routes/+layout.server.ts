export function load({ cookies }) {
	return {
		routes: [
			{
				path: "/",
				name: "Inicio",
			},
			{
				path: "/acerca-de",
				name: "Acerca de",
			},
			{
				path: "/mascotas",
				name: "Mascotas",
			},
		],
		sessionToken: cookies.get("secret_token"),
	};
}
