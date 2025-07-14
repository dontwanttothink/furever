import "dotenv/config";
import { env } from "$env/dynamic/private";
import { drizzle } from "drizzle-orm/d1";
import type { D1Database } from "@cloudflare/workers-types";

if (!env.DB_FILE_NAME) {
	throw new Error("DB_FILE_NAME is not defined in .env");
}

export function getDB(binding: D1Database) {
	return drizzle(binding);
}
export { usersTable, sessionsTable } from "./schema";
