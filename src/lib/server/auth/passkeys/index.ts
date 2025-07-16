import { env } from "$env/dynamic/private";
import { assert } from "$lib";

assert(env.ORIGIN, "The ORIGIN environment variable is not set.");

export const signingPair = await crypto.subtle.generateKey("Ed25519", false, [
	"sign",
	"verify",
]);
export const rpID = new URL(env.ORIGIN).hostname; // removes port too (required)
