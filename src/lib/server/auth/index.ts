import { eq } from "drizzle-orm";
import { db, usersTable, sessionsTable } from "../db";
import { verify } from "./internal";

const SECONDS_PER_HOUR = 60 * 60;

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
	until: number;
	isError: true;
};
export type CharacterizedLoggedInResult = {
	type: AuthSuccess.LoggedIn;
	until: number;
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

function getCurrentTimestampInSeconds() {
	return Math.floor(Date.now() / 1000);
}

export async function logIn(
	email: string,
	password: string,
): Promise<LoginAttempt<CharacterizedAuthResult>> {
	const result = await db
		.select({
			passData: usersTable.passwordData,
			id: usersTable.id,
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

	const { passData, id: userId } = result[0];
	const isValid = await verify(passData, password);

	if (isValid) {
		const token = new Uint8Array(256 / 8);
		crypto.getRandomValues(token);

		const tokenString = token.reduce(
			(acc, byte) => acc + byte.toString(16).padStart(2, "0"),
			"",
		);

		const expiresAt = getCurrentTimestampInSeconds() + 48 * SECONDS_PER_HOUR;

		db.insert(sessionsTable).values({
			userId,
			token: tokenString,
			expiresAt,
		});

		return {
			result: {
				type: AuthSuccess.LoggedIn,
				until: expiresAt,
				isError: false,
			},
			token: tokenString,
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
