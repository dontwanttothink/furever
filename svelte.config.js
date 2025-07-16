import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	compilerOptions: {
		runes: true,
	},
	kit: {
		adapter: adapter(),
		csrf: {
			// We write a custom implementation in `src/hooks.server.ts`
			// to support correct origin checking in both development and
			// production modes.
			checkOrigin: false,
		},
	},
};

export default config;
