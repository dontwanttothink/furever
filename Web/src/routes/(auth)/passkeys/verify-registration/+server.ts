import { env } from "$env/dynamic/private";
import * as z from "zod";
import { assert } from "$lib";
import { InvalidSessionError } from "$lib/server/auth/errors";
import { getCurrentTimestampInSeconds } from "$lib/server/auth/internal";
import { rpID, signingPair } from "$lib/server/auth/passkeys";
import { getUserDataByToken } from "$lib/server/auth/userData";
import { getDB } from "$lib/server/db/index";
import { passkeysTable } from "$lib/server/db/schema";
import {
	verifyRegistrationResponse,
	type RegistrationResponseJSON,
} from "@simplewebauthn/server";
import { error } from "@sveltejs/kit";
import { Temporal } from "temporal-polyfill";
import "$lib/polyfills/proposal-arraybuffer-base64.mjs";

const ClientKeyRegistrationResponse = z.object({
	optionsJSON: z.string(),
	signatureB64: z.base64(),
	attestationResponse: z.custom<RegistrationResponseJSON>((val) => {
		const ZRegistrationResponseJSON = z.object({
			id: z.base64url(),
			rawId: z.base64url(),
			response: z.object(), // 🤞😍
			authenticatorAttachment: z.optional(z.object()),
			clientExtensionResults: z.object(),
			type: z.literal("public-key"),
		});
		const { success } = ZRegistrationResponseJSON.safeParse(val);
		return success;
	}),
});

export async function POST({ request, cookies, platform }) {
	assert(platform?.env);

	const token = cookies.get("secret_token");
	if (!token) {
		error(401);
	}

	let user;
	try {
		user = await getUserDataByToken(token, platform.env);
	} catch (e) {
		if (e instanceof InvalidSessionError) {
			error(401);
		}
		throw e;
	}

	assert(env.ORIGIN, "The ORIGIN environment variable is not set.");
	const expectedOrigin = env.ORIGIN;
	const body = await request.json();
	const {
		optionsJSON,
		signatureB64,
		attestationResponse,
	}: {
		optionsJSON: string;
		signatureB64: string;
		attestationResponse: RegistrationResponseJSON;
	} = ClientKeyRegistrationResponse.parse(body);

	const signature = Uint8Array.fromBase64(signatureB64);

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
		webauthn: PublicKeyCredentialCreationOptionsJSON;
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
			expectedChallenge: options.webauthn.challenge,
			expectedOrigin,
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

	await getDB(platform.env.db)
		.insert(passkeysTable)
		.values({
			id: credential.id,
			userId: user.userId,
			webAuthnUserId: options.webauthn.user.id,
			publicKeyB64: credential.publicKey.toBase64(),
			counter: credential.counter,
			transports: (credential.transports ?? []).join(":"),
			deviceType: credentialDeviceType,
			backedUp: credentialBackedUp ? 1 : 0,
			createdAt: getCurrentTimestampInSeconds(),
		});

	return Response.json({ verified });
}
