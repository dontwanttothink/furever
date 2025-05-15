import "dotenv/config";
import { env } from "$env/dynamic/private";
import { drizzle } from "drizzle-orm/libsql";

if (!env.DB_FILE_NAME) {
	throw new Error("DB_FILE_NAME is not defined in .env");
}

export const db = drizzle(env.DB_FILE_NAME);
export { usersTable, sessionsTable } from "./schema";
