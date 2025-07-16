import "dotenv/config";
import { drizzle } from "drizzle-orm/d1";
import type { D1Database } from "@cloudflare/workers-types";

export function getDB(binding: D1Database) {
	if (!binding) {
		throw new Error("Empty binding");
	}
	return drizzle(binding);
}
export { usersTable, sessionsTable } from "./schema";
