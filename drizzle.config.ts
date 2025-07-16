import "dotenv/config";
import { Config, defineConfig } from "drizzle-kit";
import { spawnSync } from "bun";

const shared = {
	out: "./drizzle",
	schema: "./src/lib/server/db/schema.ts",
	dialect: "sqlite",
} as const;

let config: Config;

if (process.env.USING_MINIFLARE) {
	function getMiniflareDbPath(): string {
		const p = spawnSync([
			"find",
			".wrangler/state/v3/d1/miniflare-D1DatabaseObject",
			"-type",
			"f",
			"-name",
			"*.sqlite",
			"-print",
			"-quit",
		]);

		if (!p.success) {
			throw new Error("Failed to find Miniflare database.");
		}

		const out = p.stdout.toString();
		console.log("Detected local Miniflare database at: " + out);
		return out;
	}

	config = defineConfig({
		...shared,
		dbCredentials: {
			url: getMiniflareDbPath(),
		},
	});
} else {
	for (const e of [
		"CLOUDFLARE_ACCOUNT_ID",
		"CLOUDFLARE_D1_TOKEN",
		"CLOUDFLARE_DATABASE_ID",
	]) {
		if (!process.env[e]) {
			throw new Error("Required environment variable is missing: " + e);
		}
	}

	config = defineConfig({
		...shared,
		driver: "d1-http",
		dbCredentials: {
			accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
			databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
			token: process.env.CLOUDFLARE_D1_TOKEN!,
		},
	});
}

export default config;
