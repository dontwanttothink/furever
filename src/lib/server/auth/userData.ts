import { assert } from "$lib";
import { eq } from "drizzle-orm";
import { db, sessionsTable, usersTable } from "../db";

class InvalidSessionError extends Error {}

/**
 * Get user data for a given session.
 * @throws UserDoesNotExistError
 * @caveat This functionality is exposed to the client.
 * @returns The user name and email.
 */
export async function getUserDataFor(sessionToken: string) {
	const matches = await db
		.select({
			userId: sessionsTable.userId,
		})
		.from(sessionsTable)
		.where(eq(sessionsTable.token, sessionToken));

	if (matches.length > 1) {
		throw new Error(
			"More than one session appears to have the token: " + sessionToken,
		);
	}
	if (matches.length == 0) {
		throw new InvalidSessionError();
	}

	const userId = matches[0].userId;
	const userMatches = await db
		.select({
			name: usersTable.name,
			email: usersTable.email,
		})
		.from(usersTable)
		.where(eq(usersTable.id, userId));

	assert(userMatches.length == 1);

	return userMatches[0];
}
