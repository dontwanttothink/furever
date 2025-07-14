/**
 * @type {import("prettier").Config}
 */
const config = {
	useTabs: true,
	printWidth: 80,
	proseWrap: "always",
	plugins: ["prettier-plugin-svelte"],
	overrides: [
		{
			files: "*.svelte",
			options: {
				parser: "svelte",
			},
		},
		{
			files: "*.jsonc",
			options: {
				// to avoid language server warnings
				trailingComma: "none",
			},
		},
	],
};
export default config;
