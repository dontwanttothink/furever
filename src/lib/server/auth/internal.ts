import * as argon2 from "argon2";

/**
 * We create our own salts in order to satisfy the security requirements in
 * `docs/auth`.
 */
function generateSalt() {
	const randomBytes = new Uint8Array(256 / 8);
	crypto.getRandomValues(randomBytes);
	return Buffer.from(randomBytes);
}

export function hash(text: string) {
	return argon2.hash(text, {
		type: argon2.argon2id,
		memoryCost: 128 * 1024,
		timeCost: 5,
		parallelism: 8,
		salt: generateSalt(),
	});
}

/**
 * @returns The current timestamp in seconds.
 */
export function getCurrentTimestampInSeconds() {
	return Math.floor(Date.now() / 1000);
}

export { verify } from "argon2";

import { db, sessionsTable } from "../db";
import { lt } from "drizzle-orm";

/**
 * Delete all sessions that have expired.
 */
async function sweepSessions() {
	await db
		.delete(sessionsTable)
		.where(lt(sessionsTable.expiresAt, getCurrentTimestampInSeconds()));
}
/**
 * Clear stale sessions if the last sweep was more than 10 minutes ago.
 */
let lastSweepTime = -1;
export async function maybeSweepSessions() {
	const now = getCurrentTimestampInSeconds();
	if (now - lastSweepTime > 10 * 60) {
		await sweepSessions();
		lastSweepTime = now;
	}
}
