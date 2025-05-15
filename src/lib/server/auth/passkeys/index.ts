import { env } from "$env/dynamic/private";

export const signingPair = await crypto.subtle.generateKey("Ed25519", false, [
	"sign",
	"verify",
]);
export const rpID = new URL(env.ORIGIN).hostname; // removes port too (required)
