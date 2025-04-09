import { LibsqlError } from "@libsql/client";
import { db, usersTable } from "../db";
import { hash } from "./internal";

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
