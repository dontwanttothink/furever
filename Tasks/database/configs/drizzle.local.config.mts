import { defineConfig } from "drizzle-kit";
import { PROJECT_DIRECTORY } from "../../private/constants.mts";
import { resolve } from "node:path";

if (!process.env.__DETECTED_WRANGLER_INTERNAL_SQLITE_DB) {
	throw new Error(
		"FureverHome: An environment variable that should have been populated by the project task is missing. If you encountered this error while using a project task (package.json script), please report this error.",
	);
}

export default defineConfig({
	out: "./drizzle",
	schema: "./src/lib/server/db/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: process.env.__DETECTED_WRANGLER_INTERNAL_SQLITE_DB,
	},
});
