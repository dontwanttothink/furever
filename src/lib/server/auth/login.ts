import { eq } from "drizzle-orm";
import { db, usersTable, sessionsTable } from "../db";
import {
	getCurrentTimestampInSeconds,
	maybeSweepSessions,
	verify,
} from "./internal";
import { loginAttempts } from "../db/schema";

const SECONDS_PER_HOUR = 60 * 60;

export enum LoginError {
	IncorrectCredentials = "incorrect_credentials",
	TimedOut = "timed_out",
}
export enum LoginSuccess {
	LoggedIn = "logged_in",
}

export type CharacterizedIncorrectCredentialsResult = {
	type: LoginError.IncorrectCredentials;
	isError: true;
};
export type CharacterizedTimedOutResult = {
	type: LoginError.TimedOut;
	until: number;
	isError: true;
};
export type CharacterizedLoggedInResult = {
	type: LoginSuccess.LoggedIn;
	until: number;
	isError: false;
};
/**
 * @caveat Objects of this type may be exposed to the internet. Do not include
 * any sensitive information.
 */
export type CharacterizedLoginResult =
	| CharacterizedIncorrectCredentialsResult
	| CharacterizedTimedOutResult
	| CharacterizedLoggedInResult;
export type CharacterizedLoginError = CharacterizedLoginResult & {
	isError: true;
};

export type LoginAttempt<T extends CharacterizedLoginResult> = T extends {
	isError: true;
}
	? { result: T }
	: { result: T; token: string };

export async function logIn(
	email: string,
	password: string,
	source: string,
): Promise<LoginAttempt<CharacterizedLoginResult>> {
	email = email.toLowerCase();

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
				type: LoginError.IncorrectCredentials,
				isError: true,
			},
		};
	}

	if (result.length > 1) {
		throw new Error(`More than one user matched a single email: ${email}.`);
	}

	const { passData, id: userId } = result[0];

	async function hashIp(ip: string): Promise<string> {
		const encoder = new TextEncoder();
		const data = encoder.encode(ip);
		const hash = await crypto.subtle.digest("SHA-256", data);
		return [...new Uint8Array(hash)]
			.map((byte) => byte.toString(16).padStart(2, "0"))
			.join("");
	}

	db.insert(loginAttempts).values({
		userId,
		timestamp: getCurrentTimestampInSeconds(),
		source: await hashIp(source),
	});

	const isValid = await verify(passData, password);

	if (isValid) {
		maybeSweepSessions(); // schedule stale sessions to be cleaned up

		const token = new Uint8Array(256 / 8);
		crypto.getRandomValues(token);

		const tokenString = token.reduce(
			(acc, byte) => acc + byte.toString(16).padStart(2, "0"),
			"",
		);

		const expiresAt = getCurrentTimestampInSeconds() + 48 * SECONDS_PER_HOUR;

		await db.insert(sessionsTable).values({
			userId,
			token: tokenString,
			expiresAt,
		});

		return {
			result: {
				type: LoginSuccess.LoggedIn,
				until: expiresAt,
				isError: false,
			},
			token: tokenString,
		};
	} else {
		return {
			result: {
				type: LoginError.IncorrectCredentials,
				isError: true,
			},
		};
	}
}
