// The casts in this file are needed because of subtle type differences
// between DOM-like types in Cloudflare Workers and the spec, which
// SvelteKit's type definitions want.

import { error, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params: { uuid }, platform }) => {
	if (!uuid || !platform?.env) {
		throw new TypeError();
	}

	const image = await platform.env.user_photography.get(uuid);
	if (image == null) {
		error(404);
	}

	const headers = new Headers();

	// image.writeHttpMetadata(headers); for some reason this throws ????????????
	// which really frustrated me. i hate computers.
	//
	// my typescript language server was also using the wrong fucking tsconfig
	// all the time and thinking i was on node, so i had to switch language servers.
	//
	// God take me

	const httpMetadataHeaderNames = new Map([
		["contentType", "content-type"],
		["contentLanguage", "content-language"],
		["contentDisposition", "content-disposition"],
		["contentEncoding", "content-encoding"],
		["cacheControl", "cache-control"],
		["cacheExpiry", "cache-expiry"],
	]);
	if (image.httpMetadata) {
		for (const [property, value] of Object.entries(image.httpMetadata)) {
			const name = httpMetadataHeaderNames.get(property);

			if (!name) {
				console.warn(
					`While serving an R2 image (${uuid}),\n` +
						`    unrecognized \`httpMetadata\` property: ${property}`,
				);
				continue;
			}
			headers.set(name, value);
		}
	}

	headers.set("etag", image.httpEtag);

	return new Response(image.body as unknown as ReadableStream, {
		headers,
	});
};
