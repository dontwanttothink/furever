import { getUserDataByToken, InvalidSessionError } from "$lib/server/auth";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { error } from "@sveltejs/kit";
import { signingPair, rpID } from "$lib/server/auth/passkeys";
import { Temporal } from "temporal-polyfill";

export async function GET({ cookies }) {
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

	const options = {
		webauthn: await generateRegistrationOptions({
			rpName: "FureverHome",
			rpID,
			userName: user.email,
			userDisplayName: user.name,
		}),
		timestamp: Temporal.Now.instant().epochMilliseconds,
		userId: user.userId,
	};

	const optionsJSON = JSON.stringify(options);
	const encoder = new TextEncoder();
	const signature = await crypto.subtle.sign(
		"Ed25519",
		signingPair.privateKey,
		encoder.encode(optionsJSON),
	);

	const data = {
		optionsJSON,
		signature,
	};
	return Response.json(data, {
		status: 200,
	});
}
