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
type AuthResult = AuthError | AuthSuccess;

class CharacterizedAuthObject {
	until?: Date;
	type: AuthResult;

	constructor(type: Exclude<AuthResult, AuthError.TimedOut>);
	constructor(type: AuthError.TimedOut, until: Date);
	constructor(type: AuthResult, until?: Date) {
		if (type == AuthError.TimedOut) {
			this.until = until;
		}
		this.type = type;
	}
}

/**
 * @caveat The return value of this function may be exposed to the internet. Do
 * not provide any sensitive information.
 */
export async function logIn(
	email: string,
	password: string,
): Promise<CharacterizedAuthObject> {
	const result = await db
		.select({
			passData: usersTable.passwordData,
		})
		.from(usersTable)
		.where(eq(usersTable.email, email));

	if (result.length == 0) {
		return new CharacterizedAuthObject(AuthError.IncorrectCredentials);
	}

	if (result.length > 1) {
		throw new Error(`More than one user matched a single email: ${email}.`);
	}

	const { passData } = result[0];
	const isValid = await verify(passData, password);

	if (isValid) {
		return new CharacterizedAuthObject(AuthSuccess.LoggedIn);
	} else {
		return new CharacterizedAuthObject(AuthError.IncorrectCredentials);
	}
}

export async function register() {
	// TODO: Implement this
	return {
		error: "Not implemented",
	};
}
