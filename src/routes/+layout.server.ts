export function load() {
	return {
		routes: [
			{
				path: "/",
				name: "Home",
			},
			{
				path: "/about",
				name: "About",
			},
			{
				path: "/pets",
				name: "Pets",
			},
			{
				path: "/log-in",
				name: "Log In",
			},
		],
	};
}
