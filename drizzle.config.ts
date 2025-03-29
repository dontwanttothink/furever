import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (!process.env.DB_FILE_NAME) {
	throw new Error("The DB_FILE_NAME environment variable is missing.");
}

export default defineConfig({
	out: "./drizzle",
	schema: "./src/lib/server/db/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: process.env.DB_FILE_NAME,
	},
});
