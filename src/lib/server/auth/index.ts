import { eq } from "drizzle-orm";
import { db, usersTable } from "../db";
import { verify } from "./internal";

export enum AuthError {
	IncorrectCredentials = "incorrect_credentials",
	TimedOut = "timed_out",
}
export enum AuthSuccess {
	LoggedIn = "logged_in",
}
export type AuthResult = AuthError | AuthSuccess;

/**
 * @caveat Instances of this class may be exposed to the internet. Do not
 * any sensitive information.
 */
export class CharacterizedAuthResult {
	until?: Date;
	type: AuthResult;
	isError: boolean;

	static isAuthError(type: AuthResult): type is AuthError {
		return Object.values(AuthError).includes(type as AuthError);
	}

	constructor(type: Exclude<AuthResult, AuthError.TimedOut>);
	constructor(type: AuthError.TimedOut, until: Date);
	constructor(type: AuthResult, until?: Date) {
		if (type == AuthError.TimedOut) {
			this.until = until;
		}
		this.type = type;
		this.isError = CharacterizedAuthResult.isAuthError(type);
	}
}
export type CharacterizedAuthError = CharacterizedAuthResult & {
	isError: true;
};

export function isCharacterizedAuthError(
	characterizedResult: CharacterizedAuthResult,
): characterizedResult is CharacterizedAuthError {
	return characterizedResult.isError;
}

export async function logIn(
	email: string,
	password: string,
): Promise<CharacterizedAuthResult> {
	const result = await db
		.select({
			passData: usersTable.passwordData,
		})
		.from(usersTable)
		.where(eq(usersTable.email, email));

	if (result.length == 0) {
		return new CharacterizedAuthResult(AuthError.IncorrectCredentials);
	}

	if (result.length > 1) {
		throw new Error(`More than one user matched a single email: ${email}.`);
	}

	const { passData } = result[0];
	const isValid = await verify(passData, password);

	if (isValid) {
		return new CharacterizedAuthResult(AuthSuccess.LoggedIn);
	} else {
		return new CharacterizedAuthResult(AuthError.IncorrectCredentials);
	}
}

export async function register() {
	// TODO: Implement this
	return {
		error: "Not implemented",
	};
}
