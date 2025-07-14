import { eq } from "drizzle-orm";
import { getDB, sessionsTable } from "../db";
import { InvalidSessionError } from "./errors";

/**
 * Invalidate a session.
 * @param session The session token to invalidate.
 * @throws InvalidSessionError
 */
export async function logOut(
	session: string,
	platform: NonNullable<App.Platform["env"]>,
) {
	const result = await getDB(platform.db)
		.delete(sessionsTable)
		.where(eq(sessionsTable.token, session))
		.returning();

	if (result.length == 0) {
		throw new InvalidSessionError("Invalid session");
	}
}
