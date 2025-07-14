import { assert } from "$lib";
import { eq } from "drizzle-orm";
import { getDB, sessionsTable, usersTable } from "../db";
import { InvalidSessionError } from "./errors";

/**
 * Get user data for a given session.
 * @throws InvalidSessionError
 * @returns The user name and email.
 */
export async function getUserDataByToken(
	sessionToken: string,
	platform: NonNullable<App.Platform["env"]>,
) {
	const matches = await getDB(platform.db)
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
	const userMatches = await getDB(platform.db)
		.select({
			name: usersTable.name,
			email: usersTable.email,
			userId: usersTable.id,
		})
		.from(usersTable)
		.where(eq(usersTable.id, userId));

	assert(userMatches.length == 1);

	return userMatches[0];
}

export async function getUserDataById(
	id: number,
	platform: NonNullable<App.Platform["env"]>,
) {
	const userMatches = await getDB(platform.db)
		.select({
			name: usersTable.name,
			email: usersTable.email,
			userId: usersTable.id,
		})
		.from(usersTable)
		.where(eq(usersTable.id, id));

	assert(userMatches.length == 1);

	return userMatches[0];
}
