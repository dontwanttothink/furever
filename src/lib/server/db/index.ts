import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";

if (!process.env.DB_FILE_NAME) {
	throw new Error("DB_FILE_NAME is not defined in .env");
}

export const db = drizzle(process.env.DB_FILE_NAME);
export { usersTable } from "./schema";
