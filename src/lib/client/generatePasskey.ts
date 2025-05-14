import { assert } from "$lib";

export async function generatePasskey(
	challenge: ArrayBuffer,
	email: string,
	name: string,
	userId: number,
) {
	assert(Number.isSafeInteger(userId)); // ≪ 2^32
	const userIdBuffer = new Uint32Array([userId]);

	const credential = await navigator.credentials.create({
		publicKey: {
			challenge,
			// TODO: Prevent duplicate credentials
			// excludeCredentials: [],
			user: {
				displayName: name,
				id: userIdBuffer,
				name: email,
			},
			pubKeyCredParams: [-8, -7, -257].map((alg) => ({
				alg,
				type: "public-key",
			})),
			rp: {
				name: "FureverHome",
			},
		},
	});

	// TypeScript doesn't know ANYTHING, ever. This is an invariant.
	assert(!credential || credential instanceof PublicKeyCredential);

	return credential;
}

export async function authenticateWithPasskey(challenge: ArrayBuffer) {
	const credential = await navigator.credentials.get({
		publicKey: {
			challenge,
		},
	});
	return credential;
}
