import { scryptAsync as scrypt } from "@noble/hashes/scrypt";
import "$lib/polyfills/proposal-arraybuffer-base64";

/**
 * We create our own salts because our cryptography library won't do it for us.
 */
function generateSalt() {
	const randomBytes = new Uint8Array(256 / 8);
	crypto.getRandomValues(randomBytes);
	return randomBytes;
}

async function hashWithSalt(text: string, salt: Uint8Array<ArrayBuffer>) {
	const N = 2 ** 18;
	const r = 8;
	const p = 1;
	const dkLen = 32;
	let result = await scrypt(text, salt, { N, r, p, dkLen });
	return `$scrypt$N=${N},r=${r},p=${p},dkLen=${dkLen}$${result.toBase64()}$${salt.toBase64()}`;
}

export function hash(text: string): Promise<string> {
	let salt = generateSalt();
	return hashWithSalt(text, salt);
}

/**
 * @returns The current timestamp in seconds.
 */
export function getCurrentTimestampInSeconds() {
	return Math.floor(Date.now() / 1000);
}

/**
 * **Warning**
 *
 * This function ignores any specified hashing algorithm options in the
 * `passData` string and uses its own.
 */
export async function verify(passData: string, password: string): Promise<boolean> {
	const [_algorithm, _algoOptions, _originalHash, salt] = passData.split("$").slice(1)
	const result = await hashWithSalt(password, Uint8Array.fromBase64(salt));
	return result == passData;
}

import { getDB, sessionsTable } from "../db";
import { lt } from "drizzle-orm";

/**
 * Delete all sessions that have expired.
 */
async function sweepSessions(platform: NonNullable<App.Platform["env"]>) {
	await getDB(platform.db)
		.delete(sessionsTable)
		.where(lt(sessionsTable.expiresAt, getCurrentTimestampInSeconds()));
}
/**
 * Clear stale sessions if the last sweep was more than 10 minutes ago.
 */
let lastSweepTime = -1;
export async function maybeSweepSessions(
	platform: NonNullable<App.Platform["env"]>,
) {
	const now = getCurrentTimestampInSeconds();
	if (now - lastSweepTime > 10 * 60) {
		await sweepSessions(platform);
		lastSweepTime = now;
	}
}

const GOLDEN_RATIO = (Math.sqrt(5) + 1) / 2;
/**
 * Calculate the backoff time for exponential backoff, as described in
 * `docs/auth`.
 */
export function backoffTime(n: number) {
	return Math.ceil(GOLDEN_RATIO ** (n - 1) / Math.sqrt(5));
}
