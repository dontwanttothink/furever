import { LibsqlError } from "@libsql/client";
import { db, sessionsTable, usersTable } from "../db";
import { hash } from "./internal";
import { eq } from "drizzle-orm";
import { petsTable } from "../db/schema";
import { deletePet } from "../content";

export enum SignupSuccess {
	SignedUp = "signed_up",
}
export enum SignupError {
	UserAlreadyExists = "user_already_exists",
}

export type CharacterizedSignedUpResult = {
	type: SignupSuccess.SignedUp;
	isError: false;
};
export type CharacterizedUserAlreadyExistsResult = {
	type: SignupError.UserAlreadyExists;
	isError: true;
};
export type CharacterizedSignupResult =
	| CharacterizedSignedUpResult
	| CharacterizedUserAlreadyExistsResult;
export type CharacterizedSignupError = CharacterizedSignupResult & {
	isError: true;
};

export type SignupAttempt<T extends CharacterizedSignupResult> = { result: T };

export async function signUp(
	name: string,
	email: string,
	password: string,
): Promise<SignupAttempt<CharacterizedSignupResult>> {
	email = email.toLowerCase();

	try {
		await db.insert(usersTable).values({
			name,
			email,
			passwordData: await hash(password),
		});
	} catch (error) {
		if (
			error instanceof LibsqlError &&
			error.code == "SQLITE_CONSTRAINT_UNIQUE"
		) {
			return {
				result: {
					type: SignupError.UserAlreadyExists,
					isError: true,
				},
			};
		}
		throw error;
	}

	return {
		result: {
			type: SignupSuccess.SignedUp,
			isError: false,
		},
	};
}

export async function deleteUser(userId: number) {
	// delete sessions
	await db.delete(sessionsTable).where(eq(sessionsTable.userId, userId));

	// delete pets
	const pets = await db
		.select({
			petId: petsTable.id,
		})
		.from(petsTable)
		.where(eq(petsTable.author, userId));
	for (const { petId } of pets) {
		// attachment deletion is handled in the function
		await deletePet(petId);
	}

	// delete user
	await db.delete(usersTable).where(eq(usersTable.id, userId));
}
