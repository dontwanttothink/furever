import { eq } from "drizzle-orm";
import { db, usersTable } from "../db";
import { InvalidUserError } from "./errors";

/**
 * @param of A user ID
 * @param to The new name
 * @throws InvalidUserError
 */
export async function updateName(of: number, to: string) {
	const result = await db
		.update(usersTable)
		.set({
			name: to,
		})
		.where(eq(usersTable.id, of));

	if (result.rowsAffected == 0) {
		throw new InvalidUserError("No users seem to have matched the ID: " + of);
	}
}
