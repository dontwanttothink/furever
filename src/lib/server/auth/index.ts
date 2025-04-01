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

export type CharacterizedIncorrectCredentialsResult = {
	type: AuthError.IncorrectCredentials;
	isError: true;
};
export type CharacterizedTimedOutResult = {
	type: AuthError.TimedOut;
	until: bigint;
	isError: true;
};
export type CharacterizedLoggedInResult = {
	type: AuthSuccess.LoggedIn;
	isError: false;
};
/**
 * @caveat Objects of this type may be exposed to the internet. Do not include
 * any sensitive information.
 */
export type CharacterizedAuthResult =
	| CharacterizedIncorrectCredentialsResult
	| CharacterizedTimedOutResult
	| CharacterizedLoggedInResult;
export type CharacterizedAuthError = CharacterizedAuthResult & {
	isError: true;
};

export type LoginAttempt<T extends CharacterizedAuthResult> = T extends {
	isError: true;
}
	? { result: T }
	: { result: T; token: string };

export async function logIn(
	email: string,
	password: string,
): Promise<LoginAttempt<CharacterizedAuthResult>> {
	const result = await db
		.select({
			passData: usersTable.passwordData,
		})
		.from(usersTable)
		.where(eq(usersTable.email, email));

	if (result.length == 0) {
		return {
			result: {
				type: AuthError.IncorrectCredentials,
				isError: true,
			},
		};
	}

	if (result.length > 1) {
		throw new Error(`More than one user matched a single email: ${email}.`);
	}

	const { passData } = result[0];
	const isValid = await verify(passData, password);

	if (isValid) {
		return {
			result: {
				type: AuthSuccess.LoggedIn,
				isError: false,
			},
			token: "",
		};
	} else {
		return {
			result: {
				type: AuthError.IncorrectCredentials,
				isError: true,
			},
		};
	}
}

export async function register() {
	// TODO: Implement this
	return {
		error: "Not implemented",
	};
}
