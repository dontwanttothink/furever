import { eq } from "drizzle-orm";
import { db, sessionsTable } from "../db";

export class InvalidSessionError extends Error {}

/**
 * Invalidate a session.
 * @param session The session token to invalidate.
 * @throws InvalidSessionError
 */
export async function logOut(session: string) {
	const result = await db
		.delete(sessionsTable)
		.where(eq(sessionsTable.token, session))
		.returning();

	if (result.length == 0) {
		throw new InvalidSessionError("Invalid session");
	}
}
