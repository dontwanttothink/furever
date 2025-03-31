export function load() {
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
			{
				path: "/iniciar-sesión",
				name: "Iniciar sesión",
			},
		],
	};
}
