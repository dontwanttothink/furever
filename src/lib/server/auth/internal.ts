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

export { verify } from "argon2";
