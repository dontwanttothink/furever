import { assert } from "$lib";
import { InvalidSessionError } from "$lib/server/auth/errors.js";
import { rpID, signingPair } from "$lib/server/auth/passkeys";
import { getUserDataByToken } from "$lib/server/auth/userData.js";
import { db } from "$lib/server/db/index.js";
import { passkeysTable } from "$lib/server/db/schema.js";
import {
	verifyRegistrationResponse,
	type RegistrationResponseJSON,
} from "@simplewebauthn/server";
import { error } from "@sveltejs/kit";
import { Temporal } from "temporal-polyfill";

export async function POST({ request, cookies }) {
	const token = cookies.get("secret_token");
	if (!token) {
		error(401);
	}

	let user;
	try {
		user = await getUserDataByToken(token);
	} catch (e) {
		if (e instanceof InvalidSessionError) {
			error(401);
		}
		throw e;
	}

	const origin = new URL(request.url).toString();
	const body = await request.json();
	const {
		optionsJSON,
		signatureB64,
		attestationResponse,
	}: {
		optionsJSON: string;
		signatureB64: string;
		attestationResponse: RegistrationResponseJSON;
	} = body;

	// @ts-expect-error: Fucking TypeScript pmo
	const signature = new Uint8Array.fromHex64(signatureB64);

	const encoder = new TextEncoder();
	if (
		!(await crypto.subtle.verify(
			"Ed25519",
			signingPair.publicKey,
			signature.buffer,
			encoder.encode(optionsJSON),
		))
	) {
		error(400, "La firma no es válida.");
	}

	const options: {
		webAuthn: PublicKeyCredentialCreationOptionsJSON;
		timestamp: number;
		userId: number;
	} = JSON.parse(optionsJSON);

	if (user.userId !== options.userId) {
		error(400, "Las opciones no son válidas para este usuario.");
	}

	if (
		Temporal.Now.instant().since(
			Temporal.Instant.fromEpochMilliseconds(options.timestamp),
		).seconds > 60
	) {
		error(400, "Las opciones son demasiado antiguas.");
	}

	let verification;
	try {
		verification = await verifyRegistrationResponse({
			response: attestationResponse,
			expectedChallenge: options.webAuthn.challenge,
			expectedOrigin: origin,
			expectedRPID: rpID,
		});
	} catch (e) {
		if (
			e instanceof Object &&
			"message" in e &&
			typeof e.message === "string"
		) {
			error(400, e.message);
		}
		throw e;
	}

	const { verified, registrationInfo } = verification;

	assert(registrationInfo);
	const { credential, credentialDeviceType, credentialBackedUp } =
		registrationInfo;

	await db.insert(passkeysTable).values({
		id: credential.id,
		userId: user.userId,
		webAuthnUserId: options.webAuthn.user.id,
		// @ts-expect-error TypeScript is annoying
		publicKeyB64: credential.publicKey.toBase64(),
		counter: credential.counter,
		transports: (credential.transports ?? []).join(":"),
		deviceType: credentialDeviceType,
		backedUp: credentialBackedUp ? 1 : 0,
	});

	return Response.json({ verified });
}
