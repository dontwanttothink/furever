export const signingPair = await crypto.subtle.generateKey("Ed25519", false, [
	"sign",
	"verify",
]);
export const rpID = "furever.uq4.net";
