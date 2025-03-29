export function load() {
	return {
		routes: [
			{
				path: "/",
				name: "Inicio",
			},
			{
				path: "/about",
				name: "Acerca de",
			},
			{
				path: "/pets",
				name: "Mascotas",
			},
			{
				path: "/log-in",
				name: "Iniciar sesión",
			},
		],
	};
}
