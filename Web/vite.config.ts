import { sveltekit } from "@sveltejs/kit/vite";
import viteWasm from "vite-plugin-wasm";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [sveltekit(), viteWasm()],
	optimizeDeps: {
		exclude: ["@jsquash/jpeg"],
	},
	test: {
		projects: [
			{
				extends: "./vite.config.ts",
				test: {
					name: "client",
					environment: "browser",
					browser: {
						enabled: true,
						provider: "playwright",
						instances: [{ browser: "firefox" }],
					},
					include: ["src/**/*.svelte.{test,spec}.{js,ts}"],
					exclude: ["src/lib/server/**"],
					setupFiles: ["./vitest-setup-client.ts"],
				},
			},
			{
				extends: "./vite.config.ts",
				test: {
					name: "server",
					environment: "node",
					include: ["src/**/*.{test,spec}.{js,ts}"],
					exclude: ["src/**/*.svelte.{test,spec}.{js,ts}"],
				},
			},
		],
	},
});
